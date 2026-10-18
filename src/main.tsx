import { createRoot } from 'react-dom/client'
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js'
import App from './App'
import './styles.css'

RectAreaLightUniformsLib.init()
createRoot(document.getElementById('root')!).render(<App />)
