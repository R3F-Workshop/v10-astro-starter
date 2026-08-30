export function Floor() {
  return (
    <group>
      {/* Shadow-catching ground plane, just under the grid to avoid z-fighting */}
      <mesh rotation-x={-Math.PI / 2} position-y={-0.02} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#141417" />
      </mesh>

      {/* three's built-in grid helper; the scene fog fades it out at distance.
          (drei's fancier <Grid> hasn't landed in the v11 alpha yet.) */}
      <gridHelper args={[60, 100, '#3f3f46', '#232326']} />
    </group>
  )
}
