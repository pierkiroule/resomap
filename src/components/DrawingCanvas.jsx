import React, { useRef, useEffect, useState } from 'react'
import './DrawingCanvas.css'

/**
 * DrawingCanvas - Surface de dessin tactile artistique
 * 
 * Fonctionnalités :
 * - Multi-touch trails avec couleurs uniques
 * - Détection de formes (circle, line, zigzag, spiral)
 * - Système de particules
 * - Audio-reactive glow
 * - Fade out automatique des trails
 */
function DrawingCanvas({ onShapeDetected, audioData, mode }) {
  const canvasRef = useRef(null)
  const trailsRef = useRef([]) // Tous les trails actifs
  const activeTrailsRef = useRef(new Map()) // Trails en cours de dessin (par touchId)
  const animationFrameRef = useRef(null)

  // Détection de forme
  const detectShape = (points) => {
    if (points.length < 10) return 'dot'

    // Calculer bounding box et ratios
    const xs = points.map(p => p.x)
    const ys = points.map(p => p.y)
    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)
    const width = maxX - minX
    const height = maxY - minY
    const aspectRatio = width / Math.max(height, 1)

    // Calculer courbure totale
    let totalCurvature = 0
    for (let i = 1; i < points.length - 1; i++) {
      const angle = Math.atan2(
        points[i + 1].y - points[i].y,
        points[i + 1].x - points[i].x
      ) - Math.atan2(
        points[i].y - points[i - 1].y,
        points[i].x - points[i - 1].x
      )
      totalCurvature += Math.abs(angle)
    }

    // Détection
    if (aspectRatio > 3 || aspectRatio < 0.33) {
      // Ligne droite (aspect ratio extrême)
      return totalCurvature < Math.PI ? 'line' : 'zigzag'
    } else if (aspectRatio > 0.7 && aspectRatio < 1.3) {
      // Forme carrée/circulaire
      if (totalCurvature > Math.PI * 3) {
        return 'spiral'
      } else if (totalCurvature > Math.PI * 1.5) {
        return 'circle'
      }
    }

    // Zigzag si beaucoup de changements de direction
    return totalCurvature > Math.PI * 2 ? 'zigzag' : 'curve'
  }

  // Calculer vélocité moyenne
  const calculateVelocity = (points) => {
    if (points.length < 2) return 0
    
    let totalDist = 0
    let totalTime = 0
    
    for (let i = 1; i < points.length; i++) {
      const dx = points[i].x - points[i - 1].x
      const dy = points[i].y - points[i - 1].y
      const dist = Math.sqrt(dx * dx + dy * dy)
      const time = points[i].time - points[i - 1].time
      
      totalDist += dist
      totalTime += time
    }
    
    return totalTime > 0 ? totalDist / totalTime : 0
  }

  // Gérer les événements tactiles
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()

    const getTouchPos = (touch) => ({
      x: (touch.clientX - rect.left) / rect.width,
      y: (touch.clientY - rect.top) / rect.height,
      time: Date.now()
    })

    const handleTouchStart = (e) => {
      e.preventDefault()
      
      Array.from(e.changedTouches).forEach(touch => {
        const pos = getTouchPos(touch)
        
        // Créer nouveau trail
        const trail = {
          id: touch.identifier,
          points: [pos],
          color: `hsl(${Math.random() * 360}, 80%, 60%)`,
          startTime: Date.now(),
          active: true
        }
        
        activeTrailsRef.current.set(touch.identifier, trail)
        trailsRef.current.push(trail)
      })
    }

    const handleTouchMove = (e) => {
      e.preventDefault()
      
      Array.from(e.changedTouches).forEach(touch => {
        const trail = activeTrailsRef.current.get(touch.identifier)
        if (trail) {
          const pos = getTouchPos(touch)
          trail.points.push(pos)
        }
      })
    }

    const handleTouchEnd = (e) => {
      e.preventDefault()
      
      Array.from(e.changedTouches).forEach(touch => {
        const trail = activeTrailsRef.current.get(touch.identifier)
        if (trail) {
          trail.active = false
          trail.endTime = Date.now()
          
          // Détecter forme et notifier
          const shape = detectShape(trail.points)
          const velocity = calculateVelocity(trail.points)
          
          onShapeDetected?.({
            shape,
            velocity,
            points: trail.points,
            color: trail.color,
            duration: trail.endTime - trail.startTime
          })
          
          activeTrailsRef.current.delete(touch.identifier)
        }
      })
    }

    // Support souris pour desktop
    let mouseTrailId = 'mouse'
    let isMouseDown = false

    const handleMouseDown = (e) => {
      isMouseDown = true
      const pos = getTouchPos(e)
      
      const trail = {
        id: mouseTrailId,
        points: [pos],
        color: `hsl(${Math.random() * 360}, 80%, 60%)`,
        startTime: Date.now(),
        active: true
      }
      
      activeTrailsRef.current.set(mouseTrailId, trail)
      trailsRef.current.push(trail)
    }

    const handleMouseMove = (e) => {
      if (!isMouseDown) return
      
      const trail = activeTrailsRef.current.get(mouseTrailId)
      if (trail) {
        const pos = getTouchPos(e)
        trail.points.push(pos)
      }
    }

    const handleMouseUp = (e) => {
      if (!isMouseDown) return
      isMouseDown = false
      
      const trail = activeTrailsRef.current.get(mouseTrailId)
      if (trail) {
        trail.active = false
        trail.endTime = Date.now()
        
        const shape = detectShape(trail.points)
        const velocity = calculateVelocity(trail.points)
        
        onShapeDetected?.({
          shape,
          velocity,
          points: trail.points,
          color: trail.color,
          duration: trail.endTime - trail.startTime
        })
        
        activeTrailsRef.current.delete(mouseTrailId)
      }
    }

    // Event listeners
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false })
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false })
    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseup', handleMouseUp)

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('touchend', handleTouchEnd)
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseup', handleMouseUp)
    }
  }, [onShapeDetected])

  // Animation loop pour render les trails
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, rect.width, rect.height)

      const now = Date.now()
      const trailLifetime = 2000 // 2 secondes

      // Render tous les trails
      trailsRef.current = trailsRef.current.filter(trail => {
        const age = now - (trail.endTime || now)
        if (!trail.active && age > trailLifetime) return false

        const opacity = trail.active ? 1 : 1 - (age / trailLifetime)
        
        if (trail.points.length < 2) return true

        // Audio-reactive glow
        const bass = audioData?.bass || 0
        const glowSize = 10 + bass * 30

        ctx.strokeStyle = trail.color
        ctx.lineWidth = 3 + bass * 5
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.globalAlpha = opacity

        // Glow effect
        ctx.shadowColor = trail.color
        ctx.shadowBlur = glowSize
        
        // Draw trail path
        ctx.beginPath()
        const firstPoint = trail.points[0]
        ctx.moveTo(firstPoint.x * rect.width, firstPoint.y * rect.height)
        
        for (let i = 1; i < trail.points.length; i++) {
          const point = trail.points[i]
          ctx.lineTo(point.x * rect.width, point.y * rect.height)
        }
        
        ctx.stroke()

        // Draw points pour effet de particules
        trail.points.forEach((point, i) => {
          if (i % 5 === 0) { // Un point sur 5
            const pointOpacity = opacity * (1 - i / trail.points.length) * 0.5
            ctx.globalAlpha = pointOpacity
            ctx.fillStyle = trail.color
            ctx.beginPath()
            ctx.arc(
              point.x * rect.width,
              point.y * rect.height,
              2 + bass * 3,
              0,
              Math.PI * 2
            )
            ctx.fill()
          }
        })

        return true
      })

      ctx.globalAlpha = 1
      ctx.shadowBlur = 0

      animationFrameRef.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [audioData])

  return (
    <canvas 
      ref={canvasRef} 
      className="drawing-canvas"
      style={{ touchAction: 'none' }}
    />
  )
}

export default DrawingCanvas
