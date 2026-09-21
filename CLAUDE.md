# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Single-page landing site for La Cantera London F.C. Built with Vite (vanilla JS, no framework) and deployed as static files to Hostinger shared hosting via FTP.

## Commands

- `npm run dev` — start the Vite dev server with hot reload
- `npm run build` — build the production bundle into `dist/`
- `npm run preview` — serve the `dist/` build locally to sanity-check before deploying

## Deployment

Hostinger's basic plan is static shared hosting — it does not run a Node server. Deploys via Hostinger's Git integration (branch `main`, framework preset Vite, root `./`, default build settings — i.e. `npm install` + `npm run build`, output `dist/`). Manual fallback: `npm run build` then upload the contents of `dist/` (not the project root) to `public_html/` via FTP.

## Architecture

- `index.html` — all page content and markup, section by section (hero, training, journey/how-it-works, scouting, why, proof, final CTA, footer). Static HTML on purpose: no JS required to render content, better SEO/first paint. Translatable text carries a `data-i18n` (or `data-i18n-aria` / `data-i18n-content` for attributes) key instead of being hardcoded.
- `src/i18n.js` — `{ en, es }` translation dictionaries keyed by the same `data-i18n` keys. English and Spanish are not literal translations of each other — tone differs per the brand brief (Spanish warmer/more direct address, English keeps the same demanding register).
- `src/main.js` — interactivity only: navbar solid-on-scroll, mobile menu toggle, footer year, and the EN/ES language switch (swaps `data-i18n` text/attributes from `i18n.js`, persists the choice in `localStorage`). Does not generate markup.
- `src/style.css` — design tokens (`:root` custom properties for the brand palette and type scale) followed by section-by-section styles.

Adding a new piece of copy: add the element in `index.html` with a `data-i18n="section.key"`, then add that key to both `en` and `es` in `src/i18n.js` — a missing key just leaves the hardcoded English fallback text in place (no crash), so it's easy to miss; grep `i18n.js` for the key after adding it.

There is no routing, no backend, and no build-time content source (CMS/markdown). If the page grows enough sections to make one `index.html` unwieldy, split markup into includes/partials at build time (e.g. `vite-plugin-html`) rather than introducing a JS framework.

## Content placeholders

Several pieces of on-page content are intentionally left as bracketed placeholders (`[N]`, `[Coach Name]`, etc.) rather than invented — stats, testimonials, coach bios, and contact details still need real, verifiable content per the brand brief (`accuracy over polish`). Search `index.html` for `[` to find all of them before launch.

Hero background video is in place: `public/videos/hero-training.mp4` (transcoded from a 50MB 4K/60fps source down to ~6.7MB at 1080p/30fps, H.264, no audio track, `+faststart`) with `public/images/hero-poster.jpg` as the fallback poster. Re-transcode any future replacement video the same way — the original 4K files supplied are far too heavy for a hero background (`ffmpeg -i in.mp4 -vf "scale=1920:-2,fps=30" -c:v libx264 -preset slow -crf 26 -an -movflags +faststart out.mp4`).

Real photos already placed (`public/images/`, resized/compressed with `sharp`, ~1000px wide):
- `training-positional.jpeg` — Positional Tactics card
- `trophy-1.jpeg`, `trophy-2.jpeg`, `trophy-3-la-cantera.jpeg` — "Championships We've Won" gallery in Why La Cantera

Two supplied training photos showing minors (girls' team drill, coach with two kids) were deliberately **not** used — no confirmed parental image-consent for public use. Check with the client before adding any photo with a minor's face.

## Brand

Logo mark is the "Cortada" symbol (Proposal 01 — the recommended one — from the client's two-proposal brand manual; Proposal 02 "Bloque" was explicitly rejected and is not used anywhere). Same SVG path is embedded inline (fill uses `currentColor` so it follows the surrounding text color) in three places:
- `index.html` navbar logo and footer logo (both dark backgrounds, mark renders ivory)
- `public/logos/la-cantera-mark.svg` — standalone asset, forest-green fill, for use on light backgrounds
- `public/favicon.svg` — forest square with the gold mark, linked from `<head>`

`public/brand-manual/index.html` is a standalone static reference page (not part of the Vite SPA bundle — plain HTML/CSS with its own `<style>` block, self-contained) documenting only Proposal 01: concept, symbol on 4 surfaces, meanings, minimum sizes, color palette, typography. Served at `/brand-manual/` once deployed. Update it by hand if the brand system changes — it doesn't share code with the main site.
