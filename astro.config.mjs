// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: true
  },
  adapter: node({ mode: 'standalone' }),
  output: 'static',
  server: { host: true },
  security: { checkOrigin: false }
});