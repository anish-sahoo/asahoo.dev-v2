# asahoo.dev

Personal site. Astro + MDX, Cloudflare Workers, R2 for photos.

## Adding photos

The flow is: drop the file → run upload → fill in metadata → build the manifest.

```bash
# 1. Upload one or more files. Each gets renamed to a UUID in R2 and an
#    entry is auto-appended to `photos.config.ts`.
bun run photos:upload ~/Pictures/2026-04-22-shibuya.jpg

# 2. Open photos.config.ts and fill in alt (the trailing comment shows the
#    original filename). Optionally add caption / tags / takenAt / featured.
$EDITOR photos.config.ts

# 3. Generate variants (400/800/1600/2400 in AVIF + WebP) and update the
#    photos.json manifest. Idempotent — re-runs are no-ops.
bun run photos:build

# 4. Commit and deploy.
git add . && git commit -m "add photo: shibuya"
bun run deploy
```

### Notes

- Filenames don't matter — the upload script mints a UUID. Original filename is preserved as a trailing comment in `photos.config.ts` so you can match entries to source.
- For inline note images that need a stable id (e.g. `<Photo id="diagram-foo" />`), pass `--id <slug>`:
  ```bash
  bun run photos:upload ~/diagram.png --id diagram-foo
  ```
- Refusing-to-overwrite: `photos:upload` won't replace an existing R2 key, so you can never silently lose a photo.
- `--force`: `bun run photos:build:force` regenerates every variant even if R2 already has them. Use after changing variant sizes or quality settings in `scripts/photos-build.ts`.
- Removing a photo:
  ```bash
  bun run photos:delete <id>            # confirms before doing anything
  bun run photos:delete <id> --yes      # skip the confirm prompt
  ```
  Deletes the original + every variant from R2, removes the entry from `photos.config.ts`, drops it from `src/data/photos.json`. Warns if the id is referenced by an MDX note (which would silently truncate the build until you fix the reference).

## Adding notes

Drop an `.mdx` file in `src/content/notes/`. Frontmatter:

```mdx
---
title: title in sentence case
date: 2026-05-10
description: one-sentence summary, required for SEO.
tags: [optional, list]
updated: 2026-05-15  # optional
draft: false         # set true to hide
---

import Photo from '@/components/Photo.astro';

Body here. Standard MDX — code blocks (Shiki dual-themed), `inline code`,
> blockquotes,
mermaid diagrams via ` ```mermaid `, and inline photos via `<Photo id="..." />`.
```

The `<Photo id>` must exist in `src/data/photos.json` or the build silently truncates the page (Astro SSR streaming swallows the throw). If you reference a photo that's no longer present after `photos:build`, either swap the id or remove the line.

## Deploying

```bash
bun run build
bun run deploy
```
