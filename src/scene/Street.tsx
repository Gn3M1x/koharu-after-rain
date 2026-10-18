import { useMemo } from 'react'
import * as THREE from 'three'
import { Batch, Box, Cylinder, type Part } from './Primitives'
import { random } from './materials'
import { WetRoad } from './WetRoad'

function Puddle({ x,z,scale=1 }: { x:number; z:number; scale?:number }) {
  const shape=useMemo(()=>{
    const s=new THREE.Shape(),rng=random(Math.round((x+10)*77+z*3))
    for(let i=0;i<=32;i++){const a=i/32*Math.PI*2,r=.72+rng()*.16;const px=Math.cos(a)*r*scale,py=Math.sin(a)*r*scale*.46;if(i===0)s.moveTo(px,py);else s.lineTo(px,py)}
    return s
  },[x,z,scale])
  return <mesh position={[x,.039,z]} rotation={[-Math.PI/2,0,0]}><shapeGeometry args={[shape]} /><meshStandardMaterial color="#83b2c0" transparent opacity={.14} metalness={.5} roughness={.08} depthWrite={false} /></mesh>
}

export function Street() {
  const {tiles,curbs,marks,tactile,grates} = useMemo(()=>{
    const tiles:Part[]=[],curbs:Part[]=[],marks:Part[]=[],tactile:Part[]=[],grates:Part[]=[]
    const rng=random(98)
    for(let x=-7.5;x<4.6;x+=.68)for(let z=-7.5;z<3.2;z+=.68){
      if(x>-5.9&&x<3.6&&z>-5.85&&z<.9)continue
      tiles.push({p:[x+.32,.222,z+.32],s:[.661,.025,.661],c:rng()>.52?'#788b8e':'#71858a'})
    }
    for(let x=-7.65;x<4.8;x+=.63)curbs.push({p:[x,.145,3.38],s:[.605,.29,.22],c:'#9ba7a2'})
    for(let z=-7.6;z<3.4;z+=.63)curbs.push({p:[4.87,.145,z],s:[.22,.29,.605],c:'#9ba7a2'})
    for(let x=-6.9;x<4.4;x+=.24){
      tactile.push({p:[x,.248,2.7],s:[.23,.028,.35],c:'#c5b27b'})
      for(let n=0;n<3;n++) tactile.push({p:[x-.07+n*.065,.268,2.7],s:[.018,.012,.29],c:'#dac790'})
    }
    for(let z=-6.2;z<2.7;z+=.24){
      tactile.push({p:[4.14,.248,z],s:[.35,.028,.23],c:'#c5b27b'})
      for(let n=0;n<3;n++)tactile.push({p:[4.14,.268,z-.07+n*.065],s:[.29,.012,.018],c:'#dac790'})
    }
    for(let i=0;i<7;i++)marks.push({p:[-5.85+i*.89,.037,5.34],s:[.48,.015,2.77],c:'#c5cfbf'})
    marks.push({p:[-3.2,.039,3.94],s:[6.2,.018,.1],c:'#e1dcc0'})
    marks.push({p:[6.45,.039,3.1],s:[2.2,.018,.1],c:'#e1dcc0'})
    for(let z=-6;z<2.9;z+=2.5)marks.push({p:[7.55,.037,z],s:[.08,.012,1.25],c:'#adbbae'})
    // A single compact parking bay, on the side street.
    for(const z of [-5.7,-2.4]) marks.push({p:[6.45,.038,z],s:[1.63,.018,.075],c:'#c5c8ae'})
    marks.push({p:[5.64,.038,-4.05],s:[.075,.018,3.3],c:'#c5c8ae'})
    marks.push({p:[6.36,.04,-3.7],s:[.085,.02,.68],c:'#cbd0bc'})
    marks.push({p:[6.6,.04,-3.42],s:[.5,.02,.08],c:'#cbd0bc'})
    marks.push({p:[6.82,.04,-3.66],s:[.08,.02,.48],c:'#cbd0bc'})
    marks.push({p:[6.61,.04,-3.9],s:[.45,.02,.08],c:'#cbd0bc'})
    for(let x=-7.1;x<4.7;x+=1.8){
      grates.push({p:[x,.04,3.69],s:[.94,.035,.29],c:'#263e4b'})
      for(let j=0;j<12;j++)grates.push({p:[x-.43+j*.078,.066,3.69],s:[.029,.014,.25],c:'#6c858b'})
    }
    for(let z=-6.6;z<3;z+=2){
      grates.push({p:[5.17,.04,z],s:[.27,.035,.85],c:'#263e4b'})
      for(let j=0;j<10;j++)grates.push({p:[5.17,.066,z-.36+j*.078],s:[.23,.014,.026],c:'#6c858b'})
    }
    return {tiles,curbs,marks,tactile,grates}
  },[])
  return <group name="square-diorama-base">
    <Box p={[0,-.48,0]} s={[16.1,.83,16.1]} c="#28394c" />
    <Box p={[0,-.88,0]} s={[15.72,.1,15.72]} c="#17283b" />
    <Box p={[0,-.065,0]} s={[16.13,.07,16.13]} c="#7a9298" outline={false} />
    <WetRoad />
    <Box p={[-1.52,.115,-2.08]} s={[12.55,.22,10.8]} c="#71878b" outline={false} />
    <Batch parts={tiles} /><Batch parts={curbs} outline /><Batch parts={marks} /><Batch parts={tactile} /><Batch parts={grates} />
    <Puddle x={1.4} z={5.1} scale={1.6} /><Puddle x={5.95} z={.7} scale={1.1} /><Puddle x={-6.1} z={7.1} scale={1.2} /><Puddle x={3.8} z={6.7} scale={1.4} />
    <group position={[5.9,.07,5.73]}>
      <Cylinder p={[0,0,0]} radius={.47} height={.028} c="#334e60" />
      {[.29,.42].map(r=><mesh key={r} rotation={[-Math.PI/2,0,0]} position={[0,.019,0]}><ringGeometry args={[r,r+.012,40]} /><meshBasicMaterial color="#829ba0" /></mesh>)}
      <Batch parts={Array.from({length:7},(_,i)=>({p:[-.25+i*.08,.02,0],s:[.02,.01,.42],c:'#7c9597'})) as Part[]} />
    </group>
    {/* The only world outside the plinth is its soft studio shadow. */}
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.96,0]} receiveShadow><planeGeometry args={[200,200]} /><shadowMaterial color="#080f25" opacity={.32} transparent depthWrite={false} /></mesh>
  </group>
}
