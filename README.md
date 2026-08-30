# R3F v10 Astro Starter

The [v10-starter](https://github.com/R3F-Workshop/v10-starter) scene, ported to **Astro 7** — [react-three-fiber **v10 alpha**](https://github.com/pmndrs/react-three-fiber), [drei v11 alpha](https://github.com/pmndrs/drei), Tailwind v4, and [Leva](https://github.com/pmndrs/leva), with two DOM-only routes to navigate between.

```bash
npm install
npm run dev
```

## The Astro bit: the canvas outlives the page

Mounted in `src/layouts/Base.astro` as

```astro
<Experience client:only="react" transition:persist />
```

the scene **survives navigation**. Click between `/`, `/about` and `/notes` and the cubes keep spinning — hover state, click accents, camera position and the Leva panel all carry across, because Astro moves the island's DOM node into the next page instead of remounting it. The only prerequisite is `<ClientRouter />` in the head. The Next port needs `tunnel-rat` and a hoisted canvas to do the same thing.

**Not every site wants that**, so both modes are wired up. `src/config.ts`:

```ts
export const CANVAS_MODE: 'persist' | 'home-fixed' = 'persist'
```

| Mode | Mounted in | Behaviour |
| --- | --- | --- |
| `persist` | `src/layouts/Base.astro` | One canvas for the whole site. Scene state carries across routes; content pages render in a frosted panel over the live scene. |
| `home-fixed` | `src/pages/index.astro` | The home page owns the canvas. Leaving `/` unmounts the island and disposes the renderer; coming back boots a fresh one. Nothing 3D is downloaded on the other routes. |

Flip the constant and reload — the diff between the two paths is two lines, both already in the repo.

## Project tour

```
src/
├── config.ts                  # CANVAS_MODE switch
├── layouts/Base.astro         # <ClientRouter>, Nav, the persistent island
├── pages/
│   ├── index.astro            # the scene (+ the canvas itself in home-fixed mode)
│   ├── about.astro            # how the port works
│   └── notes.astro            # alpha rough edges
├── components/
│   ├── Experience.tsx         # the <Canvas>, its fixed wrapper, Leva
│   ├── site/                  # Nav.astro, PageShell.astro
│   ├── stage/                 # CameraRig, Lights, Floor
│   ├── content/               # LogoCubes, Cube, Pyramid, Suzi
│   └── overlay/               # Footer, PmndrsMark (React, rendered static)
└── styles/global.css          # Tailwind v4 (@import 'tailwindcss')
public/models/                 # suzimatholder.glb, loaded by drei's useGLTF
```

## What's different from the Vite starter

Everything inside `<Canvas>` is unchanged. Around it:

1. **`client:only="react"`, not `client:load`.** The canvas has no meaningful server render, and `three/webgpu` reaches for browser globals at import time.
2. **The fixed wrapper lives inside `Experience.tsx`.** R3F's own container is `width/height: 100%`, so it needs a sized parent — as a bare child of `<body>` it collapses to zero height and the renderer never boots, with no error. Keeping the wrapper in the component means it travels with the island when Astro moves it.
3. **Runtime-injected CSS needs help surviving the swap.** Leva styles itself with stitches, which inserts rules straight into the CSSOM — its `<style>` tags are empty, so nothing is left to re-render when the router replaces `<head>`. The panel persists, then comes back unstyled. `Base.astro` tags those nodes with `data-astro-transition-persist` on `astro:before-swap` and drops matching placeholders into the incoming document, which keeps the live nodes. Any CSS-in-JS island has this problem.
4. **Everything else ships zero JavaScript.** `Nav.astro` gets its active state from `Astro.url.pathname` at build time — no client component, no `usePathname` (compare the Next port). The footer is a React component rendered *without* a client directive, so Astro compiles it to static HTML. React is downloaded for exactly one thing: the canvas.

## Stack

| Package | Version | Notes |
| --- | --- | --- |
| `astro` | `^7.2` | static output, view transitions |
| `@astrojs/react` | `^6.0` | React 19 islands |
| `@react-three/fiber` | `10.0.0-alpha.4` | pinned — alpha |
| `@react-three/drei` | `11.0.0-alpha.5` | pinned — alpha |
| `three` | `^0.185` | v10 requires ≥ 0.185 |
| `react` | `^19.2` | v10 requires 19.x |
| `leva` | `^0.10` | control panel |
| `tailwindcss` | 4 | via `@tailwindcss/vite`, not the Astro integration |

## The v10 headline: TSL uniforms with `useUniforms` + `useLocalNodes`

[Cube.tsx](src/components/content/Cube.tsx) is the demo:

```
useControls (Leva) ──► useUniforms('cubes' scope) ──► useLocalNodes ──► meshStandardNodeMaterial
```

- `useUniforms({ uBaseColor, uHoverColor }, 'cubes')` puts shared `UniformNode`s in the R3F store. All six cubes call it with the same scope — the first creates the nodes, the rest get the **same instances** back, and a Leva change is written onto the existing node. The shader never recompiles.
- Per-cube uniforms (`uniform(0)` from `three/tsl`) drive the hover mix, animated in `useFrame` with `MathUtils.damp`. They live in a plain `useMemo(…, [])` because they hold mutable state that must survive a graph rebuild.
- `useLocalNodes(creator)` builds the node graph from the store's uniforms. Its deps are the store's uniforms/nodes/textures **plus the HMR version**, so editing the TSL hot-reloads the material instead of leaving it stale until a remount.

See [/notes](src/pages/notes.astro) for the gotchas — including why the creator needs `useCallback`.

## Things to try

- Flip `CANVAS_MODE` and watch the network tab on `/about`
- Add a third route and see the scene keep its camera through the click
- Change the `PATTERN` grid in [LogoCubes.tsx](src/components/content/LogoCubes.tsx)
- Extend the cube node graph — try `positionNode` for a TSL vertex wobble
