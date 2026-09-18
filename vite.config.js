import { defineConfig } from 'vite';

/**
 * Vite configuration.
 *
 * `base` must match the GitHub Pages project path: the site is served from
 * https://maddy-1303.github.io/My_Portfolio/ so every asset URL is prefixed
 * with /My_Portfolio/. If you rename the repository, change this value (and
 * the canonical / sitemap URLs in index.html and public/sitemap.xml).
 *
 * Hashed build output goes to `_static/` so that `public/assets/` stays a
 * clean, predictable home for the resume PDF and headshot.
 */
export default defineConfig({
  base: '/My_Portfolio/',
  build: {
    assetsDir: '_static',
    target: 'es2020',
    cssMinify: true,
    sourcemap: false,
  },
});
