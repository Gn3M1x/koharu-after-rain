import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import { Batch, Box, Cylinder, Pipe, Sign, type Part, type V3 } from './Primitives'
import { foodTexture, signTexture } from './materials'

function AirConditioner({p,rotation=0}: {p:V3;rotation?:number}) {
  return <group position={p} rotation={[0,rotation,0]} name="air-conditioning-unit">
    <Box p={[0,.4,0]} s={[1.35,.76,.65]} c="#abb7a6" />
    <Cylinder p={[-.25,.41,.34]} radius={.27} height={.025} rotation={[Math.PI/2,0,0]} c="#546e70" />
    {[.1,.18,.25].map(r=><mesh key={r} position={[-.25,.41,.365]}><ringGeometry args={[r,r+.013,24]} /><meshToonMaterial color="#a0b4ad" side={THREE.DoubleSide} /></mesh>)}
    {Array.from({length:7},(_,i)=><Box key={i} p={[.4,.18+i*.075,.338]} s={[.3,.018,.025]} c="#62837e" outline={false} />)}
    <Pipe a={[-.55,0,.25]} b={[-.55,0,-.25]} radius={.035} /><Pipe a={[.55,0,.25]} b={[.55,0,-.25]} radius={.035} />
  </group>
}

function Bicycle() {
  const tubes: [V3,V3][] = [
    [[-.61,.42,0],[-.13,.92,0]],[[-.13,.92,0],[.16,.42,0]],[[.16,.42,0],[-.61,.42,0]],
    [[-.13,.92,0],[.52,.94,0]],[[.52,.94,0],[.16,.42,0]],[[.52,.94,0],[.78,.42,0]],
    [[-.13,.92,0],[-.2,1.14,0]],[[.52,.94,0],[.49,1.26,0]],[[.49,1.26,0],[.7,1.3,0]],
  ]
  return <group position={[-4.3,.25,2.17]} rotation={[.07,-.08,-.065]} name="bicycle-with-basket">
    {[-.61,.78].map(x=><group key={x} position={[x,.42,0]}>
      <mesh><torusGeometry args={[.405,.045,8,32]} /><meshToonMaterial color="#263e4d" /></mesh>
      <mesh><torusGeometry args={[.35,.018,6,32]} /><meshToonMaterial color="#a0c1b9" /></mesh>
      {Array.from({length:12},(_,i)=>{const a=i/12*Math.PI*2;return <Pipe key={i} a={[0,0,0]} b={[Math.cos(a)*.35,Math.sin(a)*.35,0]} radius={.006} color="#c6d2c1" />})}
      <Cylinder p={[0,0,0]} radius={.04} height={.14} rotation={[Math.PI/2,0,0]} c="#4a686c" />
    </group>)}
    {tubes.map(([a,b],i)=><Pipe key={i} a={a} b={b} radius={.025} color="#cda47d" />)}
    <Box p={[-.22,1.14,0]} s={[.32,.07,.19]} c="#334c50" />
    <Pipe a={[.7,1.3,-.18]} b={[.7,1.3,.18]} radius={.034} color="#d9c7aa" />
    <Pipe a={[.16,.42,-.14]} b={[.16,.42,.14]} radius={.028} />
    <Box p={[.23,.38,.16]} s={[.2,.04,.12]} c="#34505a" />
    <Pipe a={[.16,.42,0]} b={[-.04,.05,.22]} radius={.015} />
    <Box p={[.86,1.08,0]} s={[.4,.33,.39]} c="#8eaca4" />
    <Box p={[.86,1.26,0]} s={[.44,.045,.44]} c="#c1d1bd" />
    {Array.from({length:6},(_,i)=><Pipe key={i} a={[.67+i*.075,.94,.207]} b={[.67+i*.075,1.25,.207]} radius={.008} color="#4e7772" />)}
    <Box p={[-.6,.92,0]} s={[.6,.04,.18]} c="#739b91" />
  </group>
}

function StreetLamp() {
  return <group position={[6.62,0,2.02]} name="warm-street-lamp">
    <Cylinder p={[0,.16,0]} radius={.2} height={.28} c="#364f5c" />
    <Pipe a={[0,0,0]} b={[0,5.5,0]} radius={.065} color="#4c6875" />
    <Pipe a={[0,5.5,0]} b={[-.37,5.8,0]} radius={.065} color="#4c6875" />
    <Pipe a={[-.37,5.8,0]} b={[-1,5.8,0]} radius={.06} color="#4c6875" />
    <Box p={[-1,5.74,0]} s={[.65,.14,.37]} c="#526f77" />
    <Box p={[-1,5.65,0]} s={[.5,.055,.28]} c="#ffe3ad" glow="#ffd590" intensity={3.1} outline={false} />
    <pointLight position={[-1,5.45,0]} color="#ffd8a0" intensity={35} distance={10} decay={2} />
    <Sign p={[.01,3.18,.08]} size={[.38,1.02]} texture={signTexture('小春町','#d4d7c3','#4b6d6a',true)} />
  </group>
}

