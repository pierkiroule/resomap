import { useEffect, useRef, useState } from 'react'
import './TouchVJ.css'

const ANIMATOR_FX_PRESETS = {
  'Nebula Drift': (audio) => {
    const hue = 40 + audio.mid * 180
    const blur = (audio.bass * 6).toFixed(2)
    const saturate = 120 + audio.high * 80
    return `hue-rotate(${hue}deg) blur(${blur}px) saturate(${saturate}%)`
  },
  'Prism Pulse': (audio) => {
    const contrast = 110 + audio.high * 60
    const brightness = 90 + audio.mid * 40
    const hue = audio.high * 90
    return `contrast(${contrast}%) brightness(${brightness}%) hue-rotate(${hue}deg)`
  },
  'Lunar Bloom': (audio) => {
    const blur = 2 + audio.mid * 4
    const brightness = 110 + audio.high * 60
    return `blur(${blur}px) brightness(${brightness}%)`
  }
}

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
  
  // Dreamflow timeline
  const [timelineClips, setTimelineClips] = useState([])
  const [timelineTime, setTimelineTime] = useState(0)
  const [timelineLength, setTimelineLength] = useState(30)
  const [timelinePlaying, setTimelinePlaying] = useState(false)
  const [clipDuration, setClipDuration] = useState(5)
  const [timelineVisible, setTimelineVisible] = useState(false)
  const timelinePlayingRef = useRef(false)
  const timelineLengthRef = useRef(30)
  const lastTimelineTickRef = useRef(null)
  
  useEffect(() => {
    timelinePlayingRef.current = timelinePlaying
    if (!timelinePlaying) {
      lastTimelineTickRef.current = null
    }
  }, [timelinePlaying])
  
  useEffect(() => {
    timelineLengthRef.current = timelineLength
    setTimelineTime(prev => Math.min(prev, timelineLength))
  }, [timelineLength])
  
  // Recording
  const mediaRecorderRef = useRef(null)
  const recordedChunksRef = useRef([])
  const recordingStreamRef = useRef(null)
  const autoStopTimeoutRef = useRef(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const recordingTimerRef = useRef(null)
  
  // UI visibility
  const [uiVisible, setUiVisible] = useState(true)
  const uiTimeoutRef = useRef(null)
  
  // XY Pad FX
  const [xyPadActive, setXyPadActive] = useState(false)
  const [xyPadFX, setXyPadFX] = useState({
    x: 0.5, // 0-1
    y: 0.5, // 0-1
    xEffect: 'hue', // hue, blur, brightness, contrast, saturate
    yEffect: 'blur' // hue, blur, brightness, contrast, saturate
  })
  
  // Auto-hide UI
  useEffect(() => {
    const resetUITimer = () => {
      setUiVisible(true)
      clearTimeout(uiTimeoutRef.current)
      uiTimeoutRef.current = setTimeout(() => {
        if (!isRecording) setUiVisible(false)
      }, 3000)
    }
    
    window.addEventListener('mousemove', resetUITimer)
    window.addEventListener('touchstart', resetUITimer)
    resetUITimer()
    
    return () => {
      window.removeEventListener('mousemove', resetUITimer)
      window.removeEventListener('touchstart', resetUITimer)
      clearTimeout(uiTimeoutRef.current)
    }
  }, [isRecording])
  
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
        
        if (timelinePlayingRef.current) {
          const now = performance.now()
          if (lastTimelineTickRef.current == null) {
            lastTimelineTickRef.current = now
          }
          const delta = (now - lastTimelineTickRef.current) / 1000
          lastTimelineTickRef.current = now
          setTimelineTime(prev => {
            const length = Math.max(1, timelineLengthRef.current)
            const next = prev + delta
            return next >= length ? next % length : next
          })
        } else {
          lastTimelineTickRef.current = null
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
        opacity: 1,
        blendMode: 'screen',
        audioReactive: {
          scale: true,
          opacity: false
        }
      }
      
      setVideoLayers(prev => [...prev, newLayer])
    })
  }

  const getActiveClip = (layerId) => {
    return timelineClips.find(clip => 
      clip.layerId === layerId &&
      timelineTime >= clip.start &&
      timelineTime < clip.end
    )
  }

  const addTimelineClip = (blendMode, animatorFx = null) => {
    if (!selectedLayer) {
      alert('Sélectionnez un calque pour ajouter un clip Dreamflow.')
      return
    }
    const length = Math.max(1, timelineLength)
    const start = Math.min(timelineTime, length - 0.5)
    const end = Math.min(length, start + clipDuration)
    const newClip = {
      id: `${Date.now()}-${Math.random()}`,
      layerId: selectedLayer,
      start,
      end,
      blendMode,
      animatorFx
    }
    setTimelineClips(prev => [...prev, newClip])
  }

  const removeTimelineClip = (clipId) => {
    setTimelineClips(prev => prev.filter(clip => clip.id !== clipId))
  }

  const handleTimelineSeek = (value) => {
    const numeric = typeof value === 'number' ? value : parseFloat(value)
    if (Number.isNaN(numeric)) return
    const clamped = Math.max(0, Math.min(timelineLength, numeric))
    setTimelineTime(clamped)
  }

  const toggleTimelinePlayback = () => {
    setTimelinePlaying(prev => !prev)
  }

  const resetTimelineTime = () => {
    setTimelinePlaying(false)
    setTimelineTime(0)
  }
  
  const formatSeconds = (seconds) => seconds.toFixed(1)
  
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
  
  // Recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: 'screen' }
      })
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 5000000
      })
      
      recordedChunksRef.current = []
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data)
        }
      }
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `resomap-vj-${Date.now()}.webm`
        a.click()
        URL.revokeObjectURL(url)
        
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorder.start()
      mediaRecorderRef.current = mediaRecorder
      setIsRecording(true)
      setRecordingTime(0)
      
      // Timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 30) {
            stopRecording()
            return 30
          }
          return prev + 1
        })
      }, 1000)
      
      // Auto-stop after 30 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          stopRecording()
        }
      }, 30000)
      
    } catch (err) {
      console.error('Recording error:', err)
      alert('Erreur d\'enregistrement. Assurez-vous de sélectionner l\'onglet à enregistrer.')
    }
  }
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
      clearInterval(recordingTimerRef.current)
      setIsRecording(false)
      setRecordingTime(0)
    }
  }
  
  // XY Pad handler
  const handleXYPad = (e) => {
    if (!xyPadActive) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX || e.touches[0].clientX) - rect.left) / rect.width
    const y = 1 - ((e.clientY || e.touches[0].clientY) - rect.top) / rect.height
    
    setXyPadFX(prev => ({
      ...prev,
      x: Math.max(0, Math.min(1, x)),
      y: Math.max(0, Math.min(1, y))
    }))
  }
  
  // Get FX value from XY pad
  const getFXValue = (effect, value) => {
    switch(effect) {
      case 'hue':
        return value * 360 // 0-360deg
      case 'blur':
        return value * 20 // 0-20px
      case 'brightness':
        return 50 + value * 100 // 50-150%
      case 'contrast':
        return 50 + value * 100 // 50-150%
      case 'saturate':
        return value * 200 // 0-200%
      default:
        return value
    }
  }
  
  const safeTimelineLength = Math.max(1, timelineLength)
  
  return (
    <div className="touch-vj">
        {/* Video Layers */}
        <div className="video-layers">
          {videoLayers.map(layer => {
            const audioScale = layer.audioReactive.scale ? (1 + audioData.bass * 0.5) : 1
            const audioOpacity = layer.audioReactive.opacity ? audioData.high : layer.opacity
            
            const activeClip = getActiveClip(layer.id)
            const activeBlendMode = activeClip?.blendMode || layer.blendMode
            const animatorFilter = activeClip?.animatorFx && ANIMATOR_FX_PRESETS[activeClip.animatorFx]
              ? ANIMATOR_FX_PRESETS[activeClip.animatorFx](audioData)
              : ''
            
            // XY Pad FX
            const hue = xyPadActive ? getFXValue(xyPadFX.xEffect === 'hue' ? 'hue' : xyPadFX.yEffect === 'hue' ? 'hue' : null, 
                                                  xyPadFX.xEffect === 'hue' ? xyPadFX.x : xyPadFX.yEffect === 'hue' ? xyPadFX.y : 0) : 0
            const blur = xyPadActive ? getFXValue(xyPadFX.xEffect === 'blur' ? 'blur' : xyPadFX.yEffect === 'blur' ? 'blur' : null,
                                                  xyPadFX.xEffect === 'blur' ? xyPadFX.x : xyPadFX.yEffect === 'blur' ? xyPadFX.y : 0) : 0
            const brightness = xyPadActive ? getFXValue(xyPadFX.xEffect === 'brightness' ? 'brightness' : xyPadFX.yEffect === 'brightness' ? 'brightness' : null,
                                                         xyPadFX.xEffect === 'brightness' ? xyPadFX.x : xyPadFX.yEffect === 'brightness' ? xyPadFX.y : 0.5) : 100
            const contrast = xyPadActive ? getFXValue(xyPadFX.xEffect === 'contrast' ? 'contrast' : xyPadFX.yEffect === 'contrast' ? 'contrast' : null,
                                                       xyPadFX.xEffect === 'contrast' ? xyPadFX.x : xyPadFX.yEffect === 'contrast' ? xyPadFX.y : 0.5) : 100
            const saturate = xyPadActive ? getFXValue(xyPadFX.xEffect === 'saturate' ? 'saturate' : xyPadFX.yEffect === 'saturate' ? 'saturate' : null,
                                                       xyPadFX.xEffect === 'saturate' ? xyPadFX.x : xyPadFX.yEffect === 'saturate' ? xyPadFX.y : 0.5) : 100
            
            const filterString = `blur(${blur}px) brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) hue-rotate(${hue}deg)`
            const combinedFilter = animatorFilter ? `${filterString} ${animatorFilter}` : filterString
          
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
                  transform: `translate(-50%, -50%) scale(${layer.scale * audioScale})`,
                  opacity: audioOpacity,
                  mixBlendMode: activeBlendMode,
                  filter: combinedFilter
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
      <div className={`ui ${uiVisible ? 'visible' : 'hidden'}`}>
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
          className={isRecording ? 'recording' : ''}
          onClick={isRecording ? stopRecording : startRecording}
          title={isRecording ? 'Stop Recording' : 'Record 30sec'}
        >
          {isRecording ? '⏹️' : '⏺️'}
        </button>
        
        <button 
          className={manipulateMode ? 'active' : ''}
          onClick={() => setManipulateMode(!manipulateMode)}
          title="Toggle Manipulate/Draw"
        >
          {manipulateMode ? '🖐️' : '✏️'}
        </button>
        
        <button 
          className={xyPadActive ? 'active' : ''}
          onClick={() => setXyPadActive(!xyPadActive)}
          title="XY Pad FX Controller"
        >
          🎛️
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
      
      {/* Recording Timer */}
      {isRecording && (
        <div className="recording-timer">
          <div className="rec-dot" />
          <span>REC {recordingTime}s / 30s</span>
        </div>
      )}
      
      {/* XY Pad Controller */}
      {xyPadActive && (
        <div className={`xy-pad-container ${uiVisible ? 'visible' : 'hidden'}`}>
          <div className="xy-pad-header">
            <select 
              value={xyPadFX.xEffect}
              onChange={(e) => setXyPadFX(prev => ({ ...prev, xEffect: e.target.value }))}
            >
              <option value="hue">Hue</option>
              <option value="blur">Blur</option>
              <option value="brightness">Brightness</option>
              <option value="contrast">Contrast</option>
              <option value="saturate">Saturate</option>
            </select>
            <span>X</span>
            <span>Y</span>
            <select 
              value={xyPadFX.yEffect}
              onChange={(e) => setXyPadFX(prev => ({ ...prev, yEffect: e.target.value }))}
            >
              <option value="blur">Blur</option>
              <option value="hue">Hue</option>
              <option value="brightness">Brightness</option>
              <option value="contrast">Contrast</option>
              <option value="saturate">Saturate</option>
            </select>
          </div>
          <div 
            className="xy-pad"
            onMouseDown={handleXYPad}
            onMouseMove={(e) => e.buttons === 1 && handleXYPad(e)}
            onTouchStart={handleXYPad}
            onTouchMove={handleXYPad}
          >
            <div 
              className="xy-pad-cursor"
              style={{
                left: `${xyPadFX.x * 100}%`,
                top: `${(1 - xyPadFX.y) * 100}%`
              }}
            />
          </div>
        </div>
      )}
      
      {/* Layer Controls */}
      {selectedLayer && manipulateMode && (
        <div className={`layer-controls ${uiVisible ? 'visible' : 'hidden'}`}>
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
          
          <select 
            value={videoLayers.find(l => l.id === selectedLayer)?.blendMode || 'screen'}
            onChange={(e) => updateLayer(selectedLayer, { blendMode: e.target.value })}
          >
            <option value="normal">Normal</option>
            <option value="screen">Screen</option>
            <option value="overlay">Overlay</option>
            <option value="multiply">Multiply</option>
            <option value="color-dodge">Color Dodge</option>
            <option value="color-burn">Color Burn</option>
            <option value="hard-light">Hard Light</option>
            <option value="soft-light">Soft Light</option>
            <option value="difference">Difference</option>
            <option value="exclusion">Exclusion</option>
            <option value="hue">Hue</option>
            <option value="saturation">Saturation</option>
            <option value="luminosity">Luminosity</option>
          </select>
          
          <button 
            className="delete"
            onClick={() => deleteLayer(selectedLayer)}
          >
            🗑️
          </button>
        </div>
      )}
      
        {/* Dreamflow Timeline */}
        <div className={`dreamflow-panel ${uiVisible ? 'visible' : 'hidden'}`}>
          <div className="timeline-header">
            <button onClick={toggleTimelinePlayback}>
              {timelinePlaying ? '⏸️' : '▶️'}
            </button>
            <button onClick={resetTimelineTime}>⏮️</button>
            <span className="timeline-time">
              {formatSeconds(timelineTime)}s / {safeTimelineLength}s
            </span>
            <input
              type="range"
              min="0"
              max={safeTimelineLength}
              step="0.1"
              value={timelineTime}
              onChange={(e) => handleTimelineSeek(e.target.value)}
            />
            <label>
              Durée
              <select value={timelineLength} onChange={(e) => setTimelineLength(Number(e.target.value))}>
                {[30, 45, 60, 90, 120].map(len => (
                  <option key={len} value={len}>{len}s</option>
                ))}
              </select>
            </label>
            <label>
              Clip
              <select value={clipDuration} onChange={(e) => setClipDuration(Number(e.target.value))}>
                {[2, 4, 6, 8, 12].map(len => (
                  <option key={len} value={len}>{len}s</option>
                ))}
              </select>
            </label>
          </div>
          
          <div className="timeline-layers">
            {videoLayers.length === 0 ? (
              <div className="timeline-empty">Ajoutez un calque pour séquencer vos blends.</div>
            ) : (
              videoLayers.map(layer => {
                const layerClips = timelineClips.filter(clip => clip.layerId === layer.id)
                return (
                  <div key={layer.id} className="timeline-row">
                    <span className="timeline-layer-name">{layer.name}</span>
                    <div className="timeline-track">
                      {layerClips.map(clip => {
                        const startPercent = (clip.start / safeTimelineLength) * 100
                        const widthPercent = ((clip.end - clip.start) / safeTimelineLength) * 100
                        return (
                          <div
                            key={clip.id}
                            className={`timeline-clip ${clip.animatorFx ? 'fx' : ''}`}
                            style={{ left: `${startPercent}%`, width: `${widthPercent}%` }}
                            title={`${clip.blendMode}${clip.animatorFx ? ` · ${clip.animatorFx}` : ''} (${formatSeconds(clip.start)}s → ${formatSeconds(clip.end)}s)`}
                            onDoubleClick={() => removeTimelineClip(clip.id)}
                          >
                            <span>{clip.animatorFx || clip.blendMode}</span>
                          </div>
                        )
                      })}
                      <div
                        className="timeline-cursor"
                        style={{ left: `${(timelineTime / safeTimelineLength) * 100}%` }}
                      />
                    </div>
                  </div>
                )
              })
            )}
          </div>
          
          {selectedLayer && (
            <div className="timeline-actions">
              <div className="clip-tools">
                <span>Blend Modes</span>
                {['screen', 'overlay', 'multiply', 'difference', 'soft-light'].map(mode => (
                  <button key={mode} onClick={() => addTimelineClip(mode)}>
                    {mode}
                  </button>
                ))}
              </div>
              <div className="clip-tools">
                <span>Dream Macros</span>
                {Object.keys(ANIMATOR_FX_PRESETS).map(name => (
                  <button key={name} onClick={() => addTimelineClip('screen', name)}>
                    {name}
                  </button>
                ))}
              </div>
              <small>💡 Double-cliquez sur un clip pour le supprimer.</small>
            </div>
          )}
        </div>
        
      {/* Audio Viz */}
      <div className={`audio-viz ${uiVisible ? 'visible' : 'hidden'}`}>
        <div className="bar" style={{ width: `${audioData.bass * 100}%` }}>🔊</div>
        <div className="bar" style={{ width: `${audioData.mid * 100}%` }}>🎸</div>
        <div className="bar" style={{ width: `${audioData.high * 100}%` }}>🎹</div>
      </div>
    </div>
  )
}
