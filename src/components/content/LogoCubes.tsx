import { Cube } from './Cube'

/**
 * The Poimandres mark as a pixel grid, seen from above:
 *
 *   . X X
 *   X X X
 *   . X .
 */
const PATTERN = [
  [0, 1, 1],
  [1, 1, 1],
  [0, 1, 0],
]

const SIZE = 1
// The logo uses 240px cells on a 280px pitch — same ratio here
const SPACING = SIZE * (280 / 240)

export function LogoCubes() {
  return (
    <group>
      {PATTERN.flatMap((row, rowIndex) =>
        row.map((filled, colIndex) => {
          if (!filled) return null
          return (
            <Cube
              key={`${colIndex}-${rowIndex}`}
              position={[(colIndex - 1) * SPACING, SIZE / 2, (rowIndex - 1) * SPACING]}
              size={SIZE}
            />
          )
        }),
      )}
    </group>
  )
}
