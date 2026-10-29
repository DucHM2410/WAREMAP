import { useEffect, useMemo, useRef } from "react"

import { TransformControls } from "@react-three/drei"

import { CanvasTexture, Group, Plane, Vector3 } from "three"

import { fitToFloor } from "./rackLibrary"

import { type Product, type Rack, daysLeft } from "../../app/model"

import { productKey } from "../../app/catalog"

function RackLabel({ text, height }: { text: string
 height: number }) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas")

    canvas.width = 512
    canvas.height = 128

    const context = canvas.getContext("2d")!

    context.fillStyle = "#ffffff"
    context.fillRect(0, 0, 512, 128)

    context.fillStyle = "#385b6a"
    context.font = "500 46px sans-serif"

    context.textAlign = "center"
    context.textBaseline = "middle"

    context.fillText(text, 256, 66, 480)

    return new CanvasTexture(canvas)
  }, [text])

  useEffect(() => () => texture.dispose(), [texture])

  return (
    <sprite position={[0, height + 0.35, 0]} scale={[1.55, 0.39, 1]}>
      <spriteMaterial map={texture} transparent depthTest={false} />
    </sprite>
  )
}

export function WarehouseRack({
  rack,
  active,
  color,
  contents,
  selectedKey,
  onSelect,
  onProductSelect,
  transform,
  onTransform,
  expiryLayer,
  expiryDays,
  draggable,
  onDragging,
}: {
  rack: Rack
  active: boolean
  color: string
  contents: Product[]
  selectedKey?: string

  onSelect: () => void
  onProductSelect: (product: Product) => void

  transform?: "translate" | "rotate"

  onTransform: (x: number, z: number, rotation: number) => void

  expiryLayer: boolean
  expiryDays: number

  draggable?: boolean
  onDragging?: (dragging: boolean) => void
}) {
  const group = useRef<Group>(null!)

  const manipulating = useRef(false)

  const drag = useRef<{
    pointerId: number
    offsetX: number
    offsetZ: number
  } | null>(null)

  const floor = useMemo(() => new Plane(new Vector3(0, 1, 0), 0), [])

  useEffect(
    () => () => {
      onDragging?.(false)
    },
    [onDragging],
  )

  const shelf = rack.height / rack.levels

  const body = (
    <group
      ref={group}
      position={[rack.x, 0, rack.z]}
      rotation={[0, (rack.rotation * Math.PI) / 180, 0]}
      onPointerDown={(e) => {
        if (!draggable || e.button !== 0) return

        const point = e.ray.intersectPlane(floor, new Vector3())

        if (!point) return

        e.stopPropagation()
        onSelect()
        manipulating.current = true

        drag.current = {
          pointerId: e.pointerId,
          offsetX: point.x - rack.x,
          offsetZ: point.z - rack.z,
        }
        ;(e.target as Element | null)?.setPointerCapture(e.pointerId)
        onDragging?.(true)
      }}
      onPointerMove={(e) => {
        if (!drag.current || e.pointerId !== drag.current.pointerId) return

        e.stopPropagation()

        const point = e.ray.intersectPlane(floor, new Vector3())

        if (!point) return

        const position = fitToFloor(
          point.x - drag.current.offsetX,
          point.z - drag.current.offsetZ,
          rack.width,
          rack.depth,
          rack.rotation,
        )

        group.current.position.set(position.x, 0, position.z)
      }}
      onPointerUp={(e) => {
        if (!drag.current || e.pointerId !== drag.current.pointerId) return

        e.stopPropagation()
        drag.current = null
        ;(e.target as Element | null)?.releasePointerCapture(e.pointerId)
        onDragging?.(false)

        onTransform(
          group.current.position.x,
          group.current.position.z,
          rack.rotation,
        )

        requestAnimationFrame(() => {
          manipulating.current = false
        })
      }}
      onPointerCancel={(e) => {
        if (!drag.current) return

        drag.current = null
        manipulating.current = false
        onDragging?.(false)

        group.current.position.set(rack.x, 0, rack.z)
        ;(e.target as Element | null)?.releasePointerCapture(e.pointerId)
      }}
      onClick={(e) => {
        e.stopPropagation()
        if (!manipulating.current) onSelect()
      }}
    >
      {[-1, 1].flatMap((x) =>
        [-1, 1].map((z) => (
          <mesh
            key={`${x}-${z}`}
            position={[
              (x * rack.width) / 2,
              rack.height / 2,
              (z * rack.depth) / 2,
            ]}
          >
            <boxGeometry args={[0.06, rack.height, 0.06]} />
            <meshStandardMaterial
              color={active ? color : "#aab7bf"}
              emissive={active ? color : "#000"}
              emissiveIntensity={active ? 0.3 : 0}
            />
          </mesh>
        )),
      )}
      {Array.from({ length: rack.levels + 1 }, (_, i) => (
        <mesh key={i} position={[0, i * shelf, 0]}>
          <boxGeometry args={[rack.width + 0.08, 0.055, rack.depth + 0.07]} />
          <meshStandardMaterial color={active ? color : "#c3cdd3"} />
        </mesh>
      ))}
      {rack.kind === "Kệ pallet" &&
        Array.from({ length: rack.levels }, (_, i) => (
          <mesh
            key={`beam-${i}`}
            position={[0, (i + 1) * shelf - 0.08, rack.depth / 2]}
          >
            <boxGeometry args={[rack.width, 0.13, 0.09]} />
            <meshStandardMaterial color="#ed9b46" />
          </mesh>
        ))}
      {["Kệ chia ô", "Tủ bảo quản"].includes(rack.kind) &&
        Array.from({ length: Math.max(0, rack.bins - 1) }, (_, i) => (
          <mesh
            key={`divider-${i}`}
            position={[
              -rack.width / 2 + ((i + 1) * rack.width) / rack.bins,
              rack.height / 2,
              0,
            ]}
          >
            <boxGeometry args={[0.035, rack.height, rack.depth]} />
            <meshStandardMaterial color={active ? color : "#bacbd5"} />
          </mesh>
        ))}
      {rack.kind === "Tủ bảo quản" && (
        <>
          <mesh position={[0, rack.height / 2, -rack.depth / 2]}>
            <boxGeometry args={[rack.width, rack.height, 0.045]} />
            <meshStandardMaterial color="#bdd5df" />
          </mesh>
          {[-1, 1].map((side) => (
            <mesh
              key={side}
              position={[(side * rack.width) / 2, rack.height / 2, 0]}
            >
              <boxGeometry args={[0.045, rack.height, rack.depth]} />
              <meshStandardMaterial color={active ? color : "#bdd5df"} />
            </mesh>
          ))}
        </>
      )}
      {rack.kind === "Ô xếp hàng" && (
        <mesh position={[0, 0.09, 0]}>
          <boxGeometry args={[rack.width, 0.18, rack.depth]} />
          <meshStandardMaterial color="#bb945f" />
        </mesh>
      )}
      {contents
        .filter((p) => p.qty > 0)
        .map((p) => {
          const siblings = contents.filter(
            (item) =>
              item.qty > 0 && item.level === p.level && item.bin === p.bin,
          )

          const index = siblings.indexOf(p)

          const binWidth = rack.width / rack.bins

          const selected = selectedKey === productKey(p)

          const fill = expiryLayer
            ? daysLeft(p.expiry) < 0
              ? "#dc525e"
              : daysLeft(p.expiry) <= expiryDays
                ? "#e6a338"
                : "#71ac97"
            : color

          return (
            <mesh
              key={productKey(p)}
              position={[
                -rack.width / 2 +
                  (p.bin - 0.5) * binWidth +
                  ((index - (siblings.length - 1) / 2) * binWidth * 0.8) /
                    siblings.length,
                (p.level - 1) * shelf + shelf * 0.42,
                0,
              ]}
              onClick={(e) => {
                e.stopPropagation()
                if (!manipulating.current) onProductSelect(p)
              }}
            >
              <boxGeometry
                args={[
                  (binWidth * 0.72) / siblings.length,
                  shelf * 0.65,
                  rack.depth * 0.72,
                ]}
              />
              <meshStandardMaterial
                color={selected ? "#f4b24d" : fill}
                emissive={selected ? "#f4b24d" : "#000"}
                emissiveIntensity={selected ? 0.25 : 0}
                transparent
                opacity={active || selected ? 1 : 0.75}
              />
            </mesh>
          )
        })}
      <RackLabel text={rack.name} height={rack.height} />
    </group>
  )

  if (!active || !transform) return body

  return (
    <>
      {body}
      <TransformControls
        object={group}
        mode={transform}
        space="world"
        showX={transform === "translate"}
        showY={transform === "rotate"}
        showZ={transform === "translate"}
        translationSnap={0.5}
        rotationSnap={Math.PI / 12}
        onMouseDown={() => {
          manipulating.current = true
        }}
        onMouseUp={() => {
          if (group.current) {
            const { position, rotation } = group.current

            onTransform(
              Math.max(-7, Math.min(7, position.x)),
              Math.max(-5, Math.min(7, position.z)),
              Math.round((rotation.y * 180) / Math.PI),
            )
          }

          requestAnimationFrame(() => {
            manipulating.current = false
          })
        }}
      />
    </>
  )
}
