import React from 'react'
import DrawingCanvas from './DrawingCanvas'
import PingPongVideo from './PingPongVideo'
import { calculateEffects, applyEffectsToLayer } from '../utils/effectModes'
import './VJingDrawMode.css'

/**
 * VJingDrawMode - Mode VJing Draw immersif
 * 
 * Plein écran, sans distraction, juste dessiner et créer !
 */
function VJingDrawMode({ 
  layers, 
  audioData, 
  currentMode, 
  onShapeDetected,
  onUpdateLayer,
  onExitMode 
}) {
  // Build CSS filter string from filters object
  const buildFilterString = (filters) => {
    if (!filters) return 'none'
    
    const parts = []
    if (filters.hueRotate) parts.push(`hue-rotate(${filters.hueRotate}deg)`)
    if (filters.saturate !== undefined) parts.push(`saturate(${filters.saturate}%)`)
    if (filters.brightness !== undefined) parts.push(`brightness(${filters.brightness}%)`)
    if (filters.contrast !== undefined) parts.push(`contrast(${filters.contrast}%)`)
    if (filters.blur) parts.push(`blur(${filters.blur}px)`)
    if (filters.invert) parts.push(`invert(${filters.invert}%)`)
    
    return parts.length > 0 ? parts.join(' ') : 'none'
  }

  // Build CSS transform string
  const buildTransformString = (transform) => {
    if (!transform) return 'none'
    
    const parts = []
    
    if (transform.translateX || transform.translateY) {
      parts.push(`translate(${transform.translateX || 0}px, ${transform.translateY || 0}px)`)
    }
    
    if (transform.rotation) {
      parts.push(`rotate(${transform.rotation}deg)`)
    }
    
    if (transform.scale) {
      if (typeof transform.scale === 'object') {
        parts.push(`scale(${transform.scale.x}, ${transform.scale.y})`)
      } else {
        parts.push(`scale(${transform.scale})`)
      }
    }
    
    return parts.length > 0 ? parts.join(' ') : 'none'
  }

  // Rendu des layers avec effets
  const renderLayer = (layer) => {
    const style = {
      filter: buildFilterString(layer.filters),
      transform: buildTransformString(layer.transform),
      opacity: layer.opacity || 1,
      mixBlendMode: layer.blendMode || 'normal'
    }

    // Render selon le type
    if (layer.type === 'video') {
      return (
        <PingPongVideo
          key={layer.id}
          src={layer.src}
          layerId={layer.id}
          className="vjing-layer"
          style={style}
        />
      )
    } else if (layer.type === 'image' || layer.type === 'gif') {
      return (
        <img
          key={layer.id}
          src={layer.src}
          alt={layer.name}
          className="vjing-layer"
          style={style}
        />
      )
    } else if (layer.type === 'audio') {
      return (
        <audio key={layer.id} src={layer.src} autoPlay loop />
      )
    }
    
    return null
  }

  // Gérer double-tap pour sortir
  const lastTapRef = React.useRef(0)
  
  const handleDoubleTap = () => {
    const now = Date.now()
    const DOUBLE_TAP_DELAY = 300 // ms
    
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double tap détecté
      onExitMode()
    }
    
    lastTapRef.current = now
  }
  
  // Gérer ESC pour sortir
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onExitMode()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onExitMode])

  return (
    <div className="vjing-draw-mode" onClick={handleDoubleTap}>
      {/* AUCUN BOUTON - Fullscreen pur */}
      
      {/* Layers container */}
      <div className="vjing-canvas">
        {layers.filter(l => l.visible).map(renderLayer)}
        
        {/* Drawing canvas overlay */}
        <DrawingCanvas
          onShapeDetected={onShapeDetected}
          audioData={audioData}
          mode={currentMode}
        />
      </div>
    </div>
  )
}

export default VJingDrawMode
