import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { Resvg } from '@resvg/resvg-js';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import satori from 'satori';

const require = createRequire(import.meta.url);
const regularFont = readFile(require.resolve('@fontsource/crimson-pro/files/crimson-pro-latin-400-normal.woff'));
const mediumFont = readFile(require.resolve('@fontsource/crimson-pro/files/crimson-pro-latin-500-normal.woff'));
const semiboldFont = readFile(require.resolve('@fontsource/crimson-pro/files/crimson-pro-latin-600-normal.woff'));

const colors = { paper: '#f6f1e8', ink: '#25211d', accent: '#a53b2a' };

export const getStaticPaths = (async () => {
  const teksten = await getCollection('teksten', ({ data }) => !data.draft && data.card);
  return teksten.map((tekst) => ({ params: { id: tekst.id }, props: { tekst } }));
}) satisfies GetStaticPaths;

function cardText(markdown: string) {
  return markdown
    .replace(/\r\n/g, '\n')
    .replace(/ {2,}\n/g, '\n')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^[-*+]\s+/gm, '• ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/==([^=]+)==/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/[*_]/g, '')
    .trim();
}

function typography(text: string) {
  if (text.length > 700) return { body: 32, lineHeight: 1.35 };
  if (text.length > 400) return { body: 38, lineHeight: 1.4 };
  if (text.length > 220) return { body: 44, lineHeight: 1.45 };
  return { body: 54, lineHeight: 1.26 };
}

export const GET: APIRoute = async ({ props }) => {
  const { tekst } = props;
  const text = cardText(tekst.body ?? '');
  const type = typography(text);

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1080px', height: '1350px', padding: '96px', display: 'flex',
          flexDirection: 'column', background: colors.paper, color: colors.ink,
          fontFamily: 'Crimson Pro',
        },
        children: [
          { type: 'div', props: { style: { fontSize: '64px', fontWeight: 500, lineHeight: 1.05 }, children: tekst.data.title } },
          { type: 'div', props: { style: { width: '56px', height: '4px', marginTop: '40px', background: colors.accent } } },
          { type: 'div', props: { style: { marginTop: '64px', whiteSpace: 'pre-wrap', fontSize: `${type.body}px`, fontWeight: 400, lineHeight: type.lineHeight }, children: text } },
          {
            type: 'div',
            props: {
              style: { marginTop: 'auto', display: 'flex', alignItems: 'baseline', fontSize: '46px', fontWeight: 600, lineHeight: 1 },
              children: [
                { type: 'span', props: { children: 'Harm' } },
                { type: 'span', props: { style: { color: colors.accent }, children: '.' } },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1080,
      height: 1350,
      fonts: [
        { name: 'Crimson Pro', data: await regularFont, weight: 400, style: 'normal' },
        { name: 'Crimson Pro', data: await mediumFont, weight: 500, style: 'normal' },
        { name: 'Crimson Pro', data: await semiboldFont, weight: 600, style: 'normal' },
      ],
    },
  );

  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1080 } }).render().asPng();
  const body = png.buffer.slice(png.byteOffset, png.byteOffset + png.byteLength) as ArrayBuffer;
  return new Response(body, {
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': `inline; filename="${tekst.id}.png"`,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
