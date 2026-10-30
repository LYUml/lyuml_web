# Motion direction

Approved brief: a substantial, visible animation pass that makes the personal site feel more alive while retaining the open composition and selective borders.

Skills: frontend-design (composition), mengto/animation-systems via ui-skills CLI (choreography), fixing-motion-performance (runtime constraints). Native Web Animations API plus CSS and the existing canvas; no dependency added.

## Choreography

- Hero: clipped name-line reveal, sequenced supporting text and fields, spatial assembly with slowly rotating perspective and orbiting nodes.
- Scroll: word-by-word section headings, growing experience dividers, local icon arrival, staggered education/awards/skills, a separate large-type statement.
- Experiences: native details behavior; opening animates the individual text elements, without continuously animating height.
- Exploration: visual arrival, pointer depth, floating spatial illustration, pulsing illustrative sensor ring, moving airflow paths.
- Personal: equalizer bars and a runner orbit on the existing track illustration.
- Navigation: shared moving active surface; page progress and hero departure use native CSS scroll timelines where supported.
- Interactions: magnetic CTA, contact underlines and arrow motion; keyboard focus remains visible.

## Tokens and runtime

Primary curve cubic-bezier(.22,1,.36,1); 16–32px entrances, 550–1000ms section choreography, 35–90ms local staggers. Linear timing is reserved for constant-speed illustrative paths and direct scroll progress. No scroll event polling. Pointer geometry is measured on entry, and writes are frame-batched. Infinite illustration animations pause offscreen and when the document is hidden. Canvas caps pixel density and lowers mobile cadence.

The visible pause control was removed at the user’s request. The operating system reduced-motion preference cancels motion and keeps a readable static presentation. Non-JS content remains visible. No real telemetry or real audio is implied by the illustrative loops.
