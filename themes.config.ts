// themes.config.ts
//
// Presets for code-block (shiki) and diagram (mermaid) styling. To swap
// themes, change ACTIVE_SHIKI / ACTIVE_MERMAID at the bottom of this file
// and run `bun run dev` (or `bun run build`). The dev server picks up
// astro.config.mjs changes on save, so you can A/B by saving and tabbing
// to the browser.
//
// Browse the full list of shiki themes at https://shiki.style/themes.
// Mermaid theme docs: https://mermaid.js.org/config/theming.html.

const FONT_MONO = '"JetBrains Mono", ui-monospace, monospace';

// ---------------- shiki ----------------

// Every shiki bundled theme exposed as a preset. Light/dark pairs ship under
// one key; single-mode themes are paired with a sensible fallback for the
// other mode. `as const` is required so TS infers the literal theme-id
// types shiki's `themes` option expects. Browse swatches at
// https://shiki.style/themes.
export const SHIKI_PRESETS = {
  // ---- balanced light + dark pairs ----
  github:              { light: 'github-light',                dark: 'github-dark' },
  githubDefault:       { light: 'github-light-default',        dark: 'github-dark-default' },
  githubHighContrast:  { light: 'github-light-high-contrast',  dark: 'github-dark-high-contrast' },
  ayu:                 { light: 'ayu-light',                   dark: 'ayu-dark' },
  catppuccin:          { light: 'catppuccin-latte',            dark: 'catppuccin-mocha' },
  everforest:          { light: 'everforest-light',            dark: 'everforest-dark' },
  gruvboxHard:         { light: 'gruvbox-light-hard',          dark: 'gruvbox-dark-hard' },
  gruvboxMedium:       { light: 'gruvbox-light-medium',        dark: 'gruvbox-dark-medium' },
  gruvboxSoft:         { light: 'gruvbox-light-soft',          dark: 'gruvbox-dark-soft' },
  horizon:             { light: 'horizon-bright',              dark: 'horizon' },
  kanagawa:            { light: 'kanagawa-lotus',              dark: 'kanagawa-wave' },
  material:            { light: 'material-theme-lighter',      dark: 'material-theme' },
  min:                 { light: 'min-light',                   dark: 'min-dark' },
  nightOwl:            { light: 'night-owl-light',             dark: 'night-owl' },
  one:                 { light: 'one-light',                   dark: 'one-dark-pro' },
  plus:                { light: 'light-plus',                  dark: 'dark-plus' },
  rosePine:            { light: 'rose-pine-dawn',              dark: 'rose-pine' },
  slack:               { light: 'slack-ochin',                 dark: 'slack-dark' },
  solarized:           { light: 'solarized-light',             dark: 'solarized-dark' },
  vitesse:             { light: 'vitesse-light',               dark: 'vitesse-dark' },

  // ---- dark-mode only (paired with a sensible light fallback) ----
  andromeeda:          { light: 'github-light',                dark: 'andromeeda' },
  auroraX:             { light: 'github-light',                dark: 'aurora-x' },
  ayuMirage:           { light: 'github-light',                dark: 'ayu-mirage' },
  catppuccinFrappe:    { light: 'catppuccin-latte',            dark: 'catppuccin-frappe' },
  catppuccinMacchiato: { light: 'catppuccin-latte',            dark: 'catppuccin-macchiato' },
  dracula:             { light: 'github-light',                dark: 'dracula' },
  draculaSoft:         { light: 'github-light',                dark: 'dracula-soft' },
  githubDarkDimmed:    { light: 'github-light-default',        dark: 'github-dark-dimmed' },
  houston:             { light: 'github-light',                dark: 'houston' },
  kanagawaDragon:      { light: 'kanagawa-lotus',              dark: 'kanagawa-dragon' },
  laserwave:           { light: 'github-light',                dark: 'laserwave' },
  materialDarker:      { light: 'material-theme-lighter',      dark: 'material-theme-darker' },
  materialOcean:       { light: 'material-theme-lighter',      dark: 'material-theme-ocean' },
  materialPalenight:   { light: 'material-theme-lighter',      dark: 'material-theme-palenight' },
  monokai:             { light: 'github-light',                dark: 'monokai' },
  nord:                { light: 'github-light',                dark: 'nord' },
  plastic:             { light: 'github-light',                dark: 'plastic' },
  poimandres:          { light: 'github-light',                dark: 'poimandres' },
  red:                 { light: 'github-light',                dark: 'red' },
  rosePineMoon:        { light: 'rose-pine-dawn',              dark: 'rose-pine-moon' },
  synthwave84:         { light: 'github-light',                dark: 'synthwave-84' },
  tokyoNight:          { light: 'github-light',                dark: 'tokyo-night' },
  vesper:              { light: 'github-light',                dark: 'vesper' },
  vitesseBlack:        { light: 'vitesse-light',               dark: 'vitesse-black' },

  // ---- light-mode only ----
  snazzyLight:         { light: 'snazzy-light',                dark: 'github-dark' },
} as const;

export type ShikiPreset = (typeof SHIKI_PRESETS)[keyof typeof SHIKI_PRESETS];

// ---------------- mermaid ----------------

export type MermaidPreset = {
  theme: 'default' | 'neutral' | 'dark' | 'forest' | 'base';
  themeVariables?: Record<string, string>;
};

export const MERMAID_PRESETS = {
  // built-in themes — single mode, picked for legibility
  neutral: {
    theme: 'neutral',
    themeVariables: { fontFamily: FONT_MONO, fontSize: '14px' },
  },
  default: {
    theme: 'default',
    themeVariables: { fontFamily: FONT_MONO, fontSize: '14px' },
  },
  dark: {
    theme: 'dark',
    themeVariables: { fontFamily: FONT_MONO, fontSize: '14px' },
  },
  forest: {
    theme: 'forest',
    themeVariables: { fontFamily: FONT_MONO, fontSize: '14px' },
  },

  // site-tinted: uses your global.css gray tokens, so diagrams blend with the
  // light theme. on dark mode they'll appear as light gray on dark — readable
  // but inverted.
  siteGrays: {
    theme: 'base',
    themeVariables: {
      background: 'transparent',
      primaryColor: '#f0efed',          // matches --color-bg-secondary (light)
      primaryTextColor: '#1a1a1a',      // matches --color-text-primary (light)
      primaryBorderColor: '#8a8a85',    // matches --color-text-tertiary
      lineColor: '#8a8a85',
      secondaryColor: '#fafaf9',
      tertiaryColor: '#fafaf9',
      fontFamily: FONT_MONO,
      fontSize: '14px',
    },
  },

  // pure outline: transparent fill with thin strokes. blends in either mode
  // but loses the box/branch contrast.
  outline: {
    theme: 'base',
    themeVariables: {
      background: 'transparent',
      primaryColor: 'transparent',
      primaryTextColor: '#FFFFF0',
      primaryBorderColor: '#8a8a85',
      lineColor: '#8a8a85',
      secondaryColor: 'transparent',
      tertiaryColor: 'transparent',
      fontFamily: FONT_MONO,
      fontSize: '14px',
    },
  },
} satisfies Record<string, MermaidPreset>;

// ============================================================================
// active selection — edit these two lines to switch themes
// ============================================================================

export const ACTIVE_SHIKI: ShikiPreset = SHIKI_PRESETS.tokyoNight;
export const ACTIVE_MERMAID: MermaidPreset = MERMAID_PRESETS.outline;
