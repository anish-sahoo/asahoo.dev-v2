export type CurrentlyEntry = {
  label: string;       // e.g. "reading"
  value: string;       // e.g. "designing data-intensive applications"
  detail?: string;     // optional longer explanation, only shown on /now
  hidden?: boolean;    // default false — set true to hide from homepage + /now
                       // without deleting the entry (preserves drafts/stubs).
};

export const lastUpdated = new Date('2026-05-10');

export function visibleCurrently(): CurrentlyEntry[] {
  return currently.filter((e) => !e.hidden);
}

export const currently: CurrentlyEntry[] = [
  {
    label: 'working at',
    value: 'MasterControl',
    detail: 'short description of what i do day-to-day there.',
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
    value: 'fuji X-T4, 23mm f/2, 33mm f/1.4',
    detail: 'walking around cities on weekends. trying to be less precious about the shutter.',
  },
  {
    label: 'building',
    value: "an anime recommendation system",
    detail: 'a crazy overengineered recommendation system to help me find new anime to watch.',
  },
];
