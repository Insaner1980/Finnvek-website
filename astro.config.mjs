// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://finnvek.com',
  integrations: [sitemap()],
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'IBM Plex Sans',
      cssVariable: '--font-body',
      weights: ['400 700'],
      styles: ['normal', 'italic'],
    },
    {
      provider: fontProviders.google(),
      name: 'Epilogue',
      cssVariable: '--font-sans',
      weights: ['400 500'],
      styles: ['normal', 'italic'],
    },
  ],
});