function UtilityPoles() {
  const wire = useMemo(()=>{
    const out:V3[][]=[]
    for(let i=0;i<3;i++){
      const pts:V3[]=[]
      for(let j=0;j<=24;j++){const t=j/24;pts.push([-7.08+t*13.8,6.5-Math.sin(t*Math.PI)*1.05+i*.14,-.15+t*-6.6+i*.22])}
      out.push(pts)
    }
    return out
  },[])
  return <group name="utility-poles-and-sagging-wires">
    {([[-7.08,0,-.15],[6.72,0,-6.75]] as V3[]).map((p,i)=><group key={i} position={p}>
      <Cylinder p={[0,3.15,0]} radius={.105} height={6.3} c="#788991" />
      <Cylinder p={[0,.48,0]} radius={.125} height={.95} c="#647c82" />
      <Box p={[0,5.83,0]} s={[1.1,.11,.13]} c="#4c6472" />
      <Box p={[0,6.43,.2]} s={[.87,.1,.12]} c="#4c6472" />
      {[-.36,0,.36].map(x=><group key={x}><Cylinder p={[x,6.6,.2]} radius={.055} height={.24} c="#c0c6b3" /><Cylinder p={[x,6.62,.2]} radius={.075} height={.035} c="#768f8c" /></group>)}
      <Cylinder p={[.24,5.21,0]} radius={.2} height={.69} c="#b5c1b1" />
      <Box p={[0,2.4,.13]} s={[.27,.67,.12]} c="#c2c2a9" />
      <Pipe a={[.28,5.54,0]} b={[.4,6.2,0]} radius={.014} color="#294350" />
      {[1,1.16,1.32].map(y=><Box key={y} p={[0,y,.11]} s={[.16,.075,.025]} c="#e0bd74" outline={false} />)}
    </group>)}
    {wire.map((points,i)=><Line key={i} points={points} color="#263e52" lineWidth={1.3} />)}
    <Line points={Array.from({length:17},(_,j)=>{const t=j/16;return [-7.08+t*.65,5.6-Math.sin(t*Math.PI)*.3,-.15-t*5.8] as V3})} color="#314a58" lineWidth={1.2} />
  </group>
}

function TrafficSignal() {
  const lights=useRef<THREE.MeshBasicMaterial[]>([])
  useFrame(({clock,gl})=>{
    const phase=Math.floor(clock.elapsedTime/12)%3
    lights.current.forEach((m,i)=>{ if(m)m.color.set(i===phase?['#b9e4b5','#e8c880','#df8873'][i]:'#374e59') })
    gl.domElement.dataset.signal=String(phase)
  })
  return <group position={[6.7,.02,-6.75]} name="cycling-traffic-signal">
    <Pipe a={[0,0,0]} b={[0,3.8,0]} radius={.045} />
    <Pipe a={[0,3.8,0]} b={[-.66,3.8,0]} radius={.04} />
    <Box p={[-.72,3.72,.05]} s={[.99,.36,.28]} c="#425e65" />
    {[0,1,2].map(i=><mesh key={i} position={[-1.04+i*.32,3.72,.21]}><circleGeometry args={[.115,24]} /><meshBasicMaterial ref={m=>{if(m)lights.current[i]=m}} toneMapped={false} /></mesh>)}
  </group>
}

function Alley() {
  const blocks = useMemo(()=>{
    const p:Part[]=[]
    for(let z=-7.3;z<-1;z+=.37)for(let y=.4;y<2.15;y+=.32)p.push({p:[-7.54,y,z],s:[.19,.3,.35],c:(Math.round(y*10)%2?'#76888b':'#677e85')})
    return p
  },[])
  return <group name="narrow-side-alley">
    <Batch parts={blocks} outline />
    <Box p={[-7.51,2.2,-4.24]} s={[.31,.13,6.55]} c="#899d9a" />
    <Sign p={[-7.32,1.4,-4.4]} rotation={[0,Math.PI/2,0]} size={[1.62,1.12]} texture={foodTexture('notice')} />
    <AirConditioner p={[-6.55,.26,-4.6]} rotation={Math.PI/2} />
    <Pipe a={[-6.8,.8,-4]} b={[-6.8,2.3,-4]} radius={.025} color="#a7b6a4" />
    <Pipe a={[-6.8,2.3,-4]} b={[-6.1,2.3,-4]} radius={.025} color="#a7b6a4" />
    <Box p={[-6.55,.5,-6.65]} s={[.75,.45,.57]} c="#9b8e72" />
    <Box p={[-6.55,.93,-6.65]} s={[.66,.36,.56]} c="#b3a17b" />
    <Sign p={[-6.53,1.93,-6.63]} size={[1.05,.24]} texture={signTexture('こはる小路','#456b6a','#d0d2b3')} />
    <pointLight position={[-6.6,1.8,-3]} color="#82b6c3" intensity={4} distance={5} />
  </group>
}

