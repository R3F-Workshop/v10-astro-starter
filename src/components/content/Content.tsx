import { useControls } from 'leva'
import { LogoCubes } from './LogoCubes'
import { Pyramid } from './Pyramid'
import { Suzi } from './Suzi'

/**
 * Everything inside <Canvas> lives here. Note that hooks like useControls /
 * useFrame / useThree only work in components rendered inside the Canvas.
 */
export function Content() {
  const { rotation } = useControls({
    rotation: { value: [-1, 0.77, 1], min: -5, max: Math.PI * 2 }
  })
  return (
    <>      
      <LogoCubes />
      <Pyramid position={[2, 1, -3]} />
      <Suzi position={[-4, 1.2, -3]} rotation={rotation} scale={3} />
    </>
  )
}
