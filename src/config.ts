/**
 * Where the <Canvas> lives. Flip this and reload — both code paths are wired
 * up, in Base.astro and index.astro respectively.
 *
 * 'persist'    — mounted once in the layout with `transition:persist`. The
 *                scene survives navigation: hover state, click accents, camera
 *                position and the Leva panel all carry across pages. This is
 *                the Astro-specific trick; the Next port needs tunnel-rat to
 *                get the same effect.
 *
 * 'home-fixed' — mounted by the home page itself. Leaving `/` unmounts the
 *                canvas and disposes the renderer; coming back boots a fresh
 *                one. Cheaper on the other routes, and what you want when the
 *                scene is a hero rather than a backdrop.
 */
export const CANVAS_MODE: 'persist' | 'home-fixed' = 'persist'
