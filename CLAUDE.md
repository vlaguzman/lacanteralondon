# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Single-page landing site for La Cantera London F.C. Built with Vite (vanilla JS, no framework) and deployed as static files to Hostinger shared hosting via FTP.

## Commands

- `npm run dev` — start the Vite dev server with hot reload
- `npm run build` — build the production bundle into `dist/`
- `npm run preview` — serve the `dist/` build locally to sanity-check before deploying

## Deployment

Hostinger's basic plan is static shared hosting — it does not run a Node server. After `npm run build`, upload the contents of `dist/` (not the project root) to `public_html/` via FTP.

## Architecture

- `index.html` — all page content and markup, section by section (hero, training, journey/how-it-works, scouting, why, proof, final CTA, footer). Static HTML on purpose: no JS required to render content, better SEO/first paint.
- `src/main.js` — interactivity only (navbar solid-on-scroll, mobile menu toggle, footer year). Does not generate markup.
- `src/style.css` — design tokens (`:root` custom properties for the brand palette and type scale) followed by section-by-section styles.

There is no routing, no backend, and no build-time content source (CMS/markdown). If the page grows enough sections to make one `index.html` unwieldy, split markup into includes/partials at build time (e.g. `vite-plugin-html`) rather than introducing a JS framework.

## Content placeholders

Several pieces of on-page content are intentionally left as bracketed placeholders (`[N]`, `[Coach Name]`, etc.) rather than invented — stats, testimonials, coach bios, contact details, logos, and the hero video/photos need real, verifiable content per the brand brief (`accuracy over polish`). Search `index.html` for `[` to find all of them before launch.
