import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import * as THREE from 'three'
import { INITIAL_CAMERA, INITIAL_TARGET } from '../config'

export function CameraRig() {
  const controls = useRef<OrbitControlsImpl>(null!)
  const { camera, gl, size } = useThree()
  const fittedZoom = Math.min(size.width / 25.5, size.height / 21)
  useEffect(() => {
    const cam = camera as THREE.OrthographicCamera
    cam.zoom = fittedZoom; cam.updateProjectionMatrix()
  }, [camera, fittedZoom])
  useEffect(() => {
    const reset = () => {
      const ctrl = controls.current
      if (!ctrl) return
      ctrl.enableDamping = false; ctrl.update()
      camera.position.set(...INITIAL_CAMERA); ctrl.target.set(...INITIAL_TARGET)
      const cam = camera as THREE.OrthographicCamera; cam.zoom = fittedZoom; cam.updateProjectionMatrix()
      ctrl.update(); ctrl.enableDamping = true
    }
    gl.domElement.addEventListener('dblclick', reset)
    return () => gl.domElement.removeEventListener('dblclick', reset)
  }, [camera, gl, fittedZoom])
  useFrame(() => {
    if (controls.current) {
      const target = controls.current.target
      target.x = THREE.MathUtils.clamp(target.x, -5, 5); target.y = THREE.MathUtils.clamp(target.y, 0, 5); target.z = THREE.MathUtils.clamp(target.z, -5, 5)
    }
    gl.domElement.dataset.camera = camera.position.toArray().map(v => v.toFixed(3)).join(',')
    gl.domElement.dataset.zoom = camera.zoom.toFixed(3)
  })
  return <OrbitControls ref={controls} target={INITIAL_TARGET} enableDamping dampingFactor={.065} rotateSpeed={.55} zoomSpeed={.65} panSpeed={.7}
    minZoom={fittedZoom * .65} maxZoom={fittedZoom * 3.5} minPolarAngle={.15} maxPolarAngle={Math.PI / 2 - .045} makeDefault />
}
