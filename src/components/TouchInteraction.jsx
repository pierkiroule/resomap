import React, { useRef, useState, useEffect } from 'react'
import './TouchInteraction.css'

function TouchInteraction({ layer, audioData, onUpdateLayer, isPerformanceMode }) {
  const elementRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [touchStartDistance, setTouchStartDistance] = useState(null)
  const [touchStartAngle, setTouchStartAngle] = useState(null)
  
  // Advanced touch gesture states
  const [touchTrails, setTouchTrails] = useState([])
  const [lastTapTime, setLastTapTime] = useState(0)
  const [tapCount, setTapCount] = useState(0)
  const [longPressTimer, setLongPressTimer] = useState(null)
  const [isLongPress, setIsLongPress] = useState(false)
  const [touchVelocity, setTouchVelocity] = useState({ x: 0, y: 0 })
  const [lastTouchPos, setLastTouchPos] = useState({ x: 0, y: 0, time: 0 })
  const [glitchEffect, setGlitchEffect] = useState(0)
  const [rgbSplitEffect, setRgbSplitEffect] = useState(0)
  const [trailEffect, setTrailEffect] = useState(0)

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
    
    const touch = e.touches[0]
    const currentTime = Date.now()
    
    if (e.touches.length === 1) {
      setIsDragging(true)
      setStartPos({
        x: touch.clientX - layer.position.x,
        y: touch.clientY - layer.position.y
      })
      
      // Initialize velocity tracking
      setLastTouchPos({ x: touch.clientX, y: touch.clientY, time: currentTime })
      
      // Detect double-tap
      if (currentTime - lastTapTime < 300) {
        setTapCount(prev => prev + 1)
        handleDoubleTap(touch.clientX, touch.clientY)
      } else {
        setTapCount(1)
      }
      setLastTapTime(currentTime)
      
      // Start long-press detection
      const timer = setTimeout(() => {
        setIsLongPress(true)
        handleLongPress(touch.clientX, touch.clientY)
      }, 500)
      setLongPressTimer(timer)
      
      // Add touch trail
      addTouchTrail(touch.clientX, touch.clientY)
      
    } else if (e.touches.length === 2) {
      clearTimeout(longPressTimer)
      const distance = getTouchDistance(e.touches[0], e.touches[1])
      const angle = getTouchAngle(e.touches[0], e.touches[1])
      setTouchStartDistance(distance)
      setTouchStartAngle(angle)
    } else if (e.touches.length === 3) {
      // 3-finger tap: trigger glitch effect
      triggerGlitchEffect()
    } else if (e.touches.length === 4) {
      // 4-finger tap: trigger RGB split effect
      triggerRGBSplitEffect()
    }
  }

  const handleTouchMove = (e) => {
    if (!isPerformanceMode) return
    e.preventDefault()
    
    const touch = e.touches[0]
    const currentTime = Date.now()
    
    if (e.touches.length === 1 && isDragging) {
      // Cancel long-press if moved
      if (longPressTimer && !isLongPress) {
        clearTimeout(longPressTimer)
      }
      
      const newX = touch.clientX - startPos.x
      const newY = touch.clientY - startPos.y
      
      // Calculate velocity for dynamic effects
      const timeDelta = currentTime - lastTouchPos.time
      if (timeDelta > 0) {
        const vx = (touch.clientX - lastTouchPos.x) / timeDelta
        const vy = (touch.clientY - lastTouchPos.y) / timeDelta
        setTouchVelocity({ x: vx, y: vy })
        
        // Apply velocity-based trail effect
        const speed = Math.sqrt(vx * vx + vy * vy)
        if (speed > 0.5) {
          setTrailEffect(Math.min(1, speed / 2))
        }
      }
      
      setLastTouchPos({ x: touch.clientX, y: touch.clientY, time: currentTime })
      
      // Add touch trail
      addTouchTrail(touch.clientX, touch.clientY)
      
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

  const handleTouchEnd = (e) => {
    clearTimeout(longPressTimer)
    
    // Detect swipe gesture based on velocity
    const speed = Math.sqrt(touchVelocity.x * touchVelocity.x + touchVelocity.y * touchVelocity.y)
    if (speed > 1) {
      handleSwipe(touchVelocity, speed)
    }
    
    setIsDragging(false)
    setTouchStartDistance(null)
    setTouchStartAngle(null)
    setIsLongPress(false)
    setTouchVelocity({ x: 0, y: 0 })
    
    // Fade out trail effect
    setTimeout(() => setTrailEffect(0), 100)
  }

  // Apply audio-reactive effects
  const getInteractiveStyle = () => {
    const ar = layer.audioReactive
    
    // RGB split effect using drop-shadow
    let dropShadow = ''
    if (rgbSplitEffect > 0) {
      const offset = rgbSplitEffect * 5
      dropShadow = `drop-shadow(${offset}px 0 red) drop-shadow(-${offset}px 0 cyan)`
    }
    
    return {
      opacity: ar.opacity.enabled ? getAudioModulatedValue(layer.opacity, ar.opacity) : layer.opacity,
      transform: `
        translate(-50%, -50%) 
        translate(${layer.position.x}px, ${layer.position.y}px) 
        scale(${ar.scale.enabled ? getAudioModulatedValue(layer.scale, ar.scale) : layer.scale}) 
        rotate(${ar.rotation.enabled ? getAudioModulatedValue(layer.rotation, ar.rotation) : layer.rotation}deg)
      `,
      filter: `${buildFilterString()}${dropShadow ? ' ' + dropShadow : ''}`,
      mixBlendMode: layer.blendMode,
      cursor: isPerformanceMode ? (isDragging ? 'grabbing' : 'grab') : 'default',
      pointerEvents: isPerformanceMode ? 'auto' : 'none',
      transition: isDragging ? 'none' : 'transform 0.1s ease-out, filter 0.05s ease-out',
      // Add trail effect with pseudo-element simulation
      boxShadow: trailEffect > 0 ? `0 0 ${trailEffect * 20}px rgba(255,255,255,${trailEffect * 0.5})` : 'none'
    }
  }

  // Advanced touch gesture handlers
  const addTouchTrail = (x, y) => {
    const trail = { x, y, id: Date.now(), opacity: 1 }
    setTouchTrails(prev => [...prev, trail])
    
    // Remove trail after animation
    setTimeout(() => {
      setTouchTrails(prev => prev.filter(t => t.id !== trail.id))
    }, 500)
  }
  
  const handleDoubleTap = (x, y) => {
    // Double-tap: Reset to default position and scale
    onUpdateLayer(layer.id, {
      position: { x: 0, y: 0 },
      scale: 1,
      rotation: 0
    })
  }
  
  const handleLongPress = (x, y) => {
    // Long press: Apply intense audio-reactive effect
    triggerGlitchEffect()
  }
  
  const handleSwipe = (velocity, speed) => {
    // Fast swipe: Apply momentum-based rotation
    const momentumRotation = speed * 50
    const newRotation = (layer.rotation + momentumRotation) % 360
    
    onUpdateLayer(layer.id, {
      rotation: newRotation < 0 ? 360 + newRotation : newRotation
    })
    
    // Trigger visual effect based on swipe
    if (speed > 2) {
      triggerRGBSplitEffect()
    }
  }
  
  const triggerGlitchEffect = () => {
    setGlitchEffect(1)
    setTimeout(() => setGlitchEffect(0), 200)
  }
  
  const triggerRGBSplitEffect = () => {
    setRgbSplitEffect(1)
    setTimeout(() => setRgbSplitEffect(0), 300)
  }
  
  const buildFilterString = () => {
    const f = layer.filters
    const ar = layer.audioReactive
    const filters = []
    
    const blur = ar.blur.enabled ? getAudioModulatedValue(f.blur, ar.blur) : f.blur
    const brightness = ar.brightness.enabled ? getAudioModulatedValue(f.brightness, ar.brightness) : f.brightness
    const hueRotate = ar.hueRotate.enabled ? getAudioModulatedValue(f.hueRotate, ar.hueRotate) : f.hueRotate
    
    // Add velocity-based blur
    const velocityBlur = trailEffect * 5
    const totalBlur = blur + velocityBlur
    
    // Add glitch effect
    if (glitchEffect > 0) {
      const glitchOffset = glitchEffect * 20
      filters.push(`contrast(${100 + glitchEffect * 50}%)`)
    }
    
    if (totalBlur > 0) filters.push(`blur(${totalBlur}px)`)
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
    <>
      <div
        ref={elementRef}
        className={`interactive-layer ${isPerformanceMode ? 'performance-mode' : ''} ${glitchEffect > 0 ? 'glitch-active' : ''}`}
        style={getInteractiveStyle()}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {layer.children}
      </div>
      
      {/* Touch trails visualization */}
      {isPerformanceMode && touchTrails.map(trail => (
        <div
          key={trail.id}
          className="touch-trail"
          style={{
            position: 'fixed',
            left: trail.x,
            top: trail.y,
            pointerEvents: 'none',
            zIndex: 9999
          }}
        />
      ))}
      
      {/* Long press indicator */}
      {isLongPress && (
        <div className="long-press-indicator" style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 9999
        }} />
      )}
    </>
  )
}

export default TouchInteraction
