import { useEffect, useRef, useState } from 'react'
import './TouchVJ.css'

export default function TouchVJ() {
  const canvasRef = useRef(null)
  const ctxRef = useRef(null)
  const particlesRef = useRef([])
  const animationRef = useRef(null)
  
  // Media layers
  const [videoLayers, setVideoLayers] = useState([])
  const [selectedLayer, setSelectedLayer] = useState(null)
  const videoRefs = useRef({})
  
  // Audio
  const audioRef = useRef(null)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const dataArrayRef = useRef(null)
  
  const [mode, setMode] = useState('particles') // particles, trails, ripples, paint, kaleidoscope
  const [audioData, setAudioData] = useState({ bass: 0.5, mid: 0.5, high: 0.5 })
  const [manipulateMode, setManipulateMode] = useState(false) // Toggle between draw/manipulate
  
  // Initialize canvas and audio
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctxRef.current = ctx
    
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    
    // Animation loop
    const animate = () => {
      // Fade effect for trails
      ctx.fillStyle = 'rgba(0,0,0,0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Update particles
      particlesRef.current = particlesRef.current.filter(p => {
        p.update()
        p.draw(ctx)
        return p.life > 0
      })
      
      // Update audio data if analyzer exists
      if (analyserRef.current && dataArrayRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current)
        const data = dataArrayRef.current
        
        // Calculate frequency bands
        const bass = data.slice(0, 8).reduce((a, b) => a + b, 0) / (8 * 255)
        const mid = data.slice(8, 16).reduce((a, b) => a + b, 0) / (8 * 255)
        const high = data.slice(16, 24).reduce((a, b) => a + b, 0) / (8 * 255)
        
        setAudioData({ bass, mid, high })
      }
      
      animationRef.current = requestAnimationFrame(animate)
    }
    animate()
    
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [])
  
  // Handle audio upload
  const handleAudioUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    const url = URL.createObjectURL(file)
    const audio = new Audio(url)
    audioRef.current = audio
    
    // Setup Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    audioContextRef.current = audioContext
    
    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 64
    analyserRef.current = analyser
    
    const dataArray = new Uint8Array(analyser.frequencyBinCount)
    dataArrayRef.current = dataArray
    
    const source = audioContext.createMediaElementSource(audio)
    source.connect(analyser)
    analyser.connect(audioContext.destination)
    
    audio.loop = true
    audio.play()
  }
  
  // Handle video upload
  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files)
    
    files.forEach(file => {
      const url = URL.createObjectURL(file)
      const id = Date.now() + Math.random()
      
      const newLayer = {
        id,
        name: file.name,
        url,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        scale: 1,
        rotation: 0,
        opacity: 1,
        blendMode: 'screen',
        audioReactive: {
          scale: true,
          rotation: true,
          opacity: false
        }
      }
      
      setVideoLayers(prev => [...prev, newLayer])
    })
  }
  
  // Update video layer
  const updateLayer = (id, updates) => {
    setVideoLayers(prev => prev.map(layer => 
      layer.id === id ? { ...layer, ...updates } : layer
    ))
  }
  
  // Delete layer
  const deleteLayer = (id) => {
    const layer = videoLayers.find(l => l.id === id)
    if (layer) URL.revokeObjectURL(layer.url)
    setVideoLayers(prev => prev.filter(l => l.id !== id))
    if (selectedLayer === id) setSelectedLayer(null)
  }
  
  // Touch/Mouse handlers
  const handlePointerDown = (e) => {
    e.preventDefault()
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top
    
    if (manipulateMode) {
      // Check if touching a video layer
      for (let i = videoLayers.length - 1; i >= 0; i--) {
        const layer = videoLayers[i]
        const dx = x - layer.x
        const dy = y - layer.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        
        if (dist < 100) {
          setSelectedLayer(layer.id)
          return
        }
      }
      setSelectedLayer(null)
    } else {
      handlePointer(e)
    }
  }
  
  const handlePointer = (e) => {
    e.preventDefault()
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    
    const touches = e.touches || [{ clientX: e.clientX, clientY: e.clientY }]
    
    Array.from(touches).forEach(touch => {
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top
      
      if (manipulateMode && selectedLayer) {
        // Move selected layer
        updateLayer(selectedLayer, { x, y })
      } else {
        // Draw effects
        switch(mode) {
          case 'particles':
            spawnParticles(x, y)
            break
          case 'trails':
            addTrail(x, y)
            break
          case 'ripples':
            addRipple(x, y)
            break
          case 'paint':
            paint(x, y)
            break
          case 'kaleidoscope':
            spawnKaleidoscope(x, y)
            break
        }
      }
    })
  }
  
  const spawnParticles = (x, y) => {
    const count = 5 + Math.floor(audioData.bass * 15)
    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        x, y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8 - 2,
        life: 1,
        decay: 0.01 + Math.random() * 0.02,
        size: 2 + Math.random() * 4 + audioData.bass * 6,
        hue: (Date.now() / 10 + Math.random() * 60) % 360,
        update() {
          this.x += this.vx
          this.y += this.vy
          this.vy += 0.15 // gravity
          this.life -= this.decay
        },
        draw(ctx) {
          ctx.save()
          ctx.globalAlpha = this.life
          const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size)
          grad.addColorStop(0, `hsl(${this.hue}, 100%, 70%)`)
          grad.addColorStop(1, `hsl(${this.hue + 30}, 100%, 50%)`)
          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }
      })
    }
  }
  
  const addTrail = (x, y) => {
    const ctx = ctxRef.current
    const hue = (Date.now() / 10) % 360
    const size = 5 + audioData.bass * 10
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()
  }
  
  const addRipple = (x, y) => {
    particlesRef.current.push({
      x, y,
      radius: 0,
      maxRadius: 100 + audioData.bass * 200,
      speed: 2 + audioData.bass * 5,
      hue: (Date.now() / 10) % 360,
      life: 1,
      update() {
        this.radius += this.speed
        this.life = 1 - (this.radius / this.maxRadius)
      },
      draw(ctx) {
        ctx.save()
        ctx.globalAlpha = this.life
        ctx.strokeStyle = `hsl(${this.hue}, 100%, 50%)`
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.stroke()
        ctx.restore()
      }
    })
  }
  
  const paint = (x, y) => {
    const ctx = ctxRef.current
    const hue = (Date.now() / 10 + audioData.mid * 180) % 360
    const size = 20 + audioData.bass * 40
    const grad = ctx.createRadialGradient(x, y, 0, x, y, size)
    grad.addColorStop(0, `hsla(${hue}, 100%, 50%, 0.8)`)
    grad.addColorStop(1, `hsla(${hue + 60}, 100%, 50%, 0)`)
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()
  }
  
  const spawnKaleidoscope = (x, y) => {
    const canvas = canvasRef.current
    const cx = canvas.width / 2
    const cy = canvas.height / 2
    const segments = 8
    
    for (let i = 0; i < segments; i++) {
      const angle = (Math.PI * 2 / segments) * i
      const rx = x - cx
      const ry = y - cy
      const mx = cx + (rx * Math.cos(angle) - ry * Math.sin(angle))
      const my = cy + (rx * Math.sin(angle) + ry * Math.cos(angle))
      spawnParticles(mx, my)
    }
  }
  
  const clear = () => {
    const canvas = canvasRef.current
    const ctx = ctxRef.current
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particlesRef.current = []
  }
  
  return (
    <div className="touch-vj">
      {/* Video Layers */}
      <div className="video-layers">
        {videoLayers.map(layer => {
          const audioScale = layer.audioReactive.scale ? (1 + audioData.bass * 0.5) : 1
          const audioRotation = layer.audioReactive.rotation ? (audioData.mid * 360) : 0
          const audioOpacity = layer.audioReactive.opacity ? audioData.high : layer.opacity
          
          return (
            <video
              key={layer.id}
              ref={el => videoRefs.current[layer.id] = el}
              src={layer.url}
              autoPlay
              loop
              muted
              className={`video-layer ${selectedLayer === layer.id ? 'selected' : ''}`}
              style={{
                left: layer.x + 'px',
                top: layer.y + 'px',
                transform: `translate(-50%, -50%) scale(${layer.scale * audioScale}) rotate(${layer.rotation + audioRotation}deg)`,
                opacity: audioOpacity,
                mixBlendMode: layer.blendMode
              }}
              onLoadedData={(e) => e.target.play()}
            />
          )
        })}
      </div>
      
      {/* Canvas for touch effects */}
      <canvas
        ref={canvasRef}
        className="vj-canvas"
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointer}
        onMouseDown={handlePointerDown}
        onMouseMove={(e) => e.buttons === 1 && handlePointer(e)}
      />
      
      {/* Top UI */}
      <div className="ui">
        <input
          type="file"
          id="audio-upload"
          accept="audio/*"
          onChange={handleAudioUpload}
          style={{ display: 'none' }}
        />
        <label htmlFor="audio-upload" className="upload-btn" title="Upload Audio">
          🎵
        </label>
        
        <input
          type="file"
          id="video-upload"
          accept="video/*"
          multiple
          onChange={handleVideoUpload}
          style={{ display: 'none' }}
        />
        <label htmlFor="video-upload" className="upload-btn" title="Upload Video">
          🎬
        </label>
        
        <button 
          className={manipulateMode ? 'active' : ''}
          onClick={() => setManipulateMode(!manipulateMode)}
          title="Toggle Manipulate/Draw"
        >
          {manipulateMode ? '🖐️' : '✏️'}
        </button>
        
        <div className="separator" />
        
        <button 
          className={mode === 'particles' ? 'active' : ''}
          onClick={() => setMode('particles')}
        >
          ✨
        </button>
        <button 
          className={mode === 'trails' ? 'active' : ''}
          onClick={() => setMode('trails')}
        >
          🌊
        </button>
        <button 
          className={mode === 'ripples' ? 'active' : ''}
          onClick={() => setMode('ripples')}
        >
          💫
        </button>
        <button 
          className={mode === 'paint' ? 'active' : ''}
          onClick={() => setMode('paint')}
        >
          🎨
        </button>
        <button 
          className={mode === 'kaleidoscope' ? 'active' : ''}
          onClick={() => setMode('kaleidoscope')}
        >
          🔮
        </button>
        <button className="clear" onClick={clear}>🗑️</button>
      </div>
      
      {/* Layer Controls */}
      {selectedLayer && manipulateMode && (
        <div className="layer-controls">
          <button onClick={() => {
            const layer = videoLayers.find(l => l.id === selectedLayer)
            updateLayer(selectedLayer, { 
              scale: Math.max(0.5, layer.scale - 0.1) 
            })
          }}>-</button>
          <span>Scale</span>
          <button onClick={() => {
            const layer = videoLayers.find(l => l.id === selectedLayer)
            updateLayer(selectedLayer, { 
              scale: Math.min(3, layer.scale + 0.1) 
            })
          }}>+</button>
          
          <button onClick={() => {
            const layer = videoLayers.find(l => l.id === selectedLayer)
            updateLayer(selectedLayer, { 
              rotation: layer.rotation - 15
            })
          }}>↺</button>
          <span>Rotate</span>
          <button onClick={() => {
            const layer = videoLayers.find(l => l.id === selectedLayer)
            updateLayer(selectedLayer, { 
              rotation: layer.rotation + 15
            })
          }}>↻</button>
          
          <select 
            value={videoLayers.find(l => l.id === selectedLayer)?.blendMode || 'screen'}
            onChange={(e) => updateLayer(selectedLayer, { blendMode: e.target.value })}
          >
            <option value="normal">Normal</option>
            <option value="screen">Screen</option>
            <option value="overlay">Overlay</option>
            <option value="multiply">Multiply</option>
            <option value="color-dodge">Color Dodge</option>
            <option value="difference">Difference</option>
          </select>
          
          <button 
            className="delete"
            onClick={() => deleteLayer(selectedLayer)}
          >
            🗑️
          </button>
        </div>
      )}
      
      {/* Audio Viz */}
      <div className="audio-viz">
        <div className="bar" style={{ width: `${audioData.bass * 100}%` }}>🔊</div>
        <div className="bar" style={{ width: `${audioData.mid * 100}%` }}>🎸</div>
        <div className="bar" style={{ width: `${audioData.high * 100}%` }}>🎹</div>
      </div>
    </div>
  )
}
