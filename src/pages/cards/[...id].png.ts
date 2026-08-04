import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { Resvg } from '@resvg/resvg-js';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import { Lexer } from 'marked';
import satori from 'satori';

const require = createRequire(import.meta.url);
const regularFont = readFile(require.resolve('@fontsource/crimson-pro/files/crimson-pro-latin-400-normal.woff'));
const italicFont = readFile(require.resolve('@fontsource/crimson-pro/files/crimson-pro-latin-400-italic.woff'));
const mediumFont = readFile(require.resolve('@fontsource/crimson-pro/files/crimson-pro-latin-500-normal.woff'));
const semiboldFont = readFile(require.resolve('@fontsource/crimson-pro/files/crimson-pro-latin-600-normal.woff'));

const colors = {
  paper: '#f6f1e8',
  ink: '#25211d',
  muted: '#756e65',
  accent: '#a53b2a',
  rule: '#d8d0c4',
  mark: '#e8dba8',
};

type CardNode = string | { type: string; props: Record<string, unknown> };
type MarkdownToken = {
  type: string;
  raw?: string;
  text?: string;
  depth?: number;
  ordered?: boolean;
  start?: number;
  tokens?: MarkdownToken[];
  items?: Array<{ tokens?: MarkdownToken[] }>;
  header?: Array<{ tokens?: MarkdownToken[]; text?: string }>;
  rows?: Array<Array<{ tokens?: MarkdownToken[]; text?: string }>>;
};

export const getStaticPaths = (async () => {
  const teksten = await getCollection('teksten', ({ data }) => !data.draft && data.card);
  return teksten.map((tekst) => ({ params: { id: tekst.id }, props: { tekst } }));
}) satisfies GetStaticPaths;

