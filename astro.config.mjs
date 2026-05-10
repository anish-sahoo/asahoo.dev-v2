// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import rehypeMermaid from 'rehype-mermaid';
import { ACTIVE_SHIKI, ACTIVE_MERMAID } from './themes.config.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://asahoo.dev',
  adapter: cloudflare(),
  redirects: {
    '/sitemap.xml': '/sitemap-index.xml',
  },
  integrations: [
    mdx(),
    sitemap({ filter: (page) => !page.includes('/api/') }),
  ],
  markdown: {
    syntaxHighlight: { type: 'shiki', excludeLangs: ['mermaid'] },
    // Code-block dual theme. Shiki emits both palettes as CSS vars
    // (--shiki-light, --shiki-dark, ...); global.css flips on [data-theme=dark].
    // To switch presets, edit themes.config.ts.
    shikiConfig: {
      themes: ACTIVE_SHIKI,
      wrap: true,
    },
    rehypePlugins: [
      [
        rehypeMermaid,
        {
          strategy: 'inline-svg',
          // Mermaid bakes one color set into the SVG at build time. To switch
          // presets, edit themes.config.ts.
          mermaidConfig: ACTIVE_MERMAID,
        },
      ],
    ],
  },
});
