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

This is a **multi-page Vite app** (`vite.config.js` sets `appType: 'mpa'` and declares two `build.rollupOptions.input` entries: `index.html` and `brand-manual/index.html`). This matters in dev: Vite intercepts every `.html` request for its own transform pipeline, so a second page only resolves correctly in `npm run dev` if it's declared as a real rollup input — dropping an `index.html` straight into `public/` and expecting it to "just work" as a static file will silently 404 or (with the default `appType: 'spa'`) fall back to serving the main page instead. Any future extra page needs the same treatment: a `<page>/index.html` file outside `public/`, plus an entry in `rollupOptions.input`.

- `index.html` — all page content and markup, section by section (hero, training, journey/how-it-works, scouting, why, proof, final CTA, footer). Static HTML on purpose: no JS required to render content, better SEO/first paint. Translatable text carries a `data-i18n` (or `data-i18n-aria` / `data-i18n-content` for attributes) key instead of being hardcoded.
- `brand-manual/index.html` — second page (see Brand section below). Self-contained, no imports from `src/`.
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

`brand-manual/index.html` is a standalone reference page (plain HTML/CSS with its own `<style>` block, no imports from `src/`, built as a second Vite page — see Architecture) documenting the mark: hero with a background photo, concept, symbol on 4 surfaces (marca/inversa/nocturna/acento), meanings, minimum sizes, color palette, typography, and an "En contexto" applications section (documental/cancha/pecho/papelería mockups + avatar). Its photos live in `public/brand-manual/photos/` (resized/compressed with `sharp`, same as the main site's images — plain static assets, unaffected by the `.html`-in-`public/` issue since they're not HTML). Served at `/brand-manual/` (**with the trailing slash** — `/brand-manual` without it 404s, same as the main pattern everywhere else on the site) once deployed.

The manual's copy deliberately never mentions "Proposal 01/02", "recomendada", or any numbering — the client only wants this mark presented, not a comparison between options, even though it originated as one of two proposals (see decision history in memory if that context is ever needed again). Keep new copy in that page free of proposal/versioning language too. Update the page by hand if the brand system changes — it doesn't share code with the main site.
