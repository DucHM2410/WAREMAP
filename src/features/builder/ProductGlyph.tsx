import type { Product, Rack } from "../../app/model"
import { storagePackageFor, packageGeometry, type ProductDisplay } from "./productSizing"

function UnitGlyph({ product, rack, mode, siblings, color, selected }: {product: Product; rack: Rack; mode: ProductDisplay; siblings: number; color: string; selected: boolean}) {
  const {value} = storagePackageFor(product)
  const {width,depth,height} = packageGeometry(value,rack,mode,siblings)
  const material = <meshStandardMaterial color={selected ? "#f4b24d" : color} emissive={selected ? "#f4b24d" : "#000"} emissiveIntensity={selected ? .25 : 0}/>
  const cap = <meshStandardMaterial color={selected ? "#ffe0a6" : "#e1e9f0"}/>
  return <group position={[0,height / 2 + .035,0]}>
    {value.shape === "box" ? <mesh><boxGeometry args={[width,height,depth]}/>{material}</mesh> : value.shape === "tube" ? <>
      <mesh position={[0,height * .05,0]}><boxGeometry args={[width,height * .9,depth]}/>{material}</mesh><mesh position={[0,-height * .45,0]}><boxGeometry args={[width,height * .1,depth]}/>{cap}</mesh>
    </> : <group scale={[width,1,depth]}>
      <mesh position={[0,-height * .08,0]}><cylinderGeometry args={[.5,.5,height * .84,16]}/>{material}</mesh><mesh position={[0,height * .42,0]}><cylinderGeometry args={[value.shape === "bottle" ? .24 : .52,value.shape === "bottle" ? .24 : .52,height * .16,16]}/>{cap}</mesh>
    </group>}
  </group>
}

export function ProductGlyph(props: Parameters<typeof UnitGlyph>[0]) {
  const layers=props.product.storage3d?.stackable ? Math.min(3,Math.max(1,props.product.storage3d.layers)) : 1
  const rack=props.mode === "readable" ? {...props.rack,height:props.rack.height/layers} : props.rack
  const height=packageGeometry(storagePackageFor(props.product).value,rack,props.mode,props.siblings).height
  return <group>{Array.from({length:layers},(_,index)=><group key={index} position={[0,index*height,0]}><UnitGlyph {...props} rack={rack}/></group>)}</group>
}
