// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://finnvek.com',
  output: 'static',

  fonts: [
    {
      name: 'Sora',
      cssVariable: '--font-sora',
      provider: fontProviders.google(),
    },
    {
      name: 'DM Sans',
      cssVariable: '--font-dm-sans',
      provider: fontProviders.google(),
    },
    {
      name: 'DM Mono',
      cssVariable: '--font-dm-mono',
      provider: fontProviders.google(),
    },
  ],

  integrations: [sitemap()],
});