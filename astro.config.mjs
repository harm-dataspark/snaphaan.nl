import { defineConfig } from 'astro/config';
import remarkBear from './src/plugins/remark-bear.mjs';

export default defineConfig({
  site: 'https://harmsnaphaan.nl',
  output: 'static',
  markdown: {
    remarkPlugins: [remarkBear],
  },
});
