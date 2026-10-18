import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { ConvenienceStore } from './ConvenienceStore'
import { Neighborhood } from './Neighborhood'
import { Street } from './Street'
import { Weather } from './Weather'
import { CameraRig } from './CameraRig'

function Diagnostics() {
  const state=useRef({time:0,frames:0})
  useFrame(({gl,clock},delta)=>{
    gl.domElement.dataset.ready='true'
    gl.domElement.dataset.elapsed=clock.elapsedTime.toFixed(2)
    const s=state.current;s.time+=delta;s.frames++
    if(s.time>2){gl.domElement.dataset.fps=String(Math.round(s.frames/s.time));s.time=0;s.frames=0}
  })
  return null
}

export function Scene() {
  const { gl,scene } = useThree()
  useEffect(()=>{
    gl.toneMapping=THREE.ACESFilmicToneMapping;gl.toneMappingExposure=1.06;gl.outputColorSpace=THREE.SRGBColorSpace
    scene.background=new THREE.Color('#222c43')
  },[gl,scene])
  return <>
    <hemisphereLight color="#b8c8e1" groundColor="#566785" intensity={1.0} />
    <ambientLight color="#98aeca" intensity={.2} />
    <directionalLight position={[-5,14,9]} color="#b7cce9" intensity={1.25} castShadow
      shadow-mapSize={[2048,2048]} shadow-camera-left={-13} shadow-camera-right={13} shadow-camera-top={13} shadow-camera-bottom={-13} shadow-camera-near={1} shadow-camera-far={45} shadow-bias={-.0005} shadow-normalBias={.035} shadow-radius={3} />
    <directionalLight position={[9,6,-8]} color="#819cce" intensity={.65} />
    <Street /><ConvenienceStore /><Neighborhood /><Weather /><CameraRig /><Diagnostics />
    <EffectComposer multisampling={2}>
      <Bloom luminanceThreshold={1.4} luminanceSmoothing={.6} intensity={.3} mipmapBlur />
      <Vignette eskil={false} offset={.27} darkness={.24} />
    </EffectComposer>
  </>
}
