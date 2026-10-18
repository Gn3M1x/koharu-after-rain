import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Batch, Box, Cylinder, Glass, Pipe, Sign, type Part } from './Primitives'
import { foodTexture, koharuTexture, random, signTexture, vendingTexture } from './materials'

const cream = '#e1d8bf', metal = '#5e817e'

function Interior() {
  const { shelves, goods, labels, floor } = useMemo(() => {
    const shelves: Part[] = [], goods: Part[] = [], labels: Part[] = [], floor: Part[] = []
    const rng = random(573), colors = ['#dca46d','#c76858','#82a7a0','#a5ae71','#e8ce9b','#8a9aab','#ebc2a6','#728b6a']
    for(let x=-4.3;x<4.4;x+=.72) for(let z=-3.1;z<3.15;z+=.72) floor.push({p:[x,.075,z],s:[.704,.018,.704],c:(Math.round((x+4.3)/.72)+Math.round((z+3.1)/.72))%2?'#ded1b3':'#e8dcc2'})
    for (const [x,z,w] of [[-1.95,-.65,2.5],[.95,-1.1,2.15]] as const) {
      shelves.push({p:[x,.85,z],s:[w,1.5,.12],c:'#9aab9c'})
      for(let tier=0;tier<4;tier++){
        const y=.24+tier*.39
        shelves.push({p:[x,y,z+.08],s:[w+.12,.055,.83],c:cream})
        labels.push({p:[x,y+.005,z+.51],s:[w+.1,.085,.035],c:tier%2?'#d1a96a':'#73a29a'})
        for(let i=0;i<11;i++)for(let d=0;d<2;d++){
          const h=.18+rng()*.12, px=x-w/2+.13+i*(w-.2)/11
          goods.push({p:[px,y+h/2+.028,z+.33-d*.28],s:[.14,h,.19],c:colors[(tier*3+i+d)%colors.length]})
          labels.push({p:[px,y+h*.55,z+.431-d*.28],s:[.11,.052,.004],c:'#fbf0d9'})
          if(d===0)labels.push({p:[px,y-.005,z+.532],s:[.12,.032,.005],c:'#ffefcc'})
        }
      }
      shelves.push({p:[x,1.86,z],s:[w,.3,.05],c:'#ebdcbb'})
    }
    // Back-wall refrigerator: individual bottles, rails, and three glazed doors.
    for(let i=0;i<3;i++){
      const x=-2.7+i*1.28
      shelves.push({p:[x,1.33,-2.76],s:[1.23,2.5,.62],c:'#769b97'})
      shelves.push({p:[x,1.35,-2.427],s:[1.08,2.15,.035],c:'#395b60'})
      for(let t=0;t<5;t++){
        shelves.push({p:[x,.38+t*.39,-2.31],s:[1.1,.035,.3],c:'#bcd9d0'})
        for(let j=0;j<7;j++){
          goods.push({p:[x-.45+j*.15,.54+t*.39,-2.32],s:[.105,.25,.13],c:colors[(j+t)%8]})
          goods.push({p:[x-.45+j*.15,.69+t*.39,-2.32],s:[.065,.06,.1],c:'#e7e4cd'})
          labels.push({p:[x-.45+j*.15,.55+t*.39,-2.245],s:[.1,.08,.005],c:'#efe3c3'})
        }
      }
    }
    // Chilled bento / onigiri case by the right-hand window.
    shelves.push({p:[3.3,.56,.55],s:[1.25,.95,2.5],c:'#b6c3ac'})
    for(let tier=0;tier<3;tier++){
      const y=.45+tier*.34
      shelves.push({p:[3.25,y,.55],s:[1.27,.045,2.5],c:'#d7dbbe'})
      for(let j=0;j<7;j++){
        goods.push({p:[3.14,y+.08,-.46+j*.33],s:[.66,.12,.25],c:'#354c4a'})
        goods.push({p:[3.14,y+.15,-.46+j*.33],s:[.57,.04,.21],c:j%2?'#e4c498':'#f2e5be'})
        labels.push({p:[3.9,y,-.46+j*.33],s:[.015,.075,.15],c:'#f9edc9'})
      }
    }
    return { shelves, goods, labels, floor }
  }, [])
  return <group name="fully-stocked-interior">
    <Batch parts={floor} />
    <Batch parts={shelves} outline /><Batch parts={goods} outline /><Batch parts={labels} />
    {[-2.7,-1.42,-.14].map(x=><group key={x}>
      <Glass p={[x,1.35,-2.2]} size={[1.13,2.13]} opacity={.08} />
      <Box p={[x+.51,1.33,-2.18]} s={[.025,2.22,.04]} c="#cbdccf" outline={false} />
      <Box p={[x+.4,1.28,-2.12]} s={[.035,.42,.06]} c="#dbdfc8" />
      <Box p={[x,2.53,-2.18]} s={[1.12,.08,.025]} c="#dff9df" glow="#d1f9d9" intensity={1.4} outline={false} />
    </group>)}
    <Sign p={[-1.4,2.75,-2.35]} size={[3.7,.26]} texture={signTexture('冷たい飲みもの', '#75998a','#f7efce')} />
    <Sign p={[-1.95,1.86,-.605]} size={[2.3,.25]} texture={signTexture('お菓子・おやつ','#ead9b3','#776c50')} />
    <Sign p={[.95,1.86,-1.055]} size={[2,.25]} texture={signTexture('毎日の、おいしい。','#ead9b3','#776c50')} />
    <Sign p={[3.92,1.72,.55]} rotation={[0,Math.PI/2,0]} size={[2.5,.33]} texture={signTexture('お弁当・おむすび','#d2d7b3','#59775f')} />
    {/* Rice triangles in the front chilled display. */}
    {Array.from({length:8},(_,i)=><group key={i} position={[2.82+(i%2)*.45,1.35,-.4+Math.floor(i/2)*.47]}>
      <mesh rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.145,.145,.12,3]} /><meshToonMaterial color="#f5ebcf" /></mesh>
      <Box p={[0,-.04,.1]} s={[.08,.13,.045]} c="#304c40" outline={false} />
    </group>)}
    {/* Checkout, terminal, coffee machine, and a glass hot-food/oden case. */}
    <Box p={[-3.05,.62,1.8]} s={[2.4,1.1,.9]} c="#b4b59d" />
    <Box p={[-3.05,1.2,1.8]} s={[2.6,.12,1.04]} c="#e4d7b8" />
    <Box p={[-2.64,1.5,1.79]} s={[.55,.41,.14]} c="#30484c" rotation={[-.15,0,0]} />
    <Box p={[-2.64,1.52,1.875]} s={[.45,.29,.012]} c="#aacdc1" glow="#82a5a0" intensity={.2} rotation={[-.15,0,0]} />
    <Box p={[-2.64,1.29,2]} s={[.6,.065,.32]} c="#516b6a" />
    <Box p={[-3.9,1.52,1.71]} s={[.47,.58,.48]} c="#536569" />
    <Box p={[-3.9,1.58,1.96]} s={[.32,.37,.02]} c="#243b40" />
    <Box p={[-3.9,1.67,1.982]} s={[.21,.12,.01]} c="#bdd5bc" glow="#bad9be" intensity={.4} outline={false} />
    <Cylinder p={[-3.9,1.32,1.98]} radius={.065} height={.13} c="#f1dec0" />
    <Cylinder p={[-3.98,1.94,1.65]} radius={.115} height={.25} c="#887957" />
    <Box p={[-1.95,1.32,1.72]} s={[.68,.14,.66]} c="#a5b8b0" />
    <Glass p={[-1.95,1.61,2.06]} size={[.69,.5]} opacity={.15} />
    <Glass p={[-1.59,1.61,1.72]} rotation={[0,Math.PI/2,0]} size={[.69,.5]} opacity={.15} />
    <Box p={[-1.95,1.91,1.72]} s={[.75,.07,.75]} c="#d4c6a4" />
    {[0,1,2].map(i=><Cylinder key={i} p={[-2.15+i*.2,1.45,1.85]} radius={.075} height={.1} c={i%2?'#c69f68':'#e4ce9d'} />)}
    <Sign p={[-1.95,1.4,2.105]} size={[.61,.14]} texture={signTexture('おでん','#e5c99d','#806344')} />
    {/* Magazine rack in front, ice cream chest, and a back-room door. */}
    <Box p={[-.45,.47,2.42]} s={[1.7,.8,.42]} c="#6a8d7f" />
    {[0,1,2,3,4].map(i=><group key={i} position={[-1.1+i*.32,.9,2.42]} rotation={[-.19,0,0]}>
      <Box p={[0,0,0]} s={[.29,.43,.04]} c="#e6d5b5" />
      <Sign p={[0,0,.027]} size={[.28,.4]} texture={foodTexture('magazine')} />
    </group>)}
    <Box p={[1.38,.56,1.95]} s={[1.1,.91,.83]} c="#b5d0c2" />
    <Glass p={[1.38,1.04,1.95]} rotation={[-Math.PI/2,0,0]} size={[.96,.66]} opacity={.2} />
    <Box p={[1.38,1.05,1.95]} s={[.04,.025,.78]} c="#edf1da" />
    <Sign p={[1.38,.65,2.38]} size={[.97,.3]} texture={signTexture('ICE CREAM','#bed3c2','#3c8078')} />
    <Box p={[3.1,1.3,-3.08]} s={[1.3,2.45,.06]} c="#99a89a" />
    <Box p={[3.55,1.3,-3.025]} s={[.05,.12,.05]} c="#e2d9b8" />
    <Sign p={[3.1,2.16,-3.025]} size={[.78,.2]} texture={signTexture('STAFF ONLY','#aabaac','#48655c')} />
    <Sign p={[1.39,2.13,-3.025]} size={[1.2,1.52]} texture={foodTexture('onigiri')} />
    <Sign p={[-3.95,2.03,-3.01]} size={[.65,1.05]} texture={foodTexture('coffee')} />
    <Sign p={[0,2.76,1.25]} size={[2.4,.4]} texture={signTexture('ほっとする、いつもの場所。','#ead8ac','#6d8e73')} />
    {[-1.4,1.1].map(x=><group key={x}>
      <Box p={[x,2.99,-.6]} s={[.24,.065,3.9]} c="#fff0c3" glow="#ffe2a3" intensity={.8} outline={false} />
      <Pipe a={[x,3.48,-1.8]} b={[x,3,-1.8]} radius={.012} />
    </group>)}
    <Box p={[.2,.089,1.25]} s={[.08,.016,1.7]} c="#cba56a" outline={false} />
    <Box p={[-.4,.089,2.1]} s={[1.27,.016,.08]} c="#cba56a" outline={false} />
    <pointLight position={[-2.7,2.6,.8]} color="#ffd39a" intensity={12} distance={8} decay={2} />
    <pointLight position={[1.4,2.8,-1.2]} color="#ffe0a8" intensity={14} distance={9} decay={2} />
  </group>
}

