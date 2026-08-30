import { useCallback, useMemo, useRef, useState } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
// The TSL hooks live on the /webgpu entry; it shares its store with the main
// entry, so this works inside the regular <Canvas>
import { useLocalNodes, useUniforms, type CreatorState } from '@react-three/fiber/webgpu'
import { useCursor } from '@react-three/drei'
import { useControls } from 'leva'
import { Color, MathUtils } from 'three'
import { color, mix, uniform } from 'three/tsl'

/** Click accents — a click cycles through these, then back to the base color */
const ACCENTS = ['#3b82f6', '#22d3ee', '#f472b6', '#4ade80']

// Alpha rough edge: the store types shared uniforms as UniformNode<unknown>,
// which three's TSL operators won't accept — cast them to typed color nodes
type ColorUniform = ReturnType<typeof color>

type CubeProps = {
  position: [number, number, number]
  size?: number
}

export function Cube({ position, size = 1 }: CubeProps) {
  const [hovered, setHovered] = useState(false)
  const accentIndex = useRef(-1) // -1 = showing the shared base color

  // drei helper: swaps the page cursor to a pointer while hovered
  useCursor(hovered)

  // Every Cube renders this — Leva dedupes by path, so there is only one
  // "Cubes" folder and all six cubes share its values
  const { baseColor, hoverColor } = useControls('Cubes', {
    baseColor: '#fafafa',
    hoverColor: '#8b5cf6',
  })

  // v10: useControls → useUniforms is the bridge from React state into TSL.
  // These live in the shared 'cubes' scope: the first Cube creates the
  // UniformNodes, the rest get the same instances back. When a Leva color
  // changes, the value is written onto the existing node — the shader graph
  // is untouched, nothing recompiles.
  useUniforms({ uBaseColor: baseColor, uHoverColor: hoverColor }, 'cubes')

  // Per-cube uniforms. These hold mutable state (the hover damp, the accent
  // index) so they are created once and never rebuilt — keeping them out of
  // the useLocalNodes creator below is deliberate.
  const { uHover, uAccent, uAccentAmount } = useMemo(
    () => ({
      uHover: uniform(0),
      uAccentAmount: uniform(0),
      uAccent: uniform(new Color(ACCENTS[0])),
    }),
    [],
  )

  // The creator's identity is a dep of useLocalNodes, so it has to be stable:
  // an inline arrow would rebuild the graph every render, and the material is
  // keyed by colorNode.uuid — it would remount on every hover.
  const buildGraph = useCallback(
    ({ uniforms }: CreatorState) => {
      // Same alpha rough edge as before, just read from the scope instead
      const cubes = uniforms.scope('cubes') as unknown as {
        uBaseColor: ColorUniform
        uHoverColor: ColorUniform
      }
      const tint = mix(cubes.uBaseColor, uAccent, uAccentAmount)
      return {
        colorNode: mix(tint, cubes.uHoverColor, uHover),
        emissiveNode: mix(color('#000000'), cubes.uHoverColor, uHover.mul(0.4)),
      }
    },
    [uHover, uAccent, uAccentAmount],
  )

  // useLocalNodes is useMemo + the store as deps: the graph rebuilds when the
  // shared uniforms/nodes/textures change, and on HMR — so editing the TSL
  // above recompiles the material instead of going stale until a remount.
  const { colorNode, emissiveNode } = useLocalNodes(buildGraph)

  // Animate the hover mix per-frame — mutating a uniform never re-renders React
  useFrame(({ delta}) => {
    uHover.value = MathUtils.damp(uHover.value, hovered ? 1 : 0, 8, delta)
  })

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    // Without stopPropagation the raycaster also hits meshes behind this one
    event.stopPropagation()
    const next = accentIndex.current + 1 >= ACCENTS.length ? -1 : accentIndex.current + 1
    accentIndex.current = next
    uAccentAmount.value = next === -1 ? 0 : 1
    if (next !== -1) uAccent.value.set(ACCENTS[next])
  }

  return (
    <mesh
      position={position}
      scale={hovered ? 1.05 : 1}
      castShadow
      receiveShadow
      onClick={handleClick}
      onPointerOver={(event) => {
        event.stopPropagation()
        setHovered(true)
      }}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[size, size, size]} />
      {/* keyed by the graph so a rebuilt node graph remounts the material */}
      <meshStandardNodeMaterial
        key={colorNode.uuid}
        colorNode={colorNode}
        emissiveNode={emissiveNode}
        roughness={0.35}
        metalness={0.1}
      />
    </mesh>
  )
}
