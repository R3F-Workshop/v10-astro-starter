import { Canvas } from '@react-three/fiber'
import { Leva, useControls } from 'leva'
import { Stage } from './stage/Stage'
import { Content } from './content/Content'

/**
 * Mounted once in Base.astro with `client:only="react" transition:persist`, so
 * this whole tree survives navigation — the scene keeps rendering while Astro
 * swaps the page DOM above it.
 */
export default function Experience() {
  const { background } = useControls({
    background: '#0a0a0a',
  })

  return (
    <>
      {/* The wrapper carries the sizing. R3F's container is width/height:100%,
          so it needs a sized parent — as a bare child of <body> it collapses to
          zero height and the renderer never boots. */}
      <div className="fixed inset-0 z-0">
        <Canvas
          shadows
          renderer
          background={background}
          camera={{ position: [7, 5, 9], fov: 42 }}
          dpr={[1, 2]}
        >
          {/* `attach` writes these onto the parent (the scene) declaratively */}
          <fog attach="fog" args={[background, 18, 45]} />
          <Stage />
          <Content />
        </Canvas>
      </div>

      {/* Leva renders into this container (via `fill`) so it clears the nav */}
      <div className="fixed top-20 right-4 z-30 w-72">
        <Leva fill />
      </div>
    </>
  )
}