function SlidingDoors() {
  const left = useRef<THREE.Group>(null!), right = useRef<THREE.Group>(null!), amount = useRef(0)
  useFrame(({clock,gl},dt)=>{
    const cycle = clock.elapsedTime % 19
    const target = cycle > 10 && cycle < 14.2 ? 1 : 0
    amount.current = THREE.MathUtils.damp(amount.current,target,2.6,Math.min(dt,.1))
    left.current.position.x=-amount.current*.67;right.current.position.x=amount.current*.67
    gl.domElement.dataset.door = amount.current.toFixed(3)
  })
  return <group position={[2,0,3.23]} name="animated-automatic-doors">
    {[-1,1].map((s,i)=><group key={s} ref={i===0?left:right}>
      <Glass p={[s*.41,1.48,0]} size={[.8,2.63]} />
      <Box p={[s*.81,1.48,.005]} s={[.045,2.7,.065]} c={metal} />
      <Box p={[s*.02,1.48,.005]} s={[.035,2.7,.065]} c={metal} />
      {[.15,2.81].map(y=><Box key={y} p={[s*.41,y,0]} s={[.82,.045,.07]} c={metal} />)}
      <Box p={[s*.41,1.03,.01]} s={[.8,.055,.025]} c="#eac581" outline={false} />
      <Sign p={[s*.41,1.61,.04]} size={[.47,.13]} texture={signTexture('自動ドア','#ecdfbf','#507269')} />
      <Box p={[s*.09,1.3,.06]} s={[.026,.27,.04]} c="#d8d6be" />
    </group>)}
    <Box p={[0,2.92,0]} s={[1.83,.16,.2]} c="#557d79" />
    <Box p={[0,2.93,.12]} s={[.13,.055,.04]} c="#263f40" />
  </group>
}