function Guardrail() {
  return <group name="corner-guardrails">
    {[[-6.18,3.08],[-3.15,3.08],[1.45,3.08],[3.78,3.08]].map(([x,z],i)=><group key={i}>
      <Pipe a={[x,.3,z]} b={[x,1.05,z]} radius={.043} color="#b7c7b7" />
      <Cylinder p={[x,.32,z]} radius={.075} height={.15} c="#809d93" />
    </group>)}
    <Pipe a={[-6.18,.95,3.08]} b={[-3.15,.95,3.08]} radius={.04} color="#acc6b5" />
    <Pipe a={[-6.18,.58,3.08]} b={[-3.15,.58,3.08]} radius={.027} color="#809e98" />
    <Pipe a={[1.45,.95,3.08]} b={[3.78,.95,3.08]} radius={.04} color="#acc6b5" />
    <Pipe a={[1.45,.58,3.08]} b={[3.78,.58,3.08]} radius={.027} color="#809e98" />
    <Pipe a={[3.78,.95,3.08]} b={[4.57,.95,2.28]} radius={.04} color="#acc6b5" />
    <Pipe a={[4.57,.3,2.28]} b={[4.57,.95,2.28]} radius={.043} color="#b7c7b7" />
  </group>
}

export function Neighborhood() {
  return <group name="japanese-street-details">
    <Alley /><Bicycle /><StreetLamp /><UtilityPoles /><TrafficSignal /><Guardrail />
    <AirConditioner p={[-4.92,4.07,-4.95]} />
    <AirConditioner p={[2.83,4.07,-4.95]} rotation={Math.PI/2} />
    <Cylinder p={[-4.2,4.4,-4.94]} radius={.18} height={.6} c="#a4b5a4" />
    <Cylinder p={[-4.2,4.72,-4.94]} radius={.25} height={.07} c="#5b7d77" />
    <group position={[4.65,.24,-.6]} rotation={[0,Math.PI/2,0]}>
      <Box p={[0,1.26,0]} s={[1.2,1.46,.13]} c="#5c7b70" />
      <Sign p={[0,1.26,.075]} size={[1.08,1.31]} texture={foodTexture('notice')} />
      <Pipe a={[-.43,0,0]} b={[-.43,1.3,0]} /><Pipe a={[.43,0,0]} b={[.43,1.3,0]} />
      <Box p={[0,2.05,0]} s={[1.4,.08,.42]} c="#7fa193" />
    </group>
    <group position={[4.62,.25,-5.6]}>
      <Pipe a={[0,0,0]} b={[0,2.8,0]} radius={.035} color="#9db4af" />
      <Box p={[0,2.65,0]} s={[1.65,.32,.08]} c="#5d92a0" />
      <Sign p={[0,2.65,.048]} size={[1.59,.27]} texture={signTexture('小春通り →','#517d91','#e1e9d6')} />
      <mesh position={[0,2.06,.03]} rotation={[0,0,Math.PI]}><circleGeometry args={[.36,3]} /><meshBasicMaterial color="#d8c8ac" side={THREE.DoubleSide} /></mesh>
      <mesh position={[0,2.06,.04]} rotation={[0,0,Math.PI]}><circleGeometry args={[.3,3]} /><meshBasicMaterial color="#b76a60" side={THREE.DoubleSide} /></mesh>
      <Sign p={[0,2.11,.052]} size={[.37,.11]} texture={signTexture('止まれ','#b76a60','#fff1d7')} />
    </group>
    <group position={[-5.9,.25,-6.4]}>
      <Cylinder p={[0,.2,0]} radius={.22} height={.36} c="#a98670" />
      {[0,1,2,3,4].map(i=><mesh key={i} position={[(i%2)*.2-.1,.48+i*.055,Math.sin(i)*.13]} rotation={[0,i,0]}><sphereGeometry args={[.22,5,4]} /><meshToonMaterial color={i%2?'#749b80':'#91a883'} /></mesh>)}
    </group>
  </group>
}
