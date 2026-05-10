export type PhotoEntry = {
  id: string;
  alt: string;
  caption?: string;
  tags?: string[];
  takenAt?: string; // ISO date
  featured?: boolean;
  gallery?: boolean; // default true
};

// Entries below are appended automatically by `bun run photos:upload`.
// Edit alt/caption/tags/takenAt/featured/gallery after upload.
// To reorder the gallery, reorder this array.
export const photos: PhotoEntry[] = [
  { id: 'a152a662-ff92-4277-b6b0-17ba2cfb40ac', alt: 'big-sur-car', tags: ['california', 'moody', 'forest'] }, // DSCF0431-best.JPG
  { id: 'defb3930-f4fc-4078-9f96-721a64061108', alt: 'nyc-skyline-night', tags: ['nyc', 'cityscape'] }, // DSCF4349.JPG
];