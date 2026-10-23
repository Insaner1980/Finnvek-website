// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import inlineScriptCsp from './scripts/inline-script-csp.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://finnvek.com',
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "connect-src 'self' https://api.finnvek.com https://cloudflareinsights.com",
        "img-src 'self' data:",
        "frame-src 'none'",
        "object-src 'none'",
      ],
      scriptDirective: {
        resources: ["'self'", 'https://static.cloudflareinsights.com'],
      },
      styleDirective: {
        resources: ["'self'", "'unsafe-inline'", { resource: "'unsafe-inline'", kind: 'attribute' }],
      },
    },
  },
  build: {
    inlineStylesheets: 'always',
  },
  integrations: [sitemap(), inlineScriptCsp()],
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
    {
      provider: fontProviders.google(),
      name: 'Caveat',
      cssVariable: '--font-hand',
      weights: [400],
      styles: ['normal'],
    },
  ],
});
