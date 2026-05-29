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
  { id: '84b3b048-f566-4490-9d71-c656389dadfa', alt: '', tags: ['nyc', 'street photography'] }, // DSCF0237.JPG
  { id: '1ddaa08e-d8da-4c28-a134-9e1d432aacd6', alt: '', tags: ['nyc', 'street photography'] }, // DSCF0131-converted.JPG
  { id: 'defb3930-f4fc-4078-9f96-721a64061108', alt: 'nyc-skyline-night', tags: ['nyc', 'cityscape'] }, // DSCF4349.JPG
  { id: '0f843c24-38f8-4860-ba1d-74be7a8f0a80', alt: '', tags: ['national park'] }, // DSCF2687.JPG
  { id: '0d841734-4ecb-4d46-b3da-0e5ef35549db', alt: '', tags: ['national park'] }, // DSCF2406.JPG
  { id: '72cf3941-7995-4914-acc4-278db1f659c3', alt: 'nyc-skyline-taxi', tags: ['nyc', 'street photography'] }, // DSCF0258.JPG
  { id: '0b9ef1b4-b73d-4ad3-8e6e-d0197f8e6af1', alt: '', tags: ['flight'] }, // DSCF0482.JPG
  { id: 'e2fd6a1d-e44d-47b8-8124-348bc12f4b9f', alt: '', tags: ['utah'] }, // DSCF0533.JPG
  { id: 'bf9dcfac-225f-41b7-bc29-40efa5374f1a', alt: '', tags: ['street photography'] }, // DSCF1219.JPG
  { id: '412d06ff-3767-4f9f-81e4-a688fd15af90', alt: '', tags: ['cityscape'] }, // DSCF0430-converted.JPG
  { id: 'a3dd1e7d-5d68-4911-9818-ea9639d8d20a', alt: '', tags: ['cityscape'] }, // DSCF1178-converted.JPG
  { id: 'fab8901e-e5d6-40f3-8614-4ee831fbc780', alt: 'boat-sunny-morning', tags: ['street photography', 'seattle'] }, // DSCF2114_edited.JPG
  { id: '3a862463-52e9-4c4a-ad5e-1847bc61e523', alt: 'pike-place-market-people', tags: ['street photography', 'seattle'] }, // DSCF2278_edited.JPG
  { id: '773f2ed5-5ab2-4f76-ac52-965cc04d5b89', alt: 'people-sitting-pike-place', tags: ['street photography', 'seattle'] }, // DSCF2265_edited.JPG
  { id: 'dfb9e901-1909-4700-8d73-14138105172f', alt: '', tags: ['street photography', 'seattle'] }, // DSCF2271_edited.JPG
  { id: '43e8d1e9-498c-41ba-bb4e-402e61e6e2a8', alt: '', tags: ['street photography', 'seattle'] }, // DSCF2248_edited.JPG
  { id: 'ce023276-0ac3-4921-ad22-708c0a16cb53', alt: '', tags: ['street photography', 'seattle'] }, // DSCF2241_edited.JPG
  { id: 'fa6b6654-9a6f-400b-a536-01c28fb31433', alt: '', tags: ['street photography', 'seattle'] }, // DSCF1627_edited.JPG
  { id: '22ffcdca-62c0-4bb5-b351-fe0dea22e0df', alt: '', tags: ['street photography', 'seattle'] }, // DSCF1641_edited.JPG
];