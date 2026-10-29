# First version review

Open http://127.0.0.1:4321/ while the local development server is running. Restart with `npm run dev` if needed. No remote repository has been created and nothing has been published.

## Implemented

- English Astro homepage with local fonts, dark surfaces, floating navigation, procedural spatial visual, and reduced-motion support.
- Direction-led experience order, current explorations, six equally visible awards, grouped skills, music and sports, email/GitHub contact.
- Responsive layout, native experience disclosure, mobile navigation with focus handling, skip link, 404, privacy page, favicon, raster social preview, canonical metadata.
- No CV file/link, phone numbers, numerical GPA, unconfirmed publication claims, fabricated photos, or live telemetry.
- GitHub Pages workflow, including repository-subpath asset handling.

## Verified

- `npm run check`: 0 errors, 0 warnings, 0 hints.
- `npm run build`: successful static output for homepage, privacy page and 404.
- Production HTML: one h1 per page, no duplicate IDs, valid internal anchors and local assets, expected public content, private information excluded.
- Root and /lyuml_web repository-base builds: canonical and OG URL agree; assets and privacy link resolve under the base.
- Local homepage HTTP 200.
- Desktop homepage opened in Chrome and visually inspected; introduction, floating navigation, spatial drawing and visible topic line rendered correctly.

## Browser verification completed

Chrome browser access recovered after the initial lock interruption.

- Desktop homepage and lower sections were visually inspected, including exploration diagrams, education, awards, skills, music and sports.
- Responsive viewports checked: 320×740, 390×844, 768×1024, and 1440×900, plus the original wide desktop window.
- At 320, 390, 768, and 1440 widths, document scrollWidth equals clientWidth: no horizontal page overflow.
- Native experience disclosure: Li Auto expands with a click and collapses with Space.
- Mobile menu: Enter opens it, focus starts on Experience, Shift+Tab reaches the toggle, a second Shift+Tab wraps to the last link, Escape closes it and restores toggle focus. Navigation to About closes the panel and updates the hash.
- Closed menu exposes normal page content; open menu accessibility snapshot contains only navigation, confirming background isolation.
- Fixed a 24px offset that left a strip of page visible below the full-screen menu. Verified menu rectangle is x=0, y=0, width=390, height=844 at the matching viewport.
- Fixed the name overflowing at 320px by reducing the heading to the next appropriate type-scale step (60px). Visually rechecked the entire name and contact text.
- Browser console inspection returned no errors or warnings.

## Verification limits

Reduced-motion CSS and animation stop conditions were inspected in source. Runtime OS/media-preference emulation was not performed. No GitHub deployment or live social-card crawler test has been performed; this is a local review version.

## Follow-up content

User photos for music and sports, and detailed ZB202 visual refinement, are deliberately deferred by agreement. Current diagrams are labelled illustrative.
