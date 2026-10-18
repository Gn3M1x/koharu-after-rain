import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { random } from './materials'

const vertex = `varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`

function Rain({drips=false}: {drips?:boolean}) {
  const material = useRef<THREE.ShaderMaterial>(null!), count=drips?100:2400
  const geometry=useMemo(()=>{
    const g=new THREE.PlaneGeometry(drips?.011:.012,drips?.09:.2),seeds=new Float32Array(count*4),rng=random(drips?27:98)
    for(let i=0;i<count;i++)seeds.set([rng(),rng(),rng(),rng()],i*4)
    g.setAttribute('aSeed',new THREE.InstancedBufferAttribute(seeds,4));return g
  },[count,drips])
  const uniforms=useMemo(()=>({uTime:{value:0}}),[])
  useFrame(({clock})=>{ material.current.uniforms.uTime.value=clock.elapsedTime })
  return <instancedMesh args={[geometry,undefined,count]} frustumCulled={false} name={drips?'eaves-drips':'continuous-rain'}>
    <shaderMaterial ref={material} transparent depthWrite={false} side={THREE.DoubleSide} uniforms={uniforms}
      vertexShader={`attribute vec4 aSeed;uniform float uTime;varying float vAlpha;
      void main(){float speed=${drips?'1.5':'1.1'}+aSeed.w*.6;float phase=fract(aSeed.z-uTime*speed*.5);
      vec3 p;${drips?`p=vec3(-5.9+aSeed.x*9.4,.26+phase*2.8,1.69);`:`p=vec3(-7.85+fract(aSeed.x+uTime*.007)*15.7,.05+phase*9.,-7.85+aSeed.y*15.7);
      if(p.x> -5.85 && p.x<3.65 && p.z> -5.85 && p.z<1.1 && p.y<4.05) p.y=4.05+phase*4.;`}
      p+=vec3(position.x+position.y*.16,position.y,0.);vAlpha=.09+aSeed.w*.17;
      gl_Position=projectionMatrix*viewMatrix*vec4(p,1.);}`}
      fragmentShader="varying float vAlpha;void main(){gl_FragColor=vec4(.62,.77,.87,vAlpha);}" />
  </instancedMesh>
}

function Ripples() {
  const material=useRef<THREE.ShaderMaterial>(null!), count=75
  const geometry=useMemo(()=>{
    const g=new THREE.PlaneGeometry(1,1), seeds=new Float32Array(count*4),rng=random(936)
    for(let i=0;i<count;i++){
      let x=rng()*15.2-7.6,z=rng()*15.2-7.6
      if(x<5.25&&z<3.55){z=3.7+rng()*3.9}
      seeds.set([x,z,rng(),.4+rng()*.6],i*4)
    }
    g.setAttribute('aSeed',new THREE.InstancedBufferAttribute(seeds,4));return g
  },[])
  const uniforms=useMemo(()=>({uTime:{value:0}}),[])
  useFrame(({clock})=>{material.current.uniforms.uTime.value=clock.elapsedTime})
  return <instancedMesh args={[geometry,undefined,count]} frustumCulled={false} name="puddle-ripples">
    <shaderMaterial ref={material} transparent depthWrite={false} uniforms={uniforms} side={THREE.DoubleSide}
      vertexShader={`attribute vec4 aSeed;uniform float uTime;varying vec2 vUv;varying float vAge;
      void main(){vUv=uv;vAge=fract(uTime*.63+aSeed.z);float scale=(.08+vAge*.7)*aSeed.w;
      vec3 p=vec3(aSeed.x+position.x*scale,.071,aSeed.y+position.y*scale);
      gl_Position=projectionMatrix*viewMatrix*vec4(p,1.);}`}
      fragmentShader={`varying vec2 vUv;varying float vAge;
      void main(){float r=length(vUv-.5);float ring=1.-smoothstep(.007,.02,abs(r-.39));float ring2=1.-smoothstep(.006,.016,abs(r-.26));float fade=sin(vAge*3.14159)*.42;
      gl_FragColor=vec4(.59,.8,.84,(ring+ring2*.4)*fade);}`} />
  </instancedMesh>
}

function GlassRain({side=false}: {side?:boolean}) {
  const material=useRef<THREE.ShaderMaterial>(null!)
  const uniforms=useMemo(()=>({uTime:{value:0}}),[])
  useFrame(({clock})=>{material.current.uniforms.uTime.value=clock.elapsedTime})
  return <mesh position={side?[3.4,1.93,-2.4]:[-1.2,1.94,.845]} rotation={side?[0,Math.PI/2,0]:[0,0,0]} name="glass-water-trails">
    <planeGeometry args={[side?6.25:9.07,2.45]} />
    <shaderMaterial ref={material} uniforms={uniforms} transparent depthWrite={false} side={THREE.DoubleSide} vertexShader={vertex}
      fragmentShader={`varying vec2 vUv;uniform float uTime;
      float hash(float n){return fract(sin(n*127.1)*43758.5453);}
      void main(){float id=floor(vUv.x*79.);float line=abs(fract(vUv.x*79.)-.5-sin(vUv.y*21.+id)*.045);
      float drop=fract(vUv.y*.9+uTime*(.035+hash(id)*.04)+hash(id)*9.);
      float trail=(1.-smoothstep(.005,.026,line))*(1.-smoothstep(.0,.16,drop));
      float bead=(1.-smoothstep(.015,.07,length(vec2(line*.8,drop))));
      gl_FragColor=vec4(.73,.91,.9,trail*.16+bead*.23);}`} />
  </mesh>
}

function LightPools() {
  return <group name="soft-neon-on-wet-asphalt">
    {([{p:[-1,.075,4.8],s:[8,5],c:[.9,.55,.23],o:.3},{p:[5.7,.078,1.6],s:[3.2,5.7],c:[.3,.65,.73],o:.2},{p:[-5.2,.079,3.8],s:[2,3.7],c:[.7,.28,.22],o:.1}] as const).map((v,i)=><mesh key={i} position={[...v.p]} rotation={[-Math.PI/2,0,0]}>
      <planeGeometry args={[...v.s]} /><shaderMaterial transparent depthWrite={false} blending={THREE.AdditiveBlending} uniforms={{uColor:{value:new THREE.Color(...v.c)},uOpacity:{value:v.o}}} vertexShader={vertex}
        fragmentShader={`varying vec2 vUv;uniform vec3 uColor;uniform float uOpacity;void main(){vec2 p=(vUv-.5)*2.;float mask=pow(max(0.,1.-dot(p,p)),2.);float wave=.7+.3*sin(vUv.y*220.+sin(vUv.x*34.)*2.);gl_FragColor=vec4(uColor,mask*wave*uOpacity);}`} />
    </mesh>)}
  </group>
}

export function Weather() {
  return <group name="subtle-rain-animations"><Rain /><Rain drips /><Ripples /><GlassRain /><GlassRain side /><LightPools /></group>
}
