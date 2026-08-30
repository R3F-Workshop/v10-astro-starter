import { forwardRef, useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import {
  Mesh,
  MeshNormalNodeMaterial,
  MeshPhysicalNodeMaterial,
  MeshStandardNodeMaterial,
  type Material,
  type MeshStandardMaterial,
} from "three/webgpu";
import type { ThreeElements } from "@react-three/fiber";
import { useControls } from "leva";
import { useUniforms } from "@react-three/fiber/webgpu";
import type { Node } from "three/webgpu";

type SuziMaterial = "colored" | "chrome" | "glass" | "normals" | "original";

/**
 * R3F aliases UniformNode with three's nodeType param pinned to `unknown`, so
 * store uniforms satisfy none of the material's `Node<'color'>`-style slots and
 * won't even direct-cast. Launder it in one place; delete once r3f types land.
 */
const asNode = <T extends string>(u: unknown) => u as Node<T>;

export const Suzi = forwardRef<Mesh, ThreeElements["mesh"]>(
  (props, meshRef) => {
    // Load the mesh, triggers suspense
    const { nodes } = useGLTF("/models/suzimatholder.glb");

    const { material, color: pickedColor } = useControls("Suzi", {
      material: {
        label: "Material",
        value: "original" as SuziMaterial,
        options: {
          "Original (GLB)": "original",
          Color: "colored",
          Chrome: "chrome",
          Glass: "glass",
          Normals: "normals",
        },
      },
      color: {
        label: "Color",
        value: "#ff4422",
        // only meaningful for the color material — hide it otherwise
        render: (get) => get("Suzi.material") === "colored",
      },
    });

    // The bridge from React state into TSL. useUniforms memoizes on the *value*
    // (deep compare), so a new Leva color re-runs its reconcile and writes onto
    // the existing UniformNode. The graph is untouched, nothing recompiles.
    // NB: useUniform (singular) memoizes on the *name*, so it seeds the initial
    // value and never tracks changes — it is a creator/reader, not a binding.
    const { uColor } = useUniforms({ uColor: pickedColor }, "suzi");

    // Extract the mesh and original material for the selector
    // Also the color override material
    const { mesh, original } = useMemo(() => {
      const mesh = nodes.Suzanne as Mesh;

      return {
        mesh,
        original: mesh.material as MeshStandardMaterial,
      };
    }, [nodes]);

    // Generate the materials ONLY ONCE
    const overrides = useMemo<
      Record<Exclude<SuziMaterial, "original">, Material>
    >(() => {
      const colorOverride = new MeshStandardNodeMaterial({
        roughness: 0.9,
        metalness: 0,
      });
      colorOverride.colorNode = asNode<"color">(uColor);

      return {
        colored: colorOverride,
        chrome: new MeshStandardNodeMaterial({
          metalness: 1,
          roughness: 0.08,
        }),
        glass: new MeshPhysicalNodeMaterial({
          transmission: 1,
          roughness: 0.12,
          thickness: 1.4,
          ior: 1.45,
        }),
        normals: new MeshNormalNodeMaterial(),
      };
    }, []);

    useEffect(() => {
      mesh.material =
        material === "original"
          ? original
          : overrides[material as Exclude<SuziMaterial, "original">];
    }, [material, mesh, original, overrides]);

    return (
      <>
        <primitive
          ref={meshRef}
          castShadow
          receiveShadow
          object={mesh}
          {...props}
        />
      </>
    );
  },
);
