import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  site: process.env.URL || undefined,
  devToolbar: { enabled: false },
});
