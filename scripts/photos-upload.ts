#!/usr/bin/env bun
/// <reference types="bun" />
//
// scripts/photos-upload.ts
//
// Uploads one or more local files to R2 under originals/<uuid>.<ext>, then
// appends a stub entry to photos.config.ts so you only ever edit metadata —
// never type an id. The original filename is preserved as a trailing comment
// for memory.
//
// Usage:
//   bun run photos:upload <file> [<file> ...]
//   bun run photos:upload <file> --id <slug>     # override UUID with a slug
//                                                  (use for inline note
//                                                  photos that get a stable
//                                                  <Photo id="..."/> handle)
//   bun run photos:upload <file> --no-config     # skip config append
//
// Refuses to overwrite if the remote key already exists, which with random
// UUIDs is astronomically unlikely but still good hygiene.

import { S3Client } from 'bun';
import { basename, extname, resolve } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';

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

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const idOverrideIdx = args.indexOf('--id');
const idOverride = idOverrideIdx >= 0 ? args[idOverrideIdx + 1] : null;
const noConfig = flags.has('--no-config');

const files = args.filter((a, i) => {
  if (a.startsWith('--')) return false;
  if (idOverrideIdx >= 0 && i === idOverrideIdx + 1) return false;
  return true;
});

if (files.length === 0) {
  console.error('Usage: bun run photos:upload <file> [<file> ...] [--id <slug>] [--no-config]');
  process.exit(1);
}

if (idOverride && files.length > 1) {
  console.error('--id <slug> only valid with a single file (slugs must be unique).');
  process.exit(1);
}

const r2 = new S3Client({
  accessKeyId: requireEnv('R2_ACCESS_KEY_ID'),
  secretAccessKey: requireEnv('R2_SECRET_ACCESS_KEY'),
  bucket: requireEnv('R2_BUCKET'),
  endpoint: `https://${requireEnv('R2_ACCOUNT_ID')}.r2.cloudflarestorage.com`,
});

type Uploaded = { id: string; ext: string; sourceName: string };
const uploaded: Uploaded[] = [];
let failures = 0;

for (const path of files) {
  const local = Bun.file(path);
  if (!(await local.exists())) {
    console.error(`Not found: ${path}`);
    failures++;
    continue;
  }

  const sourceName = basename(path);
  const ext = extname(sourceName).slice(1).toLowerCase();
  if (!ext) {
    console.error(`No extension on ${sourceName} — refusing to upload.`);
    failures++;
    continue;
  }

  const id = idOverride ?? randomUUID();
  const key = `originals/${id}.${ext}`;

  if (await r2.exists(key)) {
    console.error(
      `Refusing to overwrite ${key}. ` +
        `Remove --id <slug> to mint a fresh UUID, or delete the remote object first.`,
    );
    failures++;
    continue;
  }

  const buf = await local.arrayBuffer();
  await r2.write(key, buf);
  console.log(`Uploaded ${key} (${buf.byteLength.toLocaleString()} bytes)  ← ${sourceName}`);
  uploaded.push({ id, ext, sourceName });
}

if (uploaded.length > 0 && !noConfig) {
  await appendToConfig(uploaded);
  console.log(`Appended ${uploaded.length} entr${uploaded.length === 1 ? 'y' : 'ies'} to photos.config.ts.`);
  console.log('Open it and fill in alt/caption/tags, then run `bun run photos:build`.');
}

if (failures > 0) {
  console.error(`\n${failures} file(s) skipped or failed.`);
  process.exit(1);
}

async function appendToConfig(entries: Uploaded[]): Promise<void> {
  const src = await readFile(CONFIG_PATH, 'utf8');

  const lines = entries
    .map((e) => `  { id: '${e.id}', alt: '' }, // ${e.sourceName}`)
    .join('\n');

  // Insert before the line that closes the photos array. Looks for `^];` —
  // if your photos.config.ts has been hand-edited into a shape this regex
  // can't find, run with --no-config and paste the entries manually.
  const updated = src.replace(/^\];\s*$/m, `${lines}\n];`);

  if (updated === src) {
    console.error(
      'Could not find array close (`];` on its own line) in photos.config.ts. ' +
        'Append these entries manually:\n' + lines,
    );
    process.exit(1);
  }

  await writeFile(CONFIG_PATH, updated);
}
