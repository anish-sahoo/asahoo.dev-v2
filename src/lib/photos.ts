import data from '@/data/photos.json';

export type PhotoVariant = { avif: number[]; webp: number[] };

export type Photo = {
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
  variants: PhotoVariant;
  originalExt: string;
};

export type PhotosManifest = {
  generatedAt: string;
  photos: Photo[];
};

const manifest = data as PhotosManifest;

export function getAllPhotos(): Photo[] {
  return manifest.photos;
}

export function getGalleryPhotos(): Photo[] {
  return manifest.photos.filter((p) => p.gallery !== false);
}

export function getPhoto(id: string): Photo {
  const photo = manifest.photos.find((p) => p.id === id);
  if (!photo) {
    throw new Error(
      `Photo not found in src/data/photos.json: "${id}". ` +
        `Add it to photos.config.ts and run \`bun run photos:build\`.`
    );
  }
  return photo;
}

export function publicBase(): string {
  const base = import.meta.env.R2_PUBLIC_BASE ?? 'https://img.asahoo.dev';
  return base.replace(/\/$/, '');
}

export function variantUrl(id: string, width: number, ext: 'avif' | 'webp'): string {
  return `${publicBase()}/variants/${id}/${width}.${ext}`;
}

export function originalUrl(photo: Photo): string {
  return `${publicBase()}/originals/${photo.id}.${photo.originalExt}`;
}
