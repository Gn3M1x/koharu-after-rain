import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useFBO } from '@react-three/drei'
import * as THREE from 'three'

/** A planar capture using an actual orthographic reflected camera. */
export function WetRoad() {
  const mesh = useRef<THREE.Mesh>(null!)
  const { camera, gl, scene } = useThree()
  const target = useFBO(1024, 1024, { type: THREE.HalfFloatType, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter })
  const reflection = useMemo(() => new THREE.OrthographicCamera(), [])
  const scratch = useMemo(() => ({ direction:new THREE.Vector3(), look:new THREE.Vector3(), matrix:new THREE.Matrix4(), clip:new THREE.Plane(new THREE.Vector3(0,1,0),-.028) }), [])
  const uniforms = useMemo(() => ({
    uReflection:{value:target.texture}, uMatrix:{value:new THREE.Matrix4()}, uTexel:{value:1/1024},
    uBase:{value:new THREE.Color('#293f56')}, uTime:{value:0},
  }), [target])
  useEffect(() => () => target.dispose(), [target])
  useFrame(({clock}) => {
    const road = mesh.current
    if (!road) return
    reflection.copy(camera as THREE.OrthographicCamera)
    camera.getWorldDirection(scratch.direction)
    scratch.look.copy(camera.position).add(scratch.direction)
    reflection.position.y=.05-camera.position.y
    scratch.look.y=.05-scratch.look.y
    reflection.up.set(0,-1,0)
    reflection.lookAt(scratch.look)
    reflection.updateMatrixWorld()
    scratch.matrix.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1)
    scratch.matrix.multiply(reflection.projectionMatrix).multiply(reflection.matrixWorldInverse)
    uniforms.uMatrix.value.copy(scratch.matrix)
    uniforms.uTime.value=clock.elapsedTime
    const previousTarget=gl.getRenderTarget(), clips=gl.clippingPlanes, shadows=gl.shadowMap.autoUpdate, xr=gl.xr.enabled
    const weather=scene.getObjectByName('subtle-rain-animations'), weatherVisible=weather?.visible
    road.visible=false
    if(weather)weather.visible=false
    gl.clippingPlanes=[scratch.clip];gl.shadowMap.autoUpdate=false;gl.xr.enabled=false
    gl.setRenderTarget(target);gl.clear();gl.render(scene,reflection)
    gl.setRenderTarget(previousTarget);gl.clippingPlanes=clips;gl.shadowMap.autoUpdate=shadows;gl.xr.enabled=xr
    road.visible=true
    if(weather)weather.visible=weatherVisible ?? true
  }, -1)
  return <mesh ref={mesh} rotation={[-Math.PI/2,0,0]} position={[0,.025,0]} name="orthographic-wet-road">
    <planeGeometry args={[16,16]} />
    <shaderMaterial uniforms={uniforms} vertexShader={`uniform mat4 uMatrix;varying vec4 vReflect;varying vec2 vUv;
      void main(){vUv=uv;vec4 world=modelMatrix*vec4(position,1.);vReflect=uMatrix*world;gl_Position=projectionMatrix*viewMatrix*world;}`}
      fragmentShader={`uniform sampler2D uReflection;uniform float uTexel;uniform float uTime;uniform vec3 uBase;varying vec4 vReflect;varying vec2 vUv;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      void main(){vec2 p=vReflect.xy/vReflect.w;
        p+=vec2(sin(vUv.y*310.+sin(vUv.x*79.)+uTime*.08)*.00065,cos(vUv.x*250.)*.00035);
        vec3 capture=texture2D(uReflection,p).rgb*.28;
        for(int i=1;i<=3;i++){float n=float(i);capture+=(texture2D(uReflection,p+vec2(n*uTexel*1.5,n*uTexel*2.)).rgb+texture2D(uReflection,p-vec2(n*uTexel*1.5,n*uTexel*2.)).rgb)*.12;}
        float grain=hash(floor(vUv*1500.));float wet=.27+.13*sin(vUv.x*17.+sin(vUv.y*13.));
        vec3 color=uBase*(.8+grain*.13)+capture*wet;
        gl_FragColor=vec4(color,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`} />
  </mesh>
}
