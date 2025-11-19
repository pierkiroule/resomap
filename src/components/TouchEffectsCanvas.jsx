import React, { useRef, useEffect, useState } from 'react'
import './TouchEffectsCanvas.css'

function TouchEffectsCanvas({ isActive, audioData }) {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const trailsRef = useRef([])
  const ripplesRef = useRef([])
  const animationFrameRef = useRef(null)
  const [effectMode, setEffectMode] = useState('particles') // particles, trails, ripples, kaleidoscope, paint

  useEffect(() => {
    if (!isActive) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Animation loop
    const animate = () => {
      // Fade effect for trails
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.update(audioData)
        particle.draw(ctx)
        return particle.life > 0
      })

      // Draw trails
      if (effectMode === 'trails' || effectMode === 'paint') {
        trailsRef.current.forEach(trail => {
          trail.draw(ctx)
        })
      }

      // Draw ripples
      ripplesRef.current = ripplesRef.current.filter(ripple => {
        ripple.update()
        ripple.draw(ctx)
        return ripple.radius < ripple.maxRadius
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isActive, audioData, effectMode])

  const handleTouch = (e) => {
    if (!isActive) return
    e.preventDefault()

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()

    Array.from(e.touches).forEach(touch => {
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top

      switch(effectMode) {
        case 'particles':
          spawnParticles(x, y)
          break
        case 'trails':
          addTrail(x, y)
          break
        case 'ripples':
          createRipple(x, y)
          break
        case 'paint':
          addPaint(x, y)
          break
        case 'kaleidoscope':
          spawnKaleidoscopeParticles(x, y)
          break
      }
    })
  }

  const handleTouchMove = (e) => {
    handleTouch(e)
  }

  const spawnParticles = (x, y) => {
    const count = 10 + Math.floor(audioData.bass * 20)
    for (let i = 0; i < count; i++) {
      particlesRef.current.push(new Particle(x, y, audioData))
    }
  }

  const spawnKaleidoscopeParticles = (x, y) => {
    const canvas = canvasRef.current
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const segments = 8
    
    for (let i = 0; i < segments; i++) {
      const angle = (Math.PI * 2 / segments) * i
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      
      const relX = x - centerX
      const relY = y - centerY
      
      const mirrorX = centerX + (relX * cos - relY * sin)
      const mirrorY = centerY + (relX * sin + relY * cos)
      
      spawnParticles(mirrorX, mirrorY)
    }
  }

  const addTrail = (x, y) => {
    trailsRef.current.push({
      x, y,
      color: `hsl(${(Date.now() / 10) % 360}, 100%, 50%)`,
      size: 5 + audioData.overall * 10,
      draw: function(ctx) {
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    })
    
    // Limit trail points
    if (trailsRef.current.length > 500) {
      trailsRef.current.shift()
    }
  }

  const addPaint = (x, y) => {
    const ctx = canvasRef.current.getContext('2d')
    const hue = (Date.now() / 10 + audioData.mid * 180) % 360
    const size = 20 + audioData.bass * 40
    
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size)
    gradient.addColorStop(0, `hsla(${hue}, 100%, 50%, 0.8)`)
    gradient.addColorStop(1, `hsla(${hue + 60}, 100%, 50%, 0)`)
    
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()
  }

  const createRipple = (x, y) => {
    ripplesRef.current.push(new Ripple(x, y, audioData))
  }

  const clearEffects = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particlesRef.current = []
    trailsRef.current = []
    ripplesRef.current = []
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        className="touch-effects-canvas"
        onTouchStart={handleTouch}
        onTouchMove={handleTouchMove}
        onMouseDown={handleTouch}
        onMouseMove={(e) => {
          if (e.buttons === 1) {
            handleTouch({ 
              touches: [{ clientX: e.clientX, clientY: e.clientY }],
              preventDefault: () => {}
            })
          }
        }}
      />
      
      <div className="effect-mode-selector">
        <button 
          className={effectMode === 'particles' ? 'active' : ''}
          onClick={() => setEffectMode('particles')}
          title="Particules"
        >
          ✨
        </button>
        <button 
          className={effectMode === 'trails' ? 'active' : ''}
          onClick={() => setEffectMode('trails')}
          title="Traces"
        >
          🌊
        </button>
        <button 
          className={effectMode === 'ripples' ? 'active' : ''}
          onClick={() => setEffectMode('ripples')}
          title="Ondes"
        >
          💫
        </button>
        <button 
          className={effectMode === 'paint' ? 'active' : ''}
          onClick={() => setEffectMode('paint')}
          title="Peinture"
        >
          🎨
        </button>
        <button 
          className={effectMode === 'kaleidoscope' ? 'active' : ''}
          onClick={() => setEffectMode('kaleidoscope')}
          title="Kaléidoscope"
        >
          🔮
        </button>
        <button 
          className="clear-btn"
          onClick={clearEffects}
          title="Effacer"
        >
          🗑️
        </button>
      </div>
    </>
  )
}

// Particle class
class Particle {
  constructor(x, y, audioData) {
    this.x = x
    this.y = y
    this.vx = (Math.random() - 0.5) * 10
    this.vy = (Math.random() - 0.5) * 10
    this.life = 1
    this.decay = 0.01 + Math.random() * 0.02
    this.size = 2 + Math.random() * 4 + audioData.overall * 6
    this.hue = (Date.now() / 10 + Math.random() * 60) % 360
    this.audioReactive = audioData.bass > 0.5
  }

  update(audioData) {
    this.x += this.vx
    this.y += this.vy
    this.vy += 0.2 // Gravity
    this.life -= this.decay
    
    // Audio reactivity
    if (this.audioReactive && audioData.bass > 0.5) {
      this.size = 2 + audioData.bass * 10
    }
  }

  draw(ctx) {
    ctx.save()
    ctx.globalAlpha = this.life
    
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.size
    )
    gradient.addColorStop(0, `hsl(${this.hue}, 100%, 70%)`)
    gradient.addColorStop(1, `hsl(${this.hue + 30}, 100%, 50%)`)
    
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

// Ripple class
class Ripple {
  constructor(x, y, audioData) {
    this.x = x
    this.y = y
    this.radius = 0
    this.maxRadius = 100 + audioData.overall * 200
    this.speed = 2 + audioData.bass * 5
    this.hue = (Date.now() / 10) % 360
  }

  update() {
    this.radius += this.speed
  }

  draw(ctx) {
    ctx.save()
    ctx.globalAlpha = 1 - (this.radius / this.maxRadius)
    ctx.strokeStyle = `hsl(${this.hue}, 100%, 50%)`
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()
  }
}

export default TouchEffectsCanvas
