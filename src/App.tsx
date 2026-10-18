import { Component, Suspense, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { INITIAL_CAMERA } from './config'
import { Scene } from './scene/Scene'

class SceneBoundary extends Component<{ children: ReactNode }, { error: boolean }> {
  state = { error: false }
  static getDerivedStateFromError() { return { error: true } }
  componentDidCatch(error: Error) { console.error('Scene initialization failed:', error) }
  render() {
    return this.state.error ? <p className="webgl-error">无法初始化三维场景，请启用浏览器硬件加速后重新载入。</p> : this.props.children
  }
}

export default function App() {
  return <main className="experience" aria-label="雨宿り · 日式雨夜便利店微缩景观。拖拽旋转，滚轮缩放，右键拖拽平移，双击复位。">
    <SceneBoundary>
      <Canvas orthographic camera={{ position: INITIAL_CAMERA, zoom: 42, near: .1, far: 120 }} dpr={[1, 1.6]} shadows
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: true }}
        fallback={<p className="webgl-error">此三维场景需要支持 WebGL 2 的浏览器。</p>}>
        <Suspense fallback={null}><Scene /></Suspense>
      </Canvas>
    </SceneBoundary>
  </main>
}
