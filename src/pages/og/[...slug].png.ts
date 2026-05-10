// OG image endpoint — returns SVG (supported by Discord, Slack, Telegram, iMessage).
// For PNG (required by Twitter/X), switch to a pre-build script using sharp or
// a WASM rasterizer (@resvg/resvg-wasm), keeping it out of the CF Workers bundle.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { formatDate } from '@/lib/format';

export const prerender = true;

export async function getStaticPaths() {
  const notes = await getCollection('notes', ({ data }) => !data.draft);
  return notes.map((note) => ({
    params: { slug: note.id.replace(/\.mdx?$/, '') },
    props: { note },
  }));
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function buildSvg(title: string, date: string): string {
  const lines = wrapText(title, 32);
  const lineHeight = 72;
  const titleStartY = 300 - (lines.length * lineHeight) / 2 + 52;

  const titleLines = lines
    .map(
      (line, i) =>
        `  <text x="80" y="${titleStartY + i * lineHeight}" font-family="monospace" font-size="54" font-weight="bold" fill="#1a1a1a">${escapeXml(line)}</text>`,
    )
    .join('\n');

  const dateY = titleStartY + lines.length * lineHeight + 20;

  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#fafaf9"/>
  <rect x="40" y="40" width="1120" height="550" rx="3" fill="none" stroke="rgba(0,0,0,0.09)" stroke-width="1"/>
  <text x="80" y="108" font-family="monospace" font-size="13" letter-spacing="5" fill="#9a988e">ASAHOO.DEV</text>
${titleLines}
  <text x="80" y="${dateY}" font-family="monospace" font-size="18" fill="#6c6c66">${escapeXml(date)}</text>
</svg>`;
}

export const GET: APIRoute = async ({ props }) => {
  const { note } = props;
  const svg = buildSvg(note.data.title, formatDate(note.data.date));
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
