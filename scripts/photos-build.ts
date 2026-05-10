#!/usr/bin/env bun
/// <reference types="bun" />
//
// scripts/photos-build.ts
//
// Generates src/data/photos.json from photos.config.ts + the contents of an R2
// bucket. Run this locally before deploys whenever you add/remove/edit photos.
//
// Run with: bun run photos:build  (or: bun run photos:build:force)
// Requires .env with R2_* vars set. See .env.example.
//
// Behavior:
//   1. Reads photos.config.ts (PhotoEntry[]).
//   2. Lists R2 originals/ to map id -> key + extension.
//   3. Fails loudly if any configured id is missing in originals/.
//   4. For each id, generates 400 + 800 (only those < original width) AVIF
//      (q60) + WebP (q80) variants, plus a 32px blurred JPEG LQIP data URI.
//   5. Skips ids whose variants already exist in R2 unless --force is set.
//   6. Writes src/data/photos.json in config order; drops ids no longer in
//      config.
//
// Bun handles .env loading natively. No dotenv. No @aws-sdk. No tsx.

import sharp from 'sharp';
import { S3Client } from 'bun';
import { existsSync } from 'node:fs';
import { writeFile, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import type { PhotoEntry } from '../photos.config.ts';

const ROOT = resolve(import.meta.dir, '..');
const PHOTOS_JSON_PATH = resolve(ROOT, 'src/data/photos.json');
const PHOTOS_CONFIG_PATH = resolve(ROOT, 'photos.config.ts');
const FORCE = process.argv.includes('--force');
// Variant widths. Matched against original width — sizes >= original are
// dropped, since upscaling is pointless. Lightbox always falls back to the
// original from R2, so these only need to cover gallery + retina display.
//   800   ~ gallery thumb on retina, mobile @1x
//   1600  ~ gallery thumb on high-DPR mobile, lightbox preview
//   2400  ~ near-full-screen lightbox before original loads, retina laptop
const SIZES = [800, 1600, 2400] as const;
const AVIF_QUALITY = 65;
const WEBP_QUALITY = 82;

type Variant = 'avif' | 'webp';
const VARIANTS: readonly Variant[] = ['avif', 'webp'] as const;

type PhotoRecord = {
  id: string;
  alt: string;
  caption: string | null;
  tags: string[];
  takenAt: string | null;
  featured: boolean;
  gallery: boolean;
  width: number;
  height: number;
  aspectRatio: number;
  lqip: string;
  variants: { avif: number[]; webp: number[] };
  originalExt: string;
};

type PhotosJson = {
  generatedAt: string;
  photos: PhotoRecord[];
};

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    console.error(`Missing required env var: ${name}`);
    process.exit(1);
  }
  return v;
}

function contentTypeFor(ext: string): string {
  switch (ext.toLowerCase()) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'avif':
      return 'image/avif';
    case 'webp':
      return 'image/webp';
    case 'heic':
      return 'image/heic';
    case 'heif':
      return 'image/heif';
    case 'gif':
      return 'image/gif';
    default:
      return 'application/octet-stream';
  }
}

async function loadExistingPhotosJson(): Promise<PhotosJson | null> {
  if (!existsSync(PHOTOS_JSON_PATH)) return null;
  try {
    const txt = await readFile(PHOTOS_JSON_PATH, 'utf8');
    return JSON.parse(txt) as PhotosJson;
  } catch (e) {
    console.warn(`Could not parse existing photos.json (${(e as Error).message}), ignoring cache.`);
    return null;
  }
}

async function listOriginals(r2: S3Client): Promise<Map<string, { key: string; ext: string }>> {
  const result = await r2.list({ prefix: 'originals/' });
  const map = new Map<string, { key: string; ext: string }>();
  const contents = (result?.contents ?? []) as Array<{ key?: string; Key?: string }>;
  for (const obj of contents) {
    const key = obj.key ?? obj.Key;
    if (!key) continue;
    if (key === 'originals/' || key.endsWith('/')) continue;
    const filename = key.slice('originals/'.length);
    const dot = filename.lastIndexOf('.');
    if (dot <= 0) continue;
    const id = filename.slice(0, dot);
    const ext = filename.slice(dot + 1).toLowerCase();
    map.set(id, { key, ext });
  }
  return map;
}

async function variantExists(r2: S3Client, key: string): Promise<boolean> {
  // Bun's S3Client exposes `.exists(key)`; fall back to file().exists() if absent.
  const anyR2 = r2 as unknown as { exists?: (k: string) => Promise<boolean> };
  if (typeof anyR2.exists === 'function') {
    return await anyR2.exists(key);
  }
  return await r2.file(key).exists();
}

async function allVariantsPresent(
  r2: S3Client,
  id: string,
  sizes: readonly number[],
): Promise<boolean> {
  for (const w of sizes) {
    for (const v of VARIANTS) {
      const ok = await variantExists(r2, `variants/${id}/${w}.${v}`);
      if (!ok) return false;
    }
  }
  return true;
}

async function downloadOriginal(r2: S3Client, key: string): Promise<Buffer> {
  const ab = await r2.file(key).arrayBuffer();
  return Buffer.from(ab);
}

async function uploadVariant(
  r2: S3Client,
  key: string,
  body: Buffer,
  type: string,
): Promise<void> {
  await r2.write(key, body, { type });
}

