export function Lights() {
  return (
    <>
      {/* Soft base fill so unlit faces aren't pure black */}
      <ambientLight intensity={0.5} />

      {/* Key light — casts the main shadows */}
      <directionalLight
        position={[6, 10, 4]}
        intensity={2.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.0002}
      />

      {/* Violet accent spot from the far side */}
      <spotLight
        position={[-6, 8, -5]}
        angle={0.45}
        penumbra={1}
        intensity={150}
        color="#8b5cf6"
        castShadow
      />
    </>
  )
}
