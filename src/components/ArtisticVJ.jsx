import React, { useState, useRef, useEffect } from 'react'
import DrawingCanvas from './DrawingCanvas'
import ModeSelector from './ModeSelector'
import { calculateEffects, applyEffectsToLayer } from '../utils/effectModes'
import './ArtisticVJ.css'

/**
 * ArtisticVJ - Composant principal pour le VJ tactile artistique
 * 
 * Intègre :
 * - DrawingCanvas pour les trails tactiles
 * - Rendu des vidéos/images avec effets
 * - Modes prédéfinis
 * - Audio-réactivité automatique
 */
function ArtisticVJ({ layers, audioData, onUpdateLayer }) {
  const [currentMode, setCurrentMode] = useState('psychedelic')
  const [currentShapeData, setCurrentShapeData] = useState(null)
  const canvasRef = useRef(null)
  const animationFrameRef = useRef(null)

  // Gérer la détection de forme depuis DrawingCanvas
  const handleShapeDetected = (shapeData) => {
    console.log('🎨 Shape detected:', shapeData.shape, 'velocity:', shapeData.velocity)
    setCurrentShapeData(shapeData)
    
    // Reset après 1 seconde pour permettre de nouveaux traits
    setTimeout(() => {
      setCurrentShapeData(null)
    }, 1000)
  }

  // Appliquer les effets aux layers en temps réel
  useEffect(() => {
    if (!currentShapeData || !layers.length) return

    const effects = calculateEffects(currentMode, currentShapeData, audioData)
    
    // Appliquer à tous les layers visibles
    layers.forEach(layer => {
      if (layer.visible) {
        const updatedLayer = applyEffectsToLayer(layer, effects)
        onUpdateLayer(layer.id, {
          filters: updatedLayer.filters,
          transform: updatedLayer.transform,
          opacity: updatedLayer.opacity
        })
      }
    })
  }, [currentShapeData, currentMode, audioData, layers, onUpdateLayer])

  // Animation continue pour modes time-based (psychedelic, vortex)
  useEffect(() => {
    if (!['psychedelic', 'vortex'].includes(currentMode)) return
    if (!layers.length) return

    const animate = () => {
      // Créer un pseudo shape data pour l'animation continue
      const pseudoShapeData = {
        shape: 'circle',
        velocity: 0,
        points: [{ x: 0.5, y: 0.5 }],
        duration: 1000
      }

      const effects = calculateEffects(currentMode, pseudoShapeData, audioData)
      
      layers.forEach(layer => {
        if (layer.visible) {
          const updatedLayer = applyEffectsToLayer(layer, effects)
          onUpdateLayer(layer.id, {
            filters: updatedLayer.filters,
            transform: updatedLayer.transform
          })
        }
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [currentMode, audioData, layers, onUpdateLayer])

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
        <video
          key={layer.id}
          src={layer.src}
          autoPlay
          loop
          muted
          className="artistic-layer"
          style={style}
        />
      )
    } else if (layer.type === 'image' || layer.type === 'gif') {
      return (
        <img
          key={layer.id}
          src={layer.src}
          alt={layer.name}
          className="artistic-layer"
          style={style}
        />
      )
    } else if (layer.type === 'audio') {
      return (
        <div key={layer.id} className="audio-layer" style={style}>
          <audio src={layer.src} autoPlay loop />
          <div className="audio-visualizer-artistic">
            <div className="audio-icon">🎵</div>
            <div className="audio-bars">
              <div 
                className="audio-bar bass" 
                style={{ height: `${(audioData?.bass || 0) * 100}%` }}
              />
              <div 
                className="audio-bar mid" 
                style={{ height: `${(audioData?.mid || 0) * 100}%` }}
              />
              <div 
                className="audio-bar high" 
                style={{ height: `${(audioData?.high || 0) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )
    }
    
    return null
  }

  return (
    <div className="artistic-vj">
      {/* Mode Selector - Floating top-left */}
      <div className="mode-selector-container">
        <ModeSelector 
          currentMode={currentMode}
          onModeChange={setCurrentMode}
        />
      </div>

      {/* Audio visualizer - Floating bottom */}
      {audioData && (
        <div className="audio-visualizer-bottom">
          <div className="audio-level">
            <span className="audio-label">🔊 Bass</span>
            <div className="audio-level-bar">
              <div 
                className="audio-level-fill bass" 
                style={{ width: `${audioData.bass * 100}%` }}
              />
            </div>
          </div>
          <div className="audio-level">
            <span className="audio-label">🎵 Mid</span>
            <div className="audio-level-bar">
              <div 
                className="audio-level-fill mid" 
                style={{ width: `${audioData.mid * 100}%` }}
              />
            </div>
          </div>
          <div className="audio-level">
            <span className="audio-label">✨ High</span>
            <div className="audio-level-bar">
              <div 
                className="audio-level-fill high" 
                style={{ width: `${audioData.high * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main canvas - Layers + Drawing */}
      <div className="artistic-canvas" ref={canvasRef}>
        {layers.length === 0 ? (
          <div className="empty-canvas">
            <h2>🌙 Bienvenue sur RESOMAP</h2>
            <p>Ajoute des médias pour commencer</p>
            <p className="hint">👆 Dessine avec ton doigt pour créer de la magie</p>
          </div>
        ) : (
          <>
            {/* Render layers */}
            <div className="layers-container">
              {layers.filter(l => l.visible).map(renderLayer)}
            </div>
            
            {/* Drawing canvas overlay */}
            <DrawingCanvas
              onShapeDetected={handleShapeDetected}
              audioData={audioData}
              mode={currentMode}
            />
          </>
        )}
      </div>

      {/* Instructions hint */}
      {layers.length > 0 && (
        <div className="instructions-hint">
          <span className="hint-icon">💡</span>
          <span className="hint-text">
            Dessine sur l'écran comme un patineur sur glace ⛸️
          </span>
        </div>
      )}
    </div>
  )
}

export default ArtisticVJ
