import * as THREE from 'three'

export function random(seed: number) {
  let s = seed >>> 0
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 }
}

const cache = new Map<string, THREE.CanvasTexture>()
function canvasTexture(key: string, w: number, h: number, paint: (c: CanvasRenderingContext2D) => void) {
  if (cache.has(key)) return cache.get(key)!
  const canvas = document.createElement('canvas')
  canvas.width = w; canvas.height = h
  paint(canvas.getContext('2d')!)
  const t = new THREE.CanvasTexture(canvas)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  cache.set(key, t)
  return t
}

export function signTexture(text: string, bg = '#17212a', color = '#efede0', vertical = false) {
  return canvasTexture(`sign-${text}-${bg}-${color}-${vertical}`, vertical ? 192 : 1024, vertical ? 1024 : 256, c => {
    const w = c.canvas.width, h = c.canvas.height
    c.fillStyle = bg; c.fillRect(0, 0, w, h)
    c.strokeStyle = color; c.globalAlpha = .3; c.lineWidth = 6; c.strokeRect(12, 12, w - 24, h - 24); c.globalAlpha = 1
    c.fillStyle = color; c.textAlign = 'center'; c.textBaseline = 'middle'
    if (vertical) {
      c.font = '600 115px "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif'
      Array.from(text).forEach((s, i, a) => c.fillText(s, w / 2, h * (.12 + i * .76 / Math.max(a.length - 1, 1))))
    } else {
      c.font = `600 ${text.length > 13 ? 65 : 106}px "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif`
      c.fillText(text, w / 2, h / 2 + 4, w - 60)
    }
  })
}

export function vendingTexture() {
  return canvasTexture('vending', 512, 768, c => {
    c.fillStyle = '#e3e5d9'; c.fillRect(0, 0, 512, 768)
    c.fillStyle = '#d92527'; c.fillRect(0, 0, 512, 90)
    c.fillStyle = '#fff8e3'; c.font = 'italic bold 43px Arial'; c.textAlign = 'center'; c.fillText('Refresh. TOKYO', 256, 60)
    c.fillStyle = '#e6f2e8'; c.fillRect(25, 105, 462, 410)
    const colors = ['#cf3f32', '#578989', '#c5a15a', '#a9c79b', '#213c68', '#d9d8c4']
    for (let j = 0; j < 3; j++) for (let i = 0; i < 6; i++) {
      const x = 43 + i * 76, y = 130 + j * 132
      c.fillStyle = colors[(i + j * 2) % 6]; c.fillRect(x, y, 43, 75)
      c.fillStyle = '#f1f1da'; c.fillRect(x + 3, y + 27, 37, 25)
      c.fillStyle = '#a9d7ba'; c.fillRect(x + 3, y + 91, 38, 8)
    }
    c.fillStyle = '#1d2529'; c.fillRect(63, 599, 295, 85); c.fillRect(396, 553, 55, 61)
    c.fillStyle = '#b82729'; c.font = 'bold 30px Arial'; c.fillText('COLD DRINKS', 237, 563)
  })
}

export function koharuTexture(side = false) {
  return canvasTexture(`koharu-${side}`, 1536, 256, c => {
    c.fillStyle = '#f4efdc'; c.fillRect(0, 0, 1536, 256)
    c.fillStyle = '#377d74'; c.fillRect(0, 0, 1536, 20); c.fillRect(0, 216, 1536, 23)
    c.fillStyle = '#ec916b'; c.fillRect(0, 241, 1536, 15)
    c.fillStyle = '#e9a457'; c.beginPath(); c.arc(157, 116, 56, 0, Math.PI * 2); c.fill()
    c.strokeStyle = '#e9a457'; c.lineWidth = 6
    for (let i=0;i<12;i++) { const a=i*Math.PI/6; c.beginPath(); c.moveTo(157+Math.cos(a)*69,116+Math.sin(a)*69); c.lineTo(157+Math.cos(a)*83,116+Math.sin(a)*83); c.stroke() }
    c.fillStyle = '#386e66'; c.textBaseline = 'middle'; c.textAlign = 'left'; c.font = 'bold 138px "Hiragino Maru Gothic ProN", "Yu Gothic", sans-serif'; c.fillText('こはる', 292, 107)
    c.font = '500 32px Arial'; c.fillText('K O H A R U   M A R T', 312, 188)
    c.textAlign = 'center'; c.font = 'bold 73px Arial'; c.fillText('24', 1312, 107)
    c.font = '23px Arial'; c.fillText('OPEN EVERY DAY', 1312, 169)
    c.fillStyle = '#d9d0b7'; c.fillRect(1130, 56, 2, 135)
  })
}

