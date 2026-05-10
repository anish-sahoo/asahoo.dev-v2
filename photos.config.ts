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
  { id: '72cf3941-7995-4914-acc4-278db1f659c3', alt: 'nyc-skyline-taxi', tags: ['nyc', 'street photography'] }, // DSCF0258.JPG
  { id: '84b3b048-f566-4490-9d71-c656389dadfa', alt: '', tags: ['nyc', 'street photography'] }, // DSCF0237.JPG
  { id: 'bfcebd0d-68b7-4791-b965-c9612248c816', alt: '', tags: ['nyc', 'street photography'] }, // DSCF0191.JPG
  { id: '1ddaa08e-d8da-4c28-a134-9e1d432aacd6', alt: '', tags: ['nyc', 'street photography'] }, // DSCF0131-converted.JPG
  { id: '9048fb63-73e2-401e-8b9d-7eeb7ed33cf5', alt: '', tags: ['nyc', 'street photography'] }, // DSCF0026.JPG
  { id: '0f843c24-38f8-4860-ba1d-74be7a8f0a80', alt: '', tags: ['national park'] }, // DSCF2687.JPG
  { id: '0d841734-4ecb-4d46-b3da-0e5ef35549db', alt: '', tags: ['national park'] }, // DSCF2406.JPG
  { id: '0b9ef1b4-b73d-4ad3-8e6e-d0197f8e6af1', alt: '', tags: ['flight'] }, // DSCF0482.JPG
  { id: 'e2fd6a1d-e44d-47b8-8124-348bc12f4b9f', alt: '', tags: ['utah'] }, // DSCF0533.JPG
  { id: 'bf9dcfac-225f-41b7-bc29-40efa5374f1a', alt: '', tags: ['street photography'] }, // DSCF1219.JPG
  { id: '412d06ff-3767-4f9f-81e4-a688fd15af90', alt: '', tags: ['cityscape'] }, // DSCF0430-converted.JPG
  { id: 'a3dd1e7d-5d68-4911-9818-ea9639d8d20a', alt: '', tags: ['cityscape'] }, // DSCF1178-converted.JPG
];