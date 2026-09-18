# Madhan Prasath R — Portfolio

Single-page personal portfolio for Madhan Prasath R, Ruby on Rails developer.
Built with **Vite + vanilla HTML/CSS/JS + Tailwind CSS**. No framework, no runtime
dependencies, fully static output deployed to GitHub Pages.

Live: <https://maddy-1303.github.io/My_Portfolio/>

## Stack

| Concern | Choice |
|---|---|
| Build | Vite 5 |
| Styling | Tailwind CSS 3 (PostCSS build, not CDN) with CSS-variable design tokens |
| Fonts | Self-hosted via `@fontsource`: Fraunces (display), IBM Plex Sans (body), IBM Plex Mono (labels) |
| JS | ~150 lines of vanilla JS in `src/main.js` (theme toggle, mobile menu, active nav, scroll reveal, copy email, headshot fallback) |
| Deploy | GitHub Actions → GitHub Pages (`.github/workflows/deploy.yml`) |

## Local development

Requires Node 20 or newer.

```bash
npm install
npm run dev        # http://localhost:5173/My_Portfolio/
npm run build      # outputs static site to dist/
npm run preview    # serves dist/ locally for a production check
```

## Project layout

```
index.html                  All page content and structure
src/style.css               Tokens, Tailwind layers, components, motion
src/main.js                 Behaviour (no dependencies)
tailwind.config.js          Maps CSS variables to Tailwind colour / font utilities
vite.config.js              base = /My_Portfolio/ for GitHub Pages
public/favicon.svg          "MP" monogram favicon
public/robots.txt           Crawl rules + sitemap pointer
public/sitemap.xml          Single-URL sitemap
public/assets/              Resume PDF and headshot (see below)
.github/workflows/deploy.yml  Build + deploy on push to main
```

## Deploying to GitHub Pages

1. In the GitHub repository go to **Settings → Pages** and set **Source** to **GitHub Actions**.
2. Push to `main`. The workflow installs dependencies, runs `npm run build` and publishes `dist/`.
3. The site appears at `https://<username>.github.io/<repo>/` within a minute or two.

If you rename the repository or move to a custom domain, update `base` in
`vite.config.js` and the canonical / sitemap URLs in `index.html`,
`public/robots.txt` and `public/sitemap.xml`.

## Swapping the resume and photo

Both files live in `public/assets/` and are copied to `dist/assets/` as-is.

- **Resume:** save your PDF as `public/assets/Madhan_Prasath_R_Resume.pdf`. All three
  "Resume" links already point to it. To use a different filename, search `index.html`
  for `Madhan_Prasath_R_Resume.pdf` and replace it.
- **Headshot:** save a square image as `public/assets/photo.jpg` (480×480 or larger).
  It renders as a circular portrait in the hero. If the file is missing, the block hides
  itself automatically so the layout stays clean.

## Changing the accent colour

Colours are RGB channel triplets on `:root` in `src/style.css`:

```css
--c-accent: 245 185 66;      /* fills, rules, status dot (both themes)      */
--c-accent-ink: 245 185 66;  /* accent-coloured text in dark mode           */
```

and, under `:root[data-theme='light']`:

```css
--c-accent-ink: 138 90 0;    /* deeper shade so accent text passes WCAG AA on paper */
```

Change `--c-accent` to your new colour. If it is a light or mid tone, keep a darker
`--c-accent-ink` for light mode so text stays readable (aim for a contrast ratio of
4.5:1 or better against `#faf8f4`). Also update `public/favicon.svg` if you want the
monogram to match.

## Theming

- The inline script in `<head>` applies the stored theme (localStorage key `theme`) or the
  OS preference before first paint, so there is no flash.
- Without JavaScript the page still respects `prefers-color-scheme` via CSS.
- All motion (hero entrance, scroll reveal, hover lift) is disabled under
  `prefers-reduced-motion: reduce`.

## Content rules

The copy on this page follows a strict honesty rule: role labels (built / own &
maintain / contributed) are literal, and every metric comes from real work. Keep that
when editing.