async function processPhoto(
  r2: S3Client,
  entry: PhotoEntry,
  original: { key: string; ext: string },
): Promise<PhotoRecord> {
  const buf = await downloadOriginal(r2, original.key);

  // sharp(...).rotate() with no args = apply EXIF orientation, strip the tag.
  // Must run before metadata read so width/height match the rotated pixels —
  // otherwise portrait shots come out landscape.
  const meta = await sharp(buf).rotate().metadata();
  const width = meta.width;
  const height = meta.height;
  if (!width || !height) {
    throw new Error(`Could not read dimensions for ${entry.id} (${original.key})`);
  }

  const sizesToGenerate = SIZES.filter((w) => w < width);

  const generated: { avif: number[]; webp: number[] } = { avif: [], webp: [] };
  for (const w of sizesToGenerate) {
    const avifBuf = await sharp(buf).rotate().resize(w).avif({ quality: AVIF_QUALITY }).toBuffer();
    await uploadVariant(r2, `variants/${entry.id}/${w}.avif`, avifBuf, 'image/avif');
    generated.avif.push(w);

    const webpBuf = await sharp(buf).rotate().resize(w).webp({ quality: WEBP_QUALITY }).toBuffer();
    await uploadVariant(r2, `variants/${entry.id}/${w}.webp`, webpBuf, 'image/webp');
    generated.webp.push(w);
  }

  const lqipBuf = await sharp(buf).rotate().resize(32).blur(2).jpeg({ quality: 50 }).toBuffer();
  const lqip = `data:image/jpeg;base64,${lqipBuf.toString('base64')}`;

  return {
    id: entry.id,
    alt: entry.alt,
    caption: entry.caption ?? null,
    tags: entry.tags ?? [],
    takenAt: entry.takenAt ?? null,
    featured: entry.featured ?? false,
    gallery: entry.gallery ?? true,
    width,
    height,
    aspectRatio: Math.round((width / height) * 10000) / 10000,
    lqip,
    variants: generated,
    originalExt: original.ext,
  };
}

async function main(): Promise<void> {
  const accountId = requireEnv('R2_ACCOUNT_ID');
  const accessKeyId = requireEnv('R2_ACCESS_KEY_ID');
  const secretAccessKey = requireEnv('R2_SECRET_ACCESS_KEY');
  const bucket = requireEnv('R2_BUCKET');

  const r2 = new S3Client({
    accessKeyId,
    secretAccessKey,
    bucket,
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  });

  const configMod = (await import(PHOTOS_CONFIG_PATH)) as { photos: PhotoEntry[] };
  const config = configMod.photos;
  if (!Array.isArray(config)) {
    console.error('photos.config.ts did not export a `photos` array.');
    process.exit(1);
  }

  const seen = new Set<string>();
  const dupes = new Set<string>();
  for (const e of config) {
    if (seen.has(e.id)) dupes.add(e.id);
    seen.add(e.id);
  }
  if (dupes.size > 0) {
    console.error('Duplicate ids in photos.config.ts:');
    for (const id of dupes) console.error(`  - ${id}`);
    process.exit(1);
  }

  const existing = await loadExistingPhotosJson();
  const existingById = new Map<string, PhotoRecord>(
    (existing?.photos ?? []).map((p) => [p.id, p]),
  );

  const originals = await listOriginals(r2);

  // Verify every configured id exists in R2 originals.
  const missing = config.filter((e) => !originals.has(e.id)).map((e) => e.id);
  if (missing.length > 0) {
    console.error('Missing originals in R2 for the following ids:');
    for (const id of missing) console.error(`  - ${id}`);
    process.exit(1);
  }

  let processed = 0;
  let skipped = 0;
  const out: PhotoRecord[] = [];

  for (const entry of config) {
    const original = originals.get(entry.id)!;
    const cached = existingById.get(entry.id);

    // Compute expected sizes from cached width if known, else assume both.
    const expectedSizes = cached
      ? SIZES.filter((w) => w < cached.width)
      : SIZES;

    const canSkip =
      !FORCE &&
      cached !== undefined &&
      (await allVariantsPresent(r2, entry.id, expectedSizes));

    if (canSkip && cached) {
      // Update mutable metadata from config (alt/caption/tags/etc) without
      // regenerating images.
      out.push({
        ...cached,
        alt: entry.alt,
        caption: entry.caption ?? null,
        tags: entry.tags ?? [],
        takenAt: entry.takenAt ?? null,
        featured: entry.featured ?? false,
        gallery: entry.gallery ?? true,
        originalExt: original.ext,
      });
      skipped++;
      continue;
    }

    console.log(`Processing ${entry.id}...`);
    const record = await processPhoto(r2, entry, original);
    out.push(record);
    processed++;
  }

  const removed = (existing?.photos ?? []).filter(
    (p) => !config.some((e) => e.id === p.id),
  ).length;

  const json: PhotosJson = {
    generatedAt: new Date().toISOString(),
    photos: out,
  };

  await writeFile(PHOTOS_JSON_PATH, JSON.stringify(json, null, 2) + '\n', 'utf8');

  console.log(
    `Processed ${processed}, skipped ${skipped}, removed ${removed}. photos.json updated.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
