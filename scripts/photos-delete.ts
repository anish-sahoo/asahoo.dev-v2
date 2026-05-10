#!/usr/bin/env bun
/// <reference types="bun" />
//
// scripts/photos-delete.ts
//
// Removes one or more photos cleanly: deletes the original + every variant
// from R2, removes the entry from photos.config.ts, and drops it from
// src/data/photos.json. Warns if the id is still referenced by an MDX note,
// because that would break the next build (Astro silently truncates the
// page when a `<Photo id>` lookup throws).
//
// Usage:
//   bun run photos:delete <id> [<id> ...]
//   bun run photos:delete <id> --yes      # skip confirmation prompt

import { S3Client } from 'bun';
import { existsSync } from 'node:fs';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    console.error(`Missing required env var: ${name}`);
    process.exit(1);
  }
  return v;
}

const ROOT = resolve(import.meta.dir, '..');
const CONFIG_PATH = resolve(ROOT, 'photos.config.ts');
const PHOTOS_JSON_PATH = resolve(ROOT, 'src/data/photos.json');
const NOTES_DIR = resolve(ROOT, 'src/content/notes');

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const skipConfirm = flags.has('--yes') || flags.has('-y');
const ids = args.filter((a) => !a.startsWith('--'));

if (ids.length === 0) {
  console.error('Usage: bun run photos:delete <id> [<id> ...] [--yes]');
  process.exit(1);
}

const r2 = new S3Client({
  accessKeyId: requireEnv('R2_ACCESS_KEY_ID'),
  secretAccessKey: requireEnv('R2_SECRET_ACCESS_KEY'),
  bucket: requireEnv('R2_BUCKET'),
  endpoint: `https://${requireEnv('R2_ACCOUNT_ID')}.r2.cloudflarestorage.com`,
});

type Plan = { id: string; keys: string[] };
const plans: Plan[] = [];

for (const id of ids) {
  const keys: string[] = [];
  const origList = await r2.list({ prefix: `originals/${id}.` });
  const variantList = await r2.list({ prefix: `variants/${id}/` });
  for (const obj of [
    ...((origList?.contents ?? []) as Array<{ key?: string; Key?: string }>),
    ...((variantList?.contents ?? []) as Array<{ key?: string; Key?: string }>),
  ]) {
    const k = obj.key ?? obj.Key;
    if (k) keys.push(k);
  }
  plans.push({ id, keys });
}

const mdxRefs: { id: string; files: string[] }[] = [];
const noteFiles = existsSync(NOTES_DIR)
  ? (await readdir(NOTES_DIR)).filter((f) => /\.mdx?$/.test(f))
  : [];
for (const id of ids) {
  const files: string[] = [];
  const idEsc = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`<Photo[^>]+id=["']${idEsc}["']`);
  for (const f of noteFiles) {
    const content = await readFile(resolve(NOTES_DIR, f), 'utf8');
    if (re.test(content)) files.push(f);
  }
  if (files.length) mdxRefs.push({ id, files });
}

console.log('Photos to delete:');
for (const plan of plans) {
  console.log(`  ${plan.id}`);
  if (plan.keys.length === 0) {
    console.log('    (no keys in R2 — already gone, or wrong id)');
  } else {
    for (const k of plan.keys) console.log(`    R2: ${k}`);
  }
}

if (mdxRefs.length > 0) {
  console.log('\n⚠  These ids are still referenced by MDX notes:');
  for (const r of mdxRefs) {
    console.log(`    ${r.id}  →  ${r.files.join(', ')}`);
  }
  console.log('   Builds for those notes will silently truncate until you remove or swap the <Photo id> lines.');
}

const totalKeys = plans.reduce((s, p) => s + p.keys.length, 0);
if (totalKeys === 0) {
  console.log('\nNothing to delete in R2 (config + photos.json may still have stale entries — proceeding will scrub them).');
}

if (!skipConfirm) {
  const answer = prompt('\nProceed? (y/N) ');
  if ((answer ?? '').trim().toLowerCase() !== 'y') {
    console.log('Aborted.');
    process.exit(0);
  }
}

for (const plan of plans) {
  for (const k of plan.keys) {
    await r2.delete(k);
    console.log(`Deleted ${k}`);
  }
}

let configChanged = false;
if (existsSync(CONFIG_PATH)) {
  let configSrc = await readFile(CONFIG_PATH, 'utf8');
  for (const id of ids) {
    const updated = removeEntryFromConfig(configSrc, id);
    if (updated !== null) {
      configSrc = updated;
      configChanged = true;
      console.log(`Removed ${id} from photos.config.ts`);
    }
  }
  if (configChanged) await writeFile(CONFIG_PATH, configSrc);
}

if (existsSync(PHOTOS_JSON_PATH)) {
  const json = JSON.parse(await readFile(PHOTOS_JSON_PATH, 'utf8')) as {
    photos: Array<{ id: string }>;
  };
  const before = json.photos.length;
  json.photos = json.photos.filter((p) => !ids.includes(p.id));
  const removed = before - json.photos.length;
  if (removed > 0) {
    await writeFile(PHOTOS_JSON_PATH, JSON.stringify(json, null, 2) + '\n');
    console.log(`Removed ${removed} entr${removed === 1 ? 'y' : 'ies'} from src/data/photos.json`);
  }
}

console.log('Done.');

/**
 * Walks the source character-by-character to find the object literal whose
 * `id` field matches `id`, then removes the whole literal — including its
 * trailing comma, optional `// ...` comment, and the surrounding line.
 * Returns the modified source, or null if the entry wasn't found.
 */
function removeEntryFromConfig(src: string, id: string): string | null {
  const idEsc = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const opener = new RegExp(`\\{\\s*id\\s*:\\s*['"\`]${idEsc}['"\`]`);
  const m = opener.exec(src);
  if (!m) return null;

  const start = m.index;
  let depth = 0;
  let end = -1;
  for (let i = start; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  if (end === -1) return null;

  while (end < src.length && (src[end] === ' ' || src[end] === '\t' || src[end] === ',')) end++;
  if (src[end] === '/' && src[end + 1] === '/') {
    while (end < src.length && src[end] !== '\n') end++;
  }
  if (src[end] === '\n') end++;

  let lineStart = start;
  while (lineStart > 0 && src[lineStart - 1] !== '\n') lineStart--;

  return src.slice(0, lineStart) + src.slice(end);
}
