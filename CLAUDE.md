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

- `index.html` — the single page entry point Vite builds from
- `src/main.js` — page content/behavior, mounted into `#app`
- `src/style.css` — global styles

There is no routing, no backend, and no build-time content source (CMS/markdown) — content lives directly in `src/main.js`/`index.html`. If the page grows multiple sections or reusable pieces, split markup into small functions/modules under `src/` rather than introducing a framework.