function ExteriorProps() {
  return <group>
    <Box p={[2,.11,3.7]} s={[1.9,.045,.81]} c="#41655d" />
    <Sign p={[2,.14,3.7]} rotation={[-Math.PI/2,0,0]} size={[1.65,.63]} texture={signTexture('いらっしゃいませ','#52766a','#e4d4b1')} />
    <group position={[-3.9,0,3.92]}>
      <Box p={[0,1.07,0]} s={[.96,2.07,.76]} c="#b95c58" />
      <Box p={[0,2.14,0]} s={[1.03,.08,.82]} c="#e5c4af" />
      <Sign p={[0,1.1,.389]} size={[.87,1.93]} texture={vendingTexture()} brightness={.95} />
      <pointLight position={[0,1.3,.65]} color="#acd9d1" intensity={2} distance={3} />
    </group>
    <group position={[3.65,0,3.75]}>
      <Box p={[0,.13,0]} s={[.8,.14,.48]} c="#54737a" />
      <Box p={[0,.61,0]} s={[.8,.1,.5]} c="#759496" />
      {[-.32,.32].map(x=><Pipe key={x} a={[x,.13,0]} b={[x,.63,0]} radius={.025} color="#a2b6ae" />)}
      {[-.22,0,.22].map((x,i)=><group key={x}>
        <Pipe a={[x,.15,0]} b={[x,1.24,-.04]} radius={.018} color="#c5d6cc" />
        <mesh position={[x,.67,0]} rotation={[0,0,-.07]}><coneGeometry args={[.1,.86,7]} /><meshToonMaterial color={['#b2cdd0','#e0ba9d','#849b9a'][i]} /></mesh>
        <Pipe a={[x,1.24,-.04]} b={[x+.1,1.32,-.04]} radius={.023} color="#e7dac1" />
      </group>)}
    </group>
    {[0,1].map(i=><group key={i} position={[4.95,0,1.6-i*.8]}>
      <Box p={[0,.51,0]} s={[.64,.91,.64]} c={i?'#8b9d91':'#b0b8a1'} />
      <Box p={[0,.99,0]} s={[.69,.12,.69]} c="#597d77" />
      <Box p={[0,.87,.33]} s={[.32,.13,.014]} c="#263e43" />
      <Sign p={[0,.55,.33]} size={[.38,.22]} texture={signTexture(i?'びん・缶':'もえるゴミ','#c4c8ab','#47665b')} />
    </group>)}
    <group position={[-.9,0,4.1]} rotation={[0,-.12,0]}>
      <Box p={[0,.71,0]} s={[.73,1.2,.07]} c="#567367" />
      <Sign p={[0,.72,.045]} size={[.64,1.04]} texture={foodTexture('coffee')} />
      {[-.3,.3].map(x=><Pipe key={x} a={[x,.04,.32]} b={[x,1.2,0]} radius={.025} />)}
    </group>
  </group>
}

