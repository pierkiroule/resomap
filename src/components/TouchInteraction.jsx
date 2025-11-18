import React, { useRef, useState, useEffect } from 'react'
import './TouchInteraction.css'

function TouchInteraction({ layer, audioData, onUpdateLayer, isPerformanceMode }) {
  const elementRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [touchStartDistance, setTouchStartDistance] = useState(null)
  const [touchStartAngle, setTouchStartAngle] = useState(null)

  // Apply audio-reactive modulations
  const getAudioModulatedValue = (baseValue, audioReactiveConfig) => {
    if (!audioReactiveConfig.enabled) return baseValue
    
    const audioLevel = audioData[audioReactiveConfig.source] || 0
    const range = audioReactiveConfig.max - audioReactiveConfig.min
    const modulation = audioReactiveConfig.min + (audioLevel * range * audioReactiveConfig.intensity)
    
    return modulation
  }

  const handleMouseDown = (e) => {
    if (!isPerformanceMode) return
    e.preventDefault()
    setIsDragging(true)
    setStartPos({
      x: e.clientX - layer.position.x,
      y: e.clientY - layer.position.y
    })
  }

  const handleMouseMove = (e) => {
    if (!isDragging || !isPerformanceMode) return
    e.preventDefault()
    
    const newX = e.clientX - startPos.x
    const newY = e.clientY - startPos.y
    
    onUpdateLayer(layer.id, {
      position: { x: newX, y: newY }
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e) => {
    if (!isPerformanceMode) return
    e.preventDefault()
    
    // Scroll to scale, Shift+Scroll to rotate, Ctrl+Scroll to blur
    if (e.ctrlKey) {
      const blurDelta = e.deltaY > 0 ? -0.5 : 0.5
      const newBlur = Math.max(0, Math.min(20, layer.filters.blur + blurDelta))
      onUpdateLayer(layer.id, {
        filters: { ...layer.filters, blur: newBlur }
      })
    } else if (e.shiftKey) {
      const rotationDelta = e.deltaY > 0 ? -5 : 5
      const newRotation = (layer.rotation + rotationDelta) % 360
      onUpdateLayer(layer.id, {
        rotation: newRotation < 0 ? 360 + newRotation : newRotation
      })
    } else {
      const scaleDelta = e.deltaY > 0 ? -0.05 : 0.05
      const newScale = Math.max(0.1, Math.min(5, layer.scale + scaleDelta))
      onUpdateLayer(layer.id, {
        scale: newScale
      })
    }
  }

  // Touch gestures for mobile
  const getTouchDistance = (touch1, touch2) => {
    const dx = touch1.clientX - touch2.clientX
    const dy = touch1.clientY - touch2.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  const getTouchAngle = (touch1, touch2) => {
    const dx = touch2.clientX - touch1.clientX
    const dy = touch2.clientY - touch1.clientY
    return Math.atan2(dy, dx) * 180 / Math.PI
  }

  const handleTouchStart = (e) => {
    if (!isPerformanceMode) return
    
    if (e.touches.length === 1) {
      setIsDragging(true)
      setStartPos({
        x: e.touches[0].clientX - layer.position.x,
        y: e.touches[0].clientY - layer.position.y
      })
    } else if (e.touches.length === 2) {
      const distance = getTouchDistance(e.touches[0], e.touches[1])
      const angle = getTouchAngle(e.touches[0], e.touches[1])
      setTouchStartDistance(distance)
      setTouchStartAngle(angle)
    }
  }

  const handleTouchMove = (e) => {
    if (!isPerformanceMode) return
    e.preventDefault()
    
    if (e.touches.length === 1 && isDragging) {
      const newX = e.touches[0].clientX - startPos.x
      const newY = e.touches[0].clientY - startPos.y
      
      onUpdateLayer(layer.id, {
        position: { x: newX, y: newY }
      })
    } else if (e.touches.length === 2 && touchStartDistance) {
      const currentDistance = getTouchDistance(e.touches[0], e.touches[1])
      const currentAngle = getTouchAngle(e.touches[0], e.touches[1])
      
      // Pinch to scale
      const scaleFactor = currentDistance / touchStartDistance
      const newScale = Math.max(0.1, Math.min(5, layer.scale * scaleFactor))
      
      // Rotate gesture
      const angleDelta = currentAngle - touchStartAngle
      const newRotation = (layer.rotation + angleDelta) % 360
      
      onUpdateLayer(layer.id, {
        scale: newScale,
        rotation: newRotation < 0 ? 360 + newRotation : newRotation
      })
      
      setTouchStartDistance(currentDistance)
      setTouchStartAngle(currentAngle)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    setTouchStartDistance(null)
    setTouchStartAngle(null)
  }

  // Apply audio-reactive effects
  const getInteractiveStyle = () => {
    const ar = layer.audioReactive
    
    return {
      opacity: ar.opacity.enabled ? getAudioModulatedValue(layer.opacity, ar.opacity) : layer.opacity,
      transform: `
        translate(-50%, -50%) 
        translate(${layer.position.x}px, ${layer.position.y}px) 
        scale(${ar.scale.enabled ? getAudioModulatedValue(layer.scale, ar.scale) : layer.scale}) 
        rotate(${ar.rotation.enabled ? getAudioModulatedValue(layer.rotation, ar.rotation) : layer.rotation}deg)
      `,
      filter: buildFilterString(),
      mixBlendMode: layer.blendMode,
      cursor: isPerformanceMode ? (isDragging ? 'grabbing' : 'grab') : 'default',
      pointerEvents: isPerformanceMode ? 'auto' : 'none',
      transition: isDragging ? 'none' : 'transform 0.1s ease-out, filter 0.05s ease-out'
    }
  }

  const buildFilterString = () => {
    const f = layer.filters
    const ar = layer.audioReactive
    const filters = []
    
    const blur = ar.blur.enabled ? getAudioModulatedValue(f.blur, ar.blur) : f.blur
    const brightness = ar.brightness.enabled ? getAudioModulatedValue(f.brightness, ar.brightness) : f.brightness
    const hueRotate = ar.hueRotate.enabled ? getAudioModulatedValue(f.hueRotate, ar.hueRotate) : f.hueRotate
    
    if (blur > 0) filters.push(`blur(${blur}px)`)
    if (brightness !== 100) filters.push(`brightness(${brightness}%)`)
    if (f.contrast !== 100) filters.push(`contrast(${f.contrast}%)`)
    if (f.saturate !== 100) filters.push(`saturate(${f.saturate}%)`)
    if (hueRotate !== 0) filters.push(`hue-rotate(${hueRotate}deg)`)
    if (f.grayscale > 0) filters.push(`grayscale(${f.grayscale}%)`)
    if (f.sepia > 0) filters.push(`sepia(${f.sepia}%)`)
    if (f.invert > 0) filters.push(`invert(${f.invert}%)`)
    
    return filters.length > 0 ? filters.join(' ') : 'none'
  }

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    element.addEventListener('wheel', handleWheel, { passive: false })
    
    return () => {
      element.removeEventListener('wheel', handleWheel)
    }
  }, [layer, isPerformanceMode])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, startPos, layer, isPerformanceMode])

  return (
    <div
      ref={elementRef}
      className={`interactive-layer ${isPerformanceMode ? 'performance-mode' : ''}`}
      style={getInteractiveStyle()}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {layer.children}
    </div>
  )
}

export default TouchInteraction
