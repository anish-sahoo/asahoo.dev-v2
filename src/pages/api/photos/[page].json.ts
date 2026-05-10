import type { APIRoute } from 'astro';
import { getGalleryPhotos } from '@/lib/photos';

export const prerender = true;

const PAGE_SIZE = 20;

export async function getStaticPaths() {
  const photos = getGalleryPhotos();
  const totalPages = Math.max(1, Math.ceil(photos.length / PAGE_SIZE));
  return Array.from({ length: totalPages }, (_, i) => ({
    params: { page: String(i) },
  }));
}

export const GET: APIRoute = ({ params }) => {
  const photos = getGalleryPhotos();
  const page = Number(params.page);
  const start = page * PAGE_SIZE;
  const slice = photos.slice(start, start + PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(photos.length / PAGE_SIZE));
  const next = page + 1 < totalPages ? `/api/photos/${page + 1}.json` : null;
  return new Response(JSON.stringify({ photos: slice, next }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
