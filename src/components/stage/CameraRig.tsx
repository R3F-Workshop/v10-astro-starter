import { OrbitControls } from '@react-three/drei'
import { useControls } from 'leva'

// Note: the drei v11 alpha doesn't ship CameraControls (yet) — OrbitControls
// it is, which conveniently has auto-rotate built in.
export function CameraRig() {
  const { autoRotate } = useControls('Camera', { autoRotate: true })

  return (
    <OrbitControls
      makeDefault
      target={[0, 1, 0]}
      autoRotate={autoRotate}
      autoRotateSpeed={0.8}
      enableDamping
      minPolarAngle={0.2}
      maxPolarAngle={Math.PI / 2.05}
      minDistance={4}
      maxDistance={25}
    />
  )
}
