import React, { useRef, useEffect } from 'react'
import './TouchFX.css'

/**
 * TouchFX - Effets VJing magnifiques déclenchés par le toucher
 * 
 * FX disponibles:
 * - Ripple (ondulations)
 * - Glow (lueur qui suit le doigt)
 * - Warp liquide (distorsion)
 * - Chromatic shift (décalage RVB)
 */

function TouchFX({ enabled = true, intensity = 1, audioData = {} }) {
  const canvasRef = useRef(null)
  const touchesRef = useRef([])
  const animationFrameRef = useRef(null)
  const ripplesRef = useRef([])

  useEffect(() => {
    if (!enabled) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    
    // Set canvas size
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Touch event handlers
    const handleTouchStart = (e) => {
      Array.from(e.touches).forEach(touch => {
        const x = touch.clientX - rect.left
        const y = touch.clientY - rect.top
        
        // Add touch to active touches
        touchesRef.current.push({
          id: touch.identifier,
          x,
          y,
          startTime: Date.now(),
          trail: []
        })

        // Create ripple
        ripplesRef.current.push({
          x,
          y,
          radius: 0,
          maxRadius: 200 * intensity,
          startTime: Date.now(),
          duration: 1500
        })
      })
    }

    const handleTouchMove = (e) => {
      e.preventDefault()
      Array.from(e.touches).forEach(touch => {
        const x = touch.clientX - rect.left
        const y = touch.clientY - rect.top
        
        // Update touch position
        const existingTouch = touchesRef.current.find(t => t.id === touch.identifier)
        if (existingTouch) {
          existingTouch.trail.push({ x: existingTouch.x, y: existingTouch.y })
          if (existingTouch.trail.length > 20) existingTouch.trail.shift()
          existingTouch.x = x
          existingTouch.y = y
        }
      })
    }

    const handleTouchEnd = (e) => {
      Array.from(e.changedTouches).forEach(touch => {
        touchesRef.current = touchesRef.current.filter(t => t.id !== touch.identifier)
      })
    }

    // Animation loop
    const render = () => {
      const now = Date.now()

      // Clear canvas
      ctx.clearRect(0, 0, rect.width, rect.height)

      // Audio reactivity
      const bassBoost = 1 + (audioData.bass || 0) * 2
      const midColor = Math.floor((audioData.mid || 0) * 360)
      const highGlow = 10 + (audioData.high || 0) * 30

      // Render ripples
      ripplesRef.current = ripplesRef.current.filter(ripple => {
        const age = now - ripple.startTime
        if (age > ripple.duration) return false

        const progress = age / ripple.duration
        ripple.radius = ripple.maxRadius * progress

        const opacity = (1 - progress) * 0.6

        // Draw ripple
        ctx.strokeStyle = `hsla(${midColor + 180}, 80%, 60%, ${opacity})`
        ctx.lineWidth = 3 * bassBoost
        ctx.beginPath()
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2)
        ctx.stroke()

        // Inner glow
        ctx.strokeStyle = `hsla(${midColor}, 100%, 70%, ${opacity * 0.5})`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(ripple.x, ripple.y, ripple.radius * 0.7, 0, Math.PI * 2)
        ctx.stroke()

        return true
      })

      // Render active touches
      touchesRef.current.forEach(touch => {
        const age = now - touch.startTime

        // Pulsing glow
        const glowSize = highGlow * (1 + Math.sin(age / 200) * 0.3) * bassBoost

        // Gradient glow
        const gradient = ctx.createRadialGradient(
          touch.x, touch.y, 0,
          touch.x, touch.y, glowSize
        )
        gradient.addColorStop(0, `hsla(${midColor}, 100%, 70%, 0.8)`)
        gradient.addColorStop(0.5, `hsla(${midColor + 60}, 100%, 60%, 0.4)`)
        gradient.addColorStop(1, `hsla(${midColor + 120}, 80%, 50%, 0)`)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(touch.x, touch.y, glowSize, 0, Math.PI * 2)
        ctx.fill()

        // Trail effect (onirique)
        if (touch.trail.length > 1) {
          ctx.strokeStyle = `hsla(${midColor + 240}, 100%, 70%, 0.5)`
          ctx.lineWidth = 8 * bassBoost
          ctx.lineCap = 'round'
          ctx.lineJoin = 'round'
          ctx.shadowBlur = 20
          ctx.shadowColor = `hsla(${midColor}, 100%, 70%, 0.8)`

          ctx.beginPath()
          ctx.moveTo(touch.trail[0].x, touch.trail[0].y)
          touch.trail.forEach(point => {
            ctx.lineTo(point.x, point.y)
          })
          ctx.lineTo(touch.x, touch.y)
          ctx.stroke()

          ctx.shadowBlur = 0
        }

        // Center particle
        ctx.fillStyle = `hsla(${midColor + 180}, 100%, 90%, 0.9)`
        ctx.beginPath()
        ctx.arc(touch.x, touch.y, 4 * bassBoost, 0, Math.PI * 2)
        ctx.fill()
      })

      animationFrameRef.current = requestAnimationFrame(render)
    }

    // Event listeners
    canvas.addEventListener('touchstart', handleTouchStart, { passive: true })
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
    canvas.addEventListener('touchend', handleTouchEnd, { passive: true })

    // Support mouse for desktop testing
    canvas.addEventListener('mousedown', (e) => {
      handleTouchStart({
        touches: [{
          identifier: 'mouse',
          clientX: e.clientX,
          clientY: e.clientY
        }]
      })
    })
    canvas.addEventListener('mousemove', (e) => {
      if (e.buttons > 0) {
        handleTouchMove({
          preventDefault: () => {},
          touches: [{
            identifier: 'mouse',
            clientX: e.clientX,
            clientY: e.clientY
          }]
        })
      }
    })
    canvas.addEventListener('mouseup', () => {
      handleTouchEnd({
        changedTouches: [{ identifier: 'mouse' }]
      })
    })

    render()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [enabled, intensity, audioData])

  if (!enabled) return null

  return (
    <canvas 
      ref={canvasRef} 
      className="touch-fx-canvas"
    />
  )
}

export default TouchFX
