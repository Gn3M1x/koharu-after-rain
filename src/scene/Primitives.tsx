import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

export type V3 = [number, number, number]
export type Part = { p: V3; s: V3; c?: string; r?: V3 }
const ramp = new THREE.DataTexture(new Uint8Array([90, 151, 204, 255]), 4, 1, THREE.RedFormat)
ramp.minFilter = ramp.magFilter = THREE.NearestFilter; ramp.needsUpdate = true
const edgeColor = '#1c2a3c'

export function Box({ p, s, c = '#7d9296', glow, intensity = 1, outline = true, roughness: _r, metalness: _m, ...props }: {
  p: V3; s: V3; c?: string; roughness?: number; metalness?: number; glow?: string; intensity?: number; outline?: boolean;
  rotation?: V3; castShadow?: boolean; receiveShadow?: boolean
}) {
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(...s)), [s[0], s[1], s[2]])
  return <group position={p} rotation={props.rotation}>
    <mesh castShadow={props.castShadow ?? true} receiveShadow={props.receiveShadow ?? true}>
      <boxGeometry args={s} /><meshToonMaterial color={c} gradientMap={ramp} emissive={glow} emissiveIntensity={intensity} />
    </mesh>
    {outline && <lineSegments geometry={edges}><lineBasicMaterial color={edgeColor} transparent opacity={.68} /></lineSegments>}
  </group>
}

export function Batch({ parts, roughness: _r, metalness: _m, emissive = false, outline = false }: { parts: Part[]; roughness?: number; metalness?: number; emissive?: boolean; outline?: boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const edgeGeometry = useMemo(() => {
    if (!outline) return undefined
    const template = new THREE.EdgesGeometry(new THREE.BoxGeometry()).getAttribute('position')
    const positions: number[] = [], vector = new THREE.Vector3(), matrix = new THREE.Matrix4(), quaternion = new THREE.Quaternion()
    for (const part of parts) {
      quaternion.setFromEuler(new THREE.Euler(...(part.r ?? [0, 0, 0])))
      matrix.compose(new THREE.Vector3(...part.p), quaternion, new THREE.Vector3(...part.s))
      for (let i = 0; i < template.count; i++) { vector.fromBufferAttribute(template, i).applyMatrix4(matrix); positions.push(...vector.toArray()) }
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); return g
  }, [parts, outline])
  useLayoutEffect(() => {
    parts.forEach((part, i) => {
      dummy.position.set(...part.p); dummy.scale.set(...part.s); dummy.rotation.set(...(part.r ?? [0, 0, 0])); dummy.updateMatrix()
      ref.current.setMatrixAt(i, dummy.matrix); ref.current.setColorAt(i, new THREE.Color(part.c ?? '#b6c6c1'))
    })
    ref.current.instanceMatrix.needsUpdate = true
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true
    ref.current.computeBoundingSphere()
  }, [parts, dummy])
  return <>
    <instancedMesh ref={ref} args={[undefined, undefined, parts.length]} castShadow={!emissive} receiveShadow>
      <boxGeometry />{emissive ? <meshBasicMaterial toneMapped={false} /> : <meshToonMaterial gradientMap={ramp} />}
    </instancedMesh>
    {edgeGeometry && <lineSegments geometry={edgeGeometry}><lineBasicMaterial color={edgeColor} transparent opacity={.5} /></lineSegments>}
  </>
}

export function Sign({ texture, p, size, rotation = [0, 0, 0], brightness = 1 }: { texture: THREE.Texture; p: V3; size: [number, number]; rotation?: V3; brightness?: number }) {
  return <mesh position={p} rotation={rotation}>
    <planeGeometry args={size} /><meshBasicMaterial map={texture} color={new THREE.Color().setScalar(brightness)} toneMapped={false} side={THREE.DoubleSide} />
  </mesh>
}

export function Pipe({ a, b, radius = .035, color = '#435364' }: { a: V3; b: V3; radius?: number; color?: string }) {
  const { center, quaternion, length } = useMemo(() => {
    const start = new THREE.Vector3(...a), end = new THREE.Vector3(...b), direction = end.clone().sub(start)
    return { center: start.add(end).multiplyScalar(.5), quaternion: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize()), length: direction.length() }
  }, [a.toString(), b.toString()])
  return <mesh position={center} quaternion={quaternion} castShadow><cylinderGeometry args={[radius, radius, length, 8]} /><meshToonMaterial color={color} gradientMap={ramp} /></mesh>
}

export function Glass({ p, size, rotation = [0, 0, 0], opacity = .09 }: { p: V3; size: [number, number]; rotation?: V3; opacity?: number }) {
  return <mesh position={p} rotation={rotation}><planeGeometry args={size} /><meshPhysicalMaterial color="#9ed8df" transparent opacity={opacity} roughness={.18} metalness={.15} side={THREE.DoubleSide} depthWrite={false} /></mesh>
}

export function Cylinder({ p, radius, height, c = '#74888e', rotation = [0, 0, 0] }: { p: V3; radius: number; height: number; c?: string; rotation?: V3 }) {
  return <mesh position={p} rotation={rotation} castShadow receiveShadow><cylinderGeometry args={[radius, radius, height, 16]} /><meshToonMaterial color={c} gradientMap={ramp} /></mesh>
}
