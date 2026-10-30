# lyuml_web

Mingliang Lyu’s Astro personal website. Local first; no remote repository or deployment is created automatically.

## Development

```sh
npm install
npm run dev
```

## Verification

```sh
npm run check
npm run build
npm run preview
```

Profile content lives in `src/data/profile.ts`; page copy in `src/pages/index.astro`; kinetic styling in `src/styles/kinetic.css` and animation in `src/scripts/kinetic.ts`. Design and privacy rules are in DESIGN.md. CV files and telephone numbers are deliberately excluded. The space illustrations are conceptual and are not live building data. User photos and a refined ZB202 visual are follow-up work.

## GitHub Pages

Push to the intended GitHub repository’s `main` branch, then select GitHub Actions in Settings → Pages. The included workflow derives the site origin and repository base path from GitHub Pages, builds the static site, and publishes it. For a manual subpath build, set SITE_URL and BASE_PATH before `npm run build`.

## Git history

Write every commit message in English, using `YYYY-MM-DD Short English summary` with the date of work.

## Current design branch

`codex/kinetic-grid` implements the pure-black animated typography direction. Main and lighthouse remain separate. Local screenshot boards are in ignored `output/review/`. Fonts are bundled locally; no external art or runtime CDN is required. See DESIGN.md, MOTION.md and REVIEW.md.

The copy verifier expects `.qa/main-baseline.html`, an ignored rendered homepage built from main before the redesign. Run `python3 scripts/verify-main-copy.py` after the build when that baseline is available. `?motion=reduce` forces the static motion path for local review.
