# SAC Architecture

A React and TypeScript homepage prototype, with GSAP scroll drawings, the supplied portfolio, image viewer and film player.

## Preview

Open http://127.0.0.1:5173/ while the development server is running.

From this directory:

```powershell
npm install
npm run dev
```

For a production build:

```powershell
npm run build
npm run preview -- --host 127.0.0.1
```

The build is in dist. Serve it over HTTP rather than opening index.html directly from disk. This prototype assumes deployment at the domain root.

## What works

* Three scroll chapters: connected towers, office building and forest residence.
* SVG drawing groups followed by a wipe to the unchanged portfolio render. Reverse scrolling reverses the effect.
* Auto, Lines and Image controls for each study.
* Nine images, category filters, a modal viewer, arrow key navigation and Escape dismissal.
* Native video playback controls when a film source is configured. No video is fetched until the viewer opens.
* Honest poster fallback while the film is unavailable, and an error fallback if playback fails.
* Mobile navigation, unpinned mobile chapters, system reduced motion and a manual Reduce motion control.
* WhatsApp and Instagram contact links. No enquiry backend.

## Film status

The fal film is generated and integrated. The first draft was rejected for camera drift. A corrective pass anchored both endpoints to the source image; sampled frame review found stable towers, balconies, connecting terrace and framing. The final clip is 768 x 768 and 6.592 seconds.

Two H3 Max runs had a combined advisory estimate of USD 0.36, not a confirmed final charge. Exact inputs, job IDs and output URLs are retained in guide/film-recipe.json, fal-job.json and fal-corrective-job.json. The untouched accepted source is guide/tower-fal-original.mp4; the web copy is public/media/sac-towers.mp4. No fal API key is included.

## Source map

* src/App.tsx: homepage, scroll chapters and accessible media dialog.
* src/portfolio.ts: image descriptions, source paths, contact URLs and optional film.
* src/linework.ts: grouped artistic SVG paths in original image coordinates.
* src/styles.css: layout, design tokens, responsive and reduced motion styles.
* guide/: browser screenshots, film recipe and verification notes.
* public/responsive-preview.html: optional local testing frame for 320px, 390px and 768px layouts.

Project labels describe visible content. They are not verified official names. All images remain architectural visualizations unless the studio confirms otherwise.

See ../FAL-WALKTHROUGH.md for the illustrated fal lesson.


## Portfolio hero video

The hero now uses both user-supplied portrait videos in sequence (13.17-second interiors clip, then 30.2-second tower clip). The web copy is public/media/portfolio-hero.mp4, encoded at 720 x 1280 with no audio and fast-start metadata. It loops, plays muted inline, and pauses when offscreen or the tab is hidden. The visible pause button, system reduced motion and site Reduce motion preference control background playback. A poster remains available on load failure. Original source files in Downloads are unchanged; their existing embedded text remains part of the footage. The separate Watch film player retains the fal tower film.
