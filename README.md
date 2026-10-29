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

Profile content lives in `src/data/profile.ts`; page copy in `src/pages/index.astro`; styling in `src/styles/global.css`. Design and privacy rules are in DESIGN.md. CV files and telephone numbers are deliberately excluded. The space illustrations are conceptual and are not live building data. User photos and a refined ZB202 visual are follow-up work.

## GitHub Pages

Push to the intended GitHub repository’s `main` branch, then select GitHub Actions in Settings → Pages. The included workflow derives the site origin and repository base path from GitHub Pages, builds the static site, and publishes it. No remote has been configured yet. For a manual subpath build, set SITE_URL and BASE_PATH before `npm run build`.

## Git history

Use commit messages in the form `2026-10-29 brief description` for this implementation session.