export function ConvenienceStore() {
  const sign = useRef<THREE.MeshBasicMaterial>(null!)
  useFrame(({clock})=>{
    const t=clock.elapsedTime
    const level=1.03+Math.sin(t*1.6)*.018-(Math.sin(t*2.3)> .998?.09:0)
    sign.current.color.setScalar(level)
  })
  return <group position={[-1.2,.24,-2.4]} name="koharu-convenience-store">
    <Box p={[0,.02,0]} s={[9.35,.16,6.6]} c="#b6c0ae" />
    <Box p={[0,1.73,-3.25]} s={[9.35,3.35,.16]} c="#b9c0ab" />
    <Box p={[-4.58,1.73,0]} s={[.18,3.35,6.6]} c="#91a99e" />
    <Box p={[0,.24,3.2]} s={[9.2,.3,.13]} c="#86a597" />
    <Box p={[4.58,.24,0]} s={[.13,.3,6.4]} c="#86a597" />
    {[-4.55,-3.1,-1.55,0,1.13,2.9,4.55].map(x=><Box key={x} p={[x,1.59,3.2]} s={[.055,2.94,.1]} c={metal} />)}
    {[.4,2.94].map(y=><Box key={y} p={[0,y,3.2]} s={[9.2,.065,.11]} c={metal} />)}
    {[-3.82,-2.33,-.77,.58,3.74].map((x,i)=><Glass key={x} p={[x,1.65,3.205]} size={[i===3?1.06:1.46,2.5]} />)}
    {[-3.1,-1.6,0,1.6,3.15].map(z=><Box key={z} p={[4.57,1.61,z]} s={[.1,2.94,.055]} c={metal} />)}
    {[.4,2.94].map(y=><Box key={y} p={[4.57,y,0]} s={[.11,.065,6.4]} c={metal} />)}
    <Glass p={[4.575,1.67,0]} size={[6.3,2.5]} rotation={[0,Math.PI/2,0]} />
    <Box p={[0,1.02,3.225]} s={[9.1,.045,.025]} c="#ddbb79" outline={false} />
    <Box p={[4.6,1.02,0]} s={[.025,.045,6.4]} c="#ddbb79" outline={false} />
    <Interior /><SlidingDoors />
    {/* Solid roof perimeter, with a recessed glazed roof to keep the miniature interior readable. */}
    <Box p={[0,3.72,2.59]} s={[9.7,.2,1.55]} c="#819b91" />
    <Box p={[0,3.72,-2.87]} s={[9.7,.2,1.05]} c="#819b91" />
    {[-4.1,4.1].map(x=><Box key={x} p={[x,3.72,-.25]} s={[1.5,.2,4.4]} c="#819b91" />)}
    <Glass p={[0,3.72,-.25]} size={[6.7,4.3]} rotation={[-Math.PI/2,0,0]} opacity={.12} />
    {[-3.4,0,3.4].map(x=><Box key={x} p={[x,3.75,-.25]} s={[.055,.07,4.35]} c="#577a75" />)}
    {[-2.4,1.9].map(z=><Box key={z} p={[0,3.75,z]} s={[6.85,.07,.055]} c="#577a75" />)}
    <Box p={[0,3.91,-3.35]} s={[9.78,.26,.13]} c="#68887e" />
    {[-4.81,4.81].map(x=><Box key={x} p={[x,3.91,0]} s={[.13,.26,6.8]} c="#68887e" />)}
    <Box p={[0,3.39,3.29]} s={[9.6,.7,.4]} c="#e7e3cb" glow="#e6d2a2" intensity={.25} />
    <mesh position={[0,3.39,3.502]}><planeGeometry args={[9.5,.66]} /><meshBasicMaterial ref={sign} map={koharuTexture()} toneMapped={false} /></mesh>
    <Box p={[4.69,3.39,0]} s={[.31,.7,6.6]} c="#e7e3cb" glow="#e6d2a2" intensity={.2} />
    <Sign p={[4.854,3.39,0]} size={[6.5,.66]} rotation={[0,Math.PI/2,0]} texture={koharuTexture(true)} />
    <Box p={[0,2.99,3.58]} s={[9.8,.12,1.12]} c="#7ca599" />
    <Box p={[0,2.9,4.08]} s={[9.82,.13,.12]} c="#597f79" />
    <Box p={[0,2.89,3.57]} s={[8.9,.04,.09]} c="#ffe2a4" glow="#ffdda0" intensity={2} outline={false} />
    <pointLight position={[0,2.75,4]} color="#ffc17c" intensity={19} distance={9} decay={2} />
    <Sign p={[-3.84,2.02,3.255]} size={[.78,1.05]} texture={foodTexture('bento')} />
    <Sign p={[.48,2.31,3.255]} size={[.71,.89]} texture={foodTexture('onigiri')} />
    <Sign p={[-2.8,2.75,3.265]} size={[1.8,.16]} texture={signTexture('ATM  お酒  たばこ','#e7e0c6','#547d70')} />
    <ExteriorProps />
    <group position={[4.98,2.24,2.46]}>
      <Box p={[0,0,0]} s={[.3,1.1,.71]} c="#477d80" glow="#438b8f" intensity={.35} />
      <Sign p={[.158,0,0]} rotation={[0,Math.PI/2,0]} size={[.64,1.01]} texture={signTexture('ATM','#729b9a','#eaf1d2',true)} brightness={1.13} />
      <Pipe a={[-.4,.42,0]} b={[0,.42,0]} radius={.025} color="#4c6a69" />
      <pointLight position={[.45,.05,.15]} color="#74c3cf" intensity={2.4} distance={3.6} />
    </group>
    <Pipe a={[-4.83,3.8,2.8]} b={[-4.83,.05,2.8]} radius={.055} color="#699185" />
    <Pipe a={[4.86,3.83,-2.9]} b={[4.86,.05,-2.9]} radius={.055} color="#699185" />
  </group>
}
