# Kinetic motion

Native WAAPI, CSS timelines and one canvas. No scroll hijacking, sound, Three.js dependency or pause button.

- Hero: fitted Anton name rises through a clip; supporting copy arrives in sequence. Curved canvas lines drift and repel a fine pointer.
- Scroll: clipped word-level display headings, statement word sequence, local award/skill entrances; native CSS reading progress and hero departure when supported.
- Experience: native details toggle; individual body elements rise/fade without animating container height.
- Research: floating wireframe floor, sensor pulses, isolated dashed airflow paths.
- Life: waveform bars and a runner on the track. Contact arrows move on hover.

Canvas caps DPR at 1.5, lowers mobile cadence, caches pointer geometry and pauses offscreen, on hidden documents and reduced motion. Illustration loops also pause offscreen/hidden. Most animation uses transform/opacity; small isolated SVG airflow paths animate stroke offset. Body content is visible without JavaScript.

OS prefers-reduced-motion cancels entrances and loops and shows the static line-field fallback. `?motion=reduce` exercises the same reduction path for local review without changing OS settings. No extra visible control, as requested.

Runtime QA verifies running/paused canvas states and actual pointer interaction. Browser screenshots cannot prove frame smoothness on every physical device; physical-device GPU profiling has not been performed.
