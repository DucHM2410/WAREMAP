import type { Product, Rack } from "../../app/model"
import { storagePackageFor, storageUnits, type ProductDisplay } from "./productSizing"
export const slotProductKey=(p:Product)=>[p.id,p.batch,p.branch].join("|")
const overlap=(a:number,aw:number,b:number,bw:number)=>a<b+bw-1e-7&&b<a+aw-1e-7
export function slotLayout(rack:Rack,products:Product[]){
  const items=products.filter(p=>p.qty>0)
  const widthCm=rack.width/rack.bins*100,depthCm=rack.depth*100,heightCm=rack.height/rack.levels*100-5.5
  const uncertain=items.some(p=>storagePackageFor(p).estimated)
  const entries=items.map(product=>{
    const pack=storagePackageFor(product),layers=product.storage3d?.stackable?Math.max(1,product.storage3d.layers):1
    const rows=Math.floor((depthCm+1e-8)/pack.value.depthCm)
    const columns=rows?Math.ceil(storageUnits(product)/(rows*layers)):Infinity
    const neededCm=columns*pack.value.widthCm,reservedCm=uncertain?widthCm/Math.max(1,items.length):neededCm
    const usedDepth=Number.isFinite(columns)&&columns>0?Math.ceil(storageUnits(product)/(columns*layers))*pack.value.depthCm:depthCm+1
    return {product,key:slotProductKey(product),reservedCm,neededCm,offsetCm:0,depthUsedCm:uncertain?depthCm:usedDepth,heightUsedCm:pack.value.heightCm*layers,xCm:0,zCm:0,yCm:0,valid:pack.estimated||(neededCm<=reservedCm+1e-8&&layers*pack.value.heightCm<=heightCm+1e-8),placed:false}
  })
  const place=(entry:typeof entries[number],visiting=new Set<string>()):boolean=>{
    if(entry.placed)return entry.valid
    if(visiting.has(entry.key)){entry.valid=false;return false}
    visiting.add(entry.key)
    const placement=entry.product.storage3d?.placement
    if(placement?.onTopOf){
      const support=entries.find(e=>e.key===placement.onTopOf)
      if(!support||uncertain||!place(support,visiting)||!support.product.storage3d?.stackable||!entry.product.storage3d?.stackable||storagePackageFor(support.product).value.shape!=="box")entry.valid=false
      if(support){entry.xCm=placement.xCm;entry.zCm=placement.zCm;entry.yCm=support.yCm+support.heightUsedCm;entry.valid=entry.valid&&entry.xCm>=support.xCm-1e-7&&entry.zCm>=support.zCm-1e-7&&entry.xCm+entry.reservedCm<=support.xCm+support.reservedCm+1e-7&&entry.zCm+entry.depthUsedCm<=support.zCm+support.depthUsedCm+1e-7}
    }else if(placement){entry.xCm=placement.xCm;entry.zCm=placement.zCm;if(uncertain)entry.valid=false}
    else{
      const others=entries.filter(e=>e.placed)
      const xs=[0,...others.map(e=>e.xCm+e.reservedCm)],zs=uncertain?[0]:[0,...others.map(e=>e.zCm+e.depthUsedCm)]
      let found=false
      for(const z of zs.sort((a,b)=>a-b)){for(const x of xs.sort((a,b)=>a-b)){
        if(x+entry.reservedCm>widthCm+1e-7||z+entry.depthUsedCm>depthCm+1e-7)continue
        if(others.some(e=>e.yCm<entry.heightUsedCm&&overlap(x,entry.reservedCm,e.xCm,e.reservedCm)&&overlap(z,entry.depthUsedCm,e.zCm,e.depthUsedCm)))continue
        entry.xCm=x;entry.zCm=z;found=true;break
      }if(found)break}
      if(!found)entry.valid=false
    }
    entry.valid=entry.valid&&[entry.xCm,entry.zCm,entry.yCm,entry.reservedCm,entry.depthUsedCm,entry.heightUsedCm].every(Number.isFinite)&&entry.xCm>=0&&entry.zCm>=0&&entry.yCm+entry.heightUsedCm<=heightCm+1e-7&&entry.xCm+entry.reservedCm<=widthCm+1e-7&&entry.zCm+entry.depthUsedCm<=depthCm+1e-7
    entry.offsetCm=entry.xCm+entry.reservedCm/2-widthCm/2;entry.placed=true;visiting.delete(entry.key)
    return entry.valid
  }
  entries.filter(e=>e.product.storage3d?.placement).forEach(e=>place(e))
  entries.forEach(e=>place(e))
  for(let i=0;i<entries.length;i++)for(let j=i+1;j<entries.length;j++){
    const a=entries[i],b=entries[j]
    if(overlap(a.xCm,a.reservedCm,b.xCm,b.reservedCm)&&overlap(a.zCm,a.depthUsedCm,b.zCm,b.depthUsedCm)&&overlap(a.yCm,a.heightUsedCm,b.yCm,b.heightUsedCm)){a.valid=false;b.valid=false}
  }
  const usedCm=Math.max(0,...entries.map(e=>e.xCm+e.reservedCm))
  const usedArea=entries.filter(e=>e.yCm===0).reduce((sum,e)=>sum+e.reservedCm*e.depthUsedCm,0)
  return {entries,widthCm,depthCm,heightCm,usedCm,freeCm:Math.max(0,widthCm-usedCm),freeAreaCm2:Math.max(0,widthCm*depthCm-usedArea),uncertain,fits:entries.every(e=>e.valid)}
}
export function slotProductPosition(product:Product,rack:Rack,siblings:Product[],_mode:ProductDisplay){
  const layout=slotLayout(rack,siblings),entry=layout.entries.find(e=>e.key===slotProductKey(product))
  if(entry&&layout.fits&&!layout.uncertain)return {x:entry.offsetCm/100,z:rack.depth/2-(entry.zCm+entry.depthUsedCm/2)/100,y:entry.yCm/100,entry}
  const index=Math.max(0,siblings.findIndex(p=>slotProductKey(p)===slotProductKey(product)))
  return {x:(index-(siblings.length-1)/2)*(rack.width/rack.bins)*.8/Math.max(1,siblings.length),z:0,y:0,entry:undefined}
}
export const slotProductOffset=(product:Product,rack:Rack,siblings:Product[],mode:ProductDisplay)=>slotProductPosition(product,rack,siblings,mode).x
