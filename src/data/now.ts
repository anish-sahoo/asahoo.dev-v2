export type CurrentlyEntry = {
  label: string;       // e.g. "reading"
  value: string;       // e.g. "designing data-intensive applications"
  detail?: string;     // optional longer explanation, only shown on /now
  hidden?: boolean;    // default false — set true to hide from homepage + /now
                       // without deleting the entry (preserves drafts/stubs).
};

export const lastUpdated = new Date('2026-07-14');

export function visibleCurrently(): CurrentlyEntry[] {
  return currently.filter((e) => !e.hidden);
}

export const currently: CurrentlyEntry[] = [
  {
    label: 'working at',
    value: 'Cloudflare, Inc.',
    detail: 'I work on their AI Platform, contributing to Workers AI and replicate/cog.',
  },
  {
    label: 'reading',
    value: 'designing data-intensive applications',
    detail: 'second pass. the chapter on consensus is doing a lot of heavy lifting this time around.',
    hidden: true
  },
  {
    label: 'listening on',
    value: 'Hifiman Arya Stealth + Fiio K11 R2R',
    detail: 'mostly pop and kpop and jpop while working. the Arya Stealth finally sounds the way the forums promised after adding the R2R dac.',
  },
  {
    label: 'shooting',
    value: 'sony a7v, 24-50 f/2.8',
    detail: 'walking around cities on weekends. trying to be less precious about the shutter.',
  },
  {
    label: 'building',
    value: "leap, a macOS-native fast window switcher",
    detail: 'a fast window switcher that is lightweight and snappy',
  },
];
