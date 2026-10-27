import { Canvas } from '@react-three/fiber'
import { Component, type ReactNode } from 'react'

export interface MiniRack {
  id: string
  name: string
  x: number
  z: number
  width: number
  depth: number
  height: number
}

function Rack({ rack, alert }: { rack: MiniRack; alert: boolean }) {
  return (
    <group position={[rack.x, 0, rack.z]}>
      <mesh position={[0, rack.height / 2, 0]}>
        <boxGeometry args={[rack.width, rack.height, rack.depth]} />
        <meshStandardMaterial
          color={alert ? '#f59e0b' : '#d7e5ea'}
          roughness={0.72}
          metalness={0.04}
        />
      </mesh>
      {alert && (
        <mesh position={[0, rack.height + 0.32, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color="#dc2626"
            emissive="#dc2626"
            emissiveIntensity={0.85}
          />
        </mesh>
      )}
    </group>
  )
}

function Fallback() {
  return (
    <div className="today-map__fallback">
      <span>
        Không thể hiển thị 3D trên trình duyệt này.
        <br />
        Mở bản đồ kho để xem sơ đồ chi tiết.
      </span>
    </div>
  )
}

class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? <Fallback /> : this.props.children
  }
}

export function MiniWarehouse3D({
  racks,
  alertRacks,
}: {
  racks: MiniRack[]
  alertRacks: string[]
}) {
  if (!racks.length) return <Fallback />
  return (
    <SceneBoundary>
      <Canvas
        camera={{ position: [6.6, 6.8, 8.4], fov: 38 }}
        dpr={[1, 1.5]}
        frameloop="demand"
        aria-label="Bản đồ 3D thu nhỏ của kho"
      >
        <color attach="background" args={['#eef5f7']} />
        <ambientLight intensity={1.15} />
        <directionalLight position={[6, 10, 5]} intensity={1.7} />
        <gridHelper
          args={[14, 14, '#c9dbe2', '#e2edf1']}
          position={[0, 0, -1.5]}
        />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -1.5]}>
          <planeGeometry args={[14, 12]} />
          <meshStandardMaterial color="#e7f0f3" />
        </mesh>
        <group position={[0, 0, -1.5]}>
          {racks.map((rack) => (
            <Rack
              key={rack.id}
              rack={rack}
              alert={alertRacks.includes(rack.id)}
            />
          ))}
        </group>
      </Canvas>
    </SceneBoundary>
  )
}
