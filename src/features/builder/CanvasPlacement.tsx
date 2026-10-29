import { useEffect, type MutableRefObject } from "react"
import { useThree } from "@react-three/fiber"
import { Plane, Raycaster, Vector2, Vector3 } from "three"

export type PlacementProjector = (
  clientX: number,
  clientY: number,
) => { x: number
 z: number } | null

export function CanvasPlacement({
  projector,
}: {
  projector: MutableRefObject<PlacementProjector | null>
}) {
  const { camera, gl } = useThree()
  useEffect(() => {
    const ray = new Raycaster()
    const floor = new Plane(new Vector3(0, 1, 0), 0)
    projector.current = (x, y) => {
      const rect = gl.domElement.getBoundingClientRect()
      ray.setFromCamera(
        new Vector2(
          ((x - rect.left) / rect.width) * 2 - 1,
          (-(y - rect.top) / rect.height) * 2 + 1,
        ),
        camera,
      )
      const point = ray.ray.intersectPlane(floor, new Vector3())
      return point ? { x: point.x, z: point.z } : null
    }
    return () => {
      projector.current = null
    }
  }, [camera, gl, projector])
  return null
}