function plainText(markdown: string) {
  return markdown
    .replace(/\r\n/g, '\n')
    .replace(/ {2,}\n/g, '\n')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+[.)]\s+/gm, '')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/==([^=]+)==/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/~([^~]+)~/g, '$1')
    .replace(/[*_`|]/g, '')
    .trim();
}

function typography(text: string, markdown: string) {
  if (/^\|.+\|$/m.test(markdown)) return { body: 32, lineHeight: 1.35 };
  if (/^(?:[-*+] |\d+[.)] )/m.test(markdown) && text.length > 180) {
    return { body: 36, lineHeight: 1.38 };
  }
  if (text.length > 700) return { body: 32, lineHeight: 1.35 };
  if (text.length > 400) return { body: 38, lineHeight: 1.4 };
  if (text.length > 220) return { body: 44, lineHeight: 1.45 };
  return { body: 54, lineHeight: 1.26 };
}

function span(children: CardNode | CardNode[], style: Record<string, unknown> = {}): CardNode {
  return { type: 'span', props: { style, children } };
}

function bearText(value: string): CardNode[] {
  const nodes: CardNode[] = [];
  const pattern = /(==[^=\n]+==|~~[^~\n]+~~|~[^~\n]+~)/g;
  let cursor = 0;

  for (const match of value.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > cursor) nodes.push(value.slice(cursor, index));
    const raw = match[0];

    if (raw.startsWith('==')) {
      nodes.push(span(raw.slice(2, -2), { background: colors.mark, padding: '0 4px' }));
    } else if (raw.startsWith('~~')) {
      nodes.push(span(raw.slice(2, -2), { textDecoration: 'line-through' }));
    } else {
      nodes.push(span(raw.slice(1, -1), {
        textDecoration: 'underline',
        textDecorationColor: colors.accent,
      }));
    }
    cursor = index + raw.length;
  }

  if (cursor < value.length) nodes.push(value.slice(cursor));
  return nodes.length > 0 ? nodes : [value];
}

function inline(tokens: MarkdownToken[] = []): CardNode[] {
  return tokens.flatMap((token): CardNode[] => {
    const children = token.tokens ? inline(token.tokens) : bearText(token.text ?? token.raw ?? '');

    switch (token.type) {
      case 'text':
      case 'escape':
        return bearText(token.text ?? token.raw ?? '');
      case 'em':
        return [span(children, { fontStyle: 'italic' })];
      case 'strong':
        return [span(children, { fontWeight: 600 })];
      case 'del': {
        const underline = token.raw?.startsWith('~') && !token.raw.startsWith('~~');
        return [span(children, underline
          ? { textDecoration: 'underline', textDecorationColor: colors.accent }
          : { textDecoration: 'line-through' })];
      }
      case 'link':
        return [span(children, { textDecoration: 'underline', textDecorationColor: colors.accent })];
      case 'codespan':
        return [span(token.text ?? '', { background: colors.mark, padding: '0 4px' })];
      case 'br':
        return ['\n'];
      case 'image':
        return token.text ? [span(token.text, { fontStyle: 'italic', color: colors.muted })] : [];
      case 'html':
        return bearText((token.raw ?? '').replace(/<[^>]+>/g, ''));
      default:
        return children;
    }
  });
}

function inlineFromBlocks(tokens: MarkdownToken[] = []): CardNode[] {
  return tokens.flatMap((token) => {
    if (token.tokens) return inline(token.tokens);
    return bearText(token.text ?? '');
  });
}

function paragraph(children: CardNode[], style: Record<string, unknown> = {}): CardNode {
  return {
    type: 'div',
    props: {
      style: { display: 'flex', ...style },
      children: span(children, { whiteSpace: 'pre-wrap' }),
    },
  };
}

function tableRow(
  cells: Array<{ tokens?: MarkdownToken[]; text?: string }>,
  header: boolean,
): CardNode {
  const width = `${100 / Math.max(cells.length, 1)}%`;
  return {
    type: 'div',
    props: {
      style: { display: 'flex', width: '100%', borderBottom: `2px solid ${header ? colors.ink : colors.rule}` },
      children: cells.map((cell, index) => ({
        type: 'div',
        props: {
          style: {
            display: 'flex',
            width,
            padding: index === 0 ? '10px 12px 10px 0' : '10px 12px',
            fontWeight: header ? 600 : 400,
          },
          children: span(cell.tokens ? inline(cell.tokens) : bearText(cell.text ?? '')),
        },
      })),
    },
  };
}

function blocks(tokens: MarkdownToken[], bodySize: number): CardNode[] {
  return tokens.flatMap((token): CardNode[] => {
    switch (token.type) {
      case 'space':
        return [];
      case 'paragraph':
      case 'text':
        return [paragraph(token.tokens ? inline(token.tokens) : bearText(token.text ?? ''))];
      case 'heading':
        return [paragraph(token.tokens ? inline(token.tokens) : bearText(token.text ?? ''), {
          fontSize: `${Math.max(bodySize, bodySize + (4 - Math.min(token.depth ?? 2, 4)) * 5)}px`,
          fontWeight: 500,
          lineHeight: 1.15,
        })];
      case 'hr':
        return [{
          type: 'div',
          props: { style: { width: '100%', height: '2px', margin: '12px 0', background: colors.rule } },
        }];
      case 'blockquote':
        return [{
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '22px', borderLeft: `4px solid ${colors.accent}`, fontStyle: 'italic' },
            children: blocks(token.tokens ?? [], bodySize),
          },
        }];
      case 'list': {
        const start = token.start ?? 1;
        return [{
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column', gap: '8px' },
            children: (token.items ?? []).map((item, index) => ({
              type: 'div',
              props: {
                style: { display: 'flex', alignItems: 'flex-start' },
                children: [
                  { type: 'div', props: { style: { display: 'flex', width: '40px', flexShrink: 0 }, children: token.ordered ? `${start + index}.` : '•' } },
                  paragraph(inlineFromBlocks(item.tokens), { flex: 1 }),
                ],
              },
            })),
          },
        }];
      }
      case 'table':
        return [{
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column', width: '100%', fontSize: `${Math.max(bodySize - 5, 27)}px` },
            children: [
              tableRow(token.header ?? [], true),
              ...(token.rows ?? []).map((row) => tableRow(row, false)),
            ],
          },
        }];
      case 'code':
        return [paragraph(bearText(token.text ?? ''), { padding: '14px 18px', background: colors.mark, whiteSpace: 'pre-wrap' })];
      default:
        return token.tokens ? blocks(token.tokens, bodySize) : [];
    }
  });
}

export const GET: APIRoute = async ({ props }) => {
  const { tekst } = props;
  const markdown = tekst.body ?? '';
  const type = typography(plainText(markdown), markdown);
  const tokens = Lexer.lex(markdown, { gfm: true }) as unknown as MarkdownToken[];

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
          { type: 'div', props: { style: { display: 'flex', fontSize: '64px', fontWeight: 500, lineHeight: 1.05 }, children: tekst.data.title } },
          { type: 'div', props: { style: { width: '56px', height: '4px', marginTop: '40px', background: colors.accent } } },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex', flexDirection: 'column', gap: `${Math.max(type.body * 0.48, 16)}px`,
                marginTop: '64px', fontSize: `${type.body}px`, fontWeight: 400, lineHeight: type.lineHeight,
              },
              children: blocks(tokens, type.body),
            },
          },
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
        { name: 'Crimson Pro', data: await italicFont, weight: 400, style: 'italic' },
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
