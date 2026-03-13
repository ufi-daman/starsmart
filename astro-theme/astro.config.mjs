import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://www.klicovecentrum.cz',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
});
