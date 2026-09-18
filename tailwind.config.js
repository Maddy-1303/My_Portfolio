/** @type {import('tailwindcss').Config} */

/**
 * Colours are defined once as RGB channel triplets on :root in src/style.css
 * (e.g. `--c-bg: 11 11 13`) and swapped per theme via [data-theme]. Exposing
 * them here as `rgb(var(--x) / <alpha-value>)` lets Tailwind opacity
 * modifiers such as `bg-surface/80` keep working.
 */
const token = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.js'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: token('bg'),
        surface: token('surface'),
        'surface-2': token('surface-2'),
        border: token('border'),
        ink: token('ink'),
        muted: token('muted'),
        accent: token('accent'),
        'accent-ink': token('accent-ink'),
        'on-accent': token('on-accent'),
      },
      fontFamily: {
        display: ['"Fraunces Variable"', 'Georgia', '"Times New Roman"', 'serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      maxWidth: {
        container: '1100px',
        prose: '65ch',
      },
      borderRadius: {
        DEFAULT: '6px',
        card: '10px',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