export function foodTexture(kind: 'bento' | 'onigiri' | 'magazine' | 'notice' | 'coffee') {
  return canvasTexture(`food-${kind}`, 512, 640, c => {
    c.fillStyle = '#f4ecd5'; c.fillRect(0, 0, 512, 640)
    c.fillStyle = kind === 'notice' ? '#5c7d7a' : '#dc8663'; c.fillRect(0,0,512,112)
    c.textAlign = 'center'; c.fillStyle='#fff5de'; c.font='bold 46px "Hiragino Kaku Gothic ProN", sans-serif'
    c.fillText({bento:'手づくり弁当',onigiri:'おむすび日和',magazine:'暮らしの手帖',notice:'まちの掲示板',coffee:'一杯の、ぬくもり。'}[kind],256,73,470)
    if (kind === 'onigiri') {
      c.fillStyle='#47675c'; c.beginPath(); c.moveTo(256,170); c.lineTo(434,448); c.lineTo(78,448); c.closePath(); c.fill()
      c.fillStyle='#fffbed'; c.beginPath(); c.moveTo(256,192); c.quadraticCurveTo(280,188,406,427); c.lineTo(108,427); c.closePath(); c.fill()
      c.fillStyle='#2a4544'; c.fillRect(206,335,100,105)
    } else if (kind === 'bento') {
      c.fillStyle='#303f45'; c.fillRect(67,177,378,291); c.fillStyle='#e8ddbb'; c.fillRect(82,192,180,260)
      for(let i=0;i<6;i++){ c.fillStyle=i%2?'#bf7051':'#8d9a5b'; c.beginPath(); c.arc(352+(i%2)*24,230+i*35,29,0,7); c.fill() }
    } else if (kind === 'notice') {
      const rng=random(58)
      for (let i=0;i<6;i++){const x=28+(i%2)*240,y=140+Math.floor(i/2)*148;c.fillStyle=['#e3bf9f','#f7f2d5','#bfcfcb'][i%3];c.fillRect(x,y,211,125); c.fillStyle='#75868b'; for(let n=0;n<5;n++)c.fillRect(x+15,y+20+n*17,90+rng()*85,4);c.fillStyle='#ca795f';c.beginPath();c.arc(x+105,y+7,5,0,7);c.fill()}
    } else if (kind === 'coffee') {
      c.fillStyle='#cdb28c'; c.beginPath();c.ellipse(255,442,157,24,0,0,7);c.fill();c.fillStyle='#fffef1';c.fillRect(143,220,222,199);c.beginPath();c.ellipse(254,414,111,23,0,0,7);c.fill();c.strokeStyle='#fffef1';c.lineWidth=22;c.beginPath();c.arc(369,293,44,-1.5,1.5);c.stroke();c.fillStyle='#6c4e3d';c.beginPath();c.ellipse(254,222,106,25,0,0,7);c.fill(); c.strokeStyle='#b9a88b';c.lineWidth=7;for(let i=0;i<3;i++){c.beginPath();c.moveTo(209+i*43,177);c.bezierCurveTo(180+i*43,149,241+i*43,144,221+i*43,122);c.stroke()}
    } else {
      c.fillStyle='#99b8ad'; c.fillRect(38,144,436,332);c.fillStyle='#e5ba84';c.beginPath();c.arc(300,255,90,0,7);c.fill();c.fillStyle='#708f84';for(let i=0;i<7;i++)c.fillRect(40+i*65,330-i%3*32,52,145+i%3*32)
    }
    if (kind !== 'notice') {c.fillStyle='#4f6d64';c.font='26px sans-serif';c.fillText('ほっとする、いつもの味。',256,533);c.fillStyle='#c67550';c.font='bold 42px Arial';c.fillText(kind==='coffee'?'¥ 120':kind==='bento'?'¥ 480':'NEW  /  こはる',256,594)}
  })
}
