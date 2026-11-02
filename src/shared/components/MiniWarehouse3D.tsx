import { Canvas } from '@react-three/fiber'
import { Component, type ReactNode } from 'react'
import { Bounds, OrbitControls, Html } from '@react-three/drei'
import { WarehouseRack } from '../../features/builder/WarehouseRack'
import type { Product, Rack as WarehouseRackData } from '../../app/model'

export interface MiniRack {
  id: string
  name: string
  x: number
  z: number
  width: number
  depth: number
  height: number
  levels?: number
  bins?: number
  rotation?: number
  kind?: string
}

function Rack({ rack, alert, products, onSelect }: { rack: MiniRack; alert: boolean; products: Product[]; onSelect?: (rack: MiniRack) => void }) {
  return (
    <group>
      <WarehouseRack rack={{...rack,levels:rack.levels??3,bins:rack.bins??3,rotation:rack.rotation??0,kind:rack.kind??"Kệ hàng"} as WarehouseRackData} active color={alert?'#d97706':'#7894af'} contents={products} inspecting={false} onSelect={()=>onSelect?.(rack)} onProductSelect={()=>onSelect?.(rack)} onTransform={()=>{}} expiryLayer={false} expiryDays={30}/>
      <Html position={[rack.x,rack.height+.35,rack.z]} center style={{pointerEvents:'none'}}><span style={{fontSize:10,fontWeight:700,background:alert?'#fff7ed':'#fff',color:alert?'#9a3412':'#334155',padding:'3px 7px',borderRadius:6,whiteSpace:'nowrap'}}>{rack.id}{alert?' · Cần kiểm tra':''}</span></Html>
      {alert && (
        <mesh position={[rack.x, rack.height + 0.65, rack.z]}>
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
  products = [],
  onRackSelect,
}: {
  racks: MiniRack[]
  alertRacks: string[]
  products?: Product[]
  onRackSelect?: (rack: MiniRack) => void
}) {
  if (!racks.length) return <Fallback />
  const minX=Math.min(...racks.map(rack=>rack.x-Math.hypot(rack.width,rack.depth)/2))-1.5
  const maxX=Math.max(...racks.map(rack=>rack.x+Math.hypot(rack.width,rack.depth)/2))+1.5
  const minZ=Math.min(...racks.map(rack=>rack.z-Math.hypot(rack.width,rack.depth)/2))-1.5
  const maxZ=Math.max(...racks.map(rack=>rack.z+Math.hypot(rack.width,rack.depth)/2))+1.5
  const floorSize=Math.ceil(Math.max(maxX-minX,maxZ-minZ))
  const centerX=(minX+maxX)/2,centerZ=(minZ+maxZ)/2
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
          args={[floorSize, floorSize, '#c9dbe2', '#e2edf1']}
          position={[centerX, 0, centerZ]}
        />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[centerX, -0.02, centerZ]}>
          <planeGeometry args={[floorSize, floorSize]} />
          <meshStandardMaterial color="#e7f0f3" />
        </mesh>
        <Bounds fit clip observe margin={1.35}>
        <group>
          {racks.map((rack) => (
            <Rack
              key={rack.id}
              rack={rack}
              alert={alertRacks.includes(rack.id)}
              products={products.filter(product=>product.rack===rack.id&&product.qty>0)}
              onSelect={onRackSelect}
            />
          ))}
        </group>
        </Bounds>
        <OrbitControls makeDefault enablePan={false} enableZoom={false} minPolarAngle={.25} maxPolarAngle={Math.PI/2.1}/>
      </Canvas>
    </SceneBoundary>
  )
}
