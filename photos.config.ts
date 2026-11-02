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
  { id: 'd9ddea01-965a-49d6-b129-3477d631398a', alt: 'norway-reinebringen-peak', tags: ['norway', 'landscape']}, // DSC02355_edited.JPG
  { id: '1ddaa08e-d8da-4c28-a134-9e1d432aacd6', alt: '', tags: ['nyc', 'street photography'] }, // DSCF0131-converted.JPG
  { id: '84b3b048-f566-4490-9d71-c656389dadfa', alt: '', tags: ['nyc', 'street photography'] }, // DSCF0237.JPG
  { id: 'ce023276-0ac3-4921-ad22-708c0a16cb53', alt: '', tags: ['street photography', 'seattle'] }, // DSCF2241_edited.JPG
  { id: '0b9ef1b4-b73d-4ad3-8e6e-d0197f8e6af1', alt: '', tags: ['flight'] }, // DSCF0482.JPG
  { id: 'a3dd1e7d-5d68-4911-9818-ea9639d8d20a', alt: '', tags: ['cityscape'] }, // DSCF1178-converted.JPG
  { id: 'fab8901e-e5d6-40f3-8614-4ee831fbc780', alt: 'boat-sunny-morning', tags: ['street photography', 'seattle'] }, // DSCF2114_edited.JPG
  { id: '412d06ff-3767-4f9f-81e4-a688fd15af90', alt: '', tags: ['cityscape'] }, // DSCF0430-converted.JPG
  { id: 'fdf95dc5-6007-4510-805c-c5ef0fb03556', alt: '', tags: ['austin', 'street photography', 'fireworks'] }, // DSC00738_edited.JPG
  { id: 'e1d2bb4a-49ff-4bac-ba59-808617b63d86', alt: 'norway-a-mountain-sun', tags: ['norway', 'landscape'] }, // DSC02578_edited.JPG
  { id: '72cf3941-7995-4914-acc4-278db1f659c3', alt: 'nyc-skyline-taxi', tags: ['nyc', 'street photography'] }, // DSCF0258.JPG
  { id: '569cf0a5-9503-4ef6-8860-f776dd1792da', alt: 'norway-ryten-wildflowers', tags: ['norway', 'landscape'] }, // DSC03056_edited.JPG
  { id: '55a31fc6-603d-4948-aab6-28a8b954d32e', alt: 'norway-oslo-downtown', tags: ['norway', 'street photography'] }, // DSC01617_edited.JPG
  { id: '22ffcdca-62c0-4bb5-b351-fe0dea22e0df', alt: '', tags: ['street photography', 'seattle'] }, // DSCF1641_edited.JPG
  { id: 'dfcd3753-d3e3-49d6-8018-bacead4c4712', alt: 'nyc-skyline-blue', tags: ['nyc', 'cityscape'] }, // DSCF1202.JPG
  { id: '3a862463-52e9-4c4a-ad5e-1847bc61e523', alt: 'pike-place-market-people', tags: ['street photography', 'seattle'] }, // DSCF2278_edited.JPG
  { id: 'b3d38982-973b-472e-bb42-bdf08b33082a', alt: 'norway-aurora', tags: ['norway', 'landscape', 'astrophotography'] }, // DSC02321_edited.JPG
  { id: 'defb3930-f4fc-4078-9f96-721a64061108', alt: 'nyc-skyline-night', tags: ['nyc', 'cityscape'] }, // DSCF4349.JPG
  { id: 'f1f84c04-3367-4a49-8968-16d290310d88', alt: 'norway-uttakliev-beach-sunset', tags: ['norway', 'landscape'] }, // DSC03395_edited_1.JPG
  { id: 'fa6b6654-9a6f-400b-a536-01c28fb31433', alt: '', tags: ['street photography', 'seattle'] }, // DSCF1627_edited.JPG
  { id: 'e2fd6a1d-e44d-47b8-8124-348bc12f4b9f', alt: '', tags: ['utah'] }, // DSCF0533.JPG
  { id: 'dfb9e901-1909-4700-8d73-14138105172f', alt: '', tags: ['street photography', 'seattle'] }, // DSCF2271_edited.JPG
  { id: '43e8d1e9-498c-41ba-bb4e-402e61e6e2a8', alt: '', tags: ['street photography', 'seattle'] }, // DSCF2248_edited.JPG
];