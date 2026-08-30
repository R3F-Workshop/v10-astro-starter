import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useCursor } from '@react-three/drei'
import { MathUtils, type Mesh } from 'three'

type PyramidProps = {
  position?: [number, number, number]
}

/**
 * useFrame demo: runs every frame (~60×/second). Mutate the mesh directly in
 * here — never setState per frame.
 */
export function Pyramid({ position = [6, 2.6, 2] }: PyramidProps) {
  const meshRef = useRef<Mesh>(null)
  const spinSpeed = useRef(0)
  const [hovered, setHovered] = useState(false)

  useCursor(hovered)

  useFrame((state, delta) => {
    const mesh = meshRef.current
    if (!mesh) return

    // Damp the spin speed toward its target so hovering ramps up smoothly
    // and letting go coasts to a stop instead of snapping
    spinSpeed.current = MathUtils.damp(spinSpeed.current, hovered ? 3 : 0, 4, delta)
    mesh.rotation.y += spinSpeed.current * delta

    // Gentle idle bob — in v10, elapsed time lives directly on the frame
    // state (state.elapsed / state.delta); there is no state.clock anymore
    mesh.position.y = position[1] + Math.sin(state.elapsed) * 0.12
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      castShadow
      onPointerOver={(event) => {
        event.stopPropagation()
        setHovered(true)
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* A cone with 4 radial segments is a pyramid */}
      <coneGeometry args={[0.85, 1.3, 4]} />
      <meshStandardMaterial
        color="#8b5cf6"
        roughness={0.25}
        metalness={0.4}
        flatShading
        emissive="#8b5cf6"
        emissiveIntensity={hovered ? 0.45 : 0.12}
      />
    </mesh>
  )
}
