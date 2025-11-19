import React, { useState, useRef, useEffect } from 'react'
import DrawingCanvas from './DrawingCanvas'
import ModeSelector from './ModeSelector'
import AudioSourceSelector from './AudioSourceSelector'
import PingPongVideo from './PingPongVideo'
import VJingDrawMode from './VJingDrawMode'
import { calculateEffects, applyEffectsToLayer } from '../utils/effectModes'
import './ArtisticVJ.css'

/**
 * ArtisticVJ - Composant principal pour le VJ tactile artistique
 * 
 * Trois modes :
 * 1. MODE SELECTION : Gérer les calques, choisir le mode
 * 2. MODE VJING DRAW : Plein écran immersif pour performer
 * 3. MODE EDITOR : Ajuster les paramètres
 */
function ArtisticVJ({ layers, audioData, onUpdateLayer, audioAnalyzer, onAudioSelect, currentAudioName }) {
  const [currentMode, setCurrentMode] = useState('psychedelic')
  const [isVJingDrawMode, setIsVJingDrawMode] = useState(false)
  const [isEditorMode, setIsEditorMode] = useState(false)
  const [selectedLayerId, setSelectedLayerId] = useState(null)
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

  // Animation continue TOUJOURS ACTIVE (audio-réactivité permanente)
  useEffect(() => {
    if (!layers.length) return
    if (isEditorMode) return // Pas d'animation en mode Editor

    const animate = () => {
      // Créer un pseudo shape data basé sur audio pour animation continue
      const pseudoShapeData = {
        shape: 'circle',
        velocity: (audioData.overall || 0) * 500,
        points: [
          { x: 0.5, y: 0.5 },
          { x: 0.5 + (audioData.mid || 0) * 0.1, y: 0.5 + (audioData.high || 0) * 0.1 }
        ],
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
  }, [currentMode, audioData, layers, onUpdateLayer, isEditorMode])

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

  // Si en mode VJing Draw, afficher le mode immersif
  if (isVJingDrawMode) {
    return (
      <VJingDrawMode
        layers={layers}
        audioData={audioData}
        currentMode={currentMode}
        onShapeDetected={handleShapeDetected}
        onUpdateLayer={onUpdateLayer}
        onExitMode={() => setIsVJingDrawMode(false)}
      />
    )
  }

  // Si en mode Editor
  if (isEditorMode) {
    const selectedLayer = layers.find(l => l.id === selectedLayerId)
    
    return (
      <div className="artistic-vj editor-mode">
        <div className="editor-container">
          <header className="editor-header">
            <button className="back-btn" onClick={() => setIsEditorMode(false)}>
              ← Retour
            </button>
            <h2>🛠️ Mode Editor</h2>
          </header>
          
          <div className="editor-content">
            {/* Layers list */}
            <div className="editor-section">
              <h3>Layers ({layers.length})</h3>
              <div className="layers-list">
                {layers.map((layer, index) => (
                  <div 
                    key={layer.id} 
                    className={`layer-card ${selectedLayerId === layer.id ? 'selected' : ''}`}
                    onClick={() => setSelectedLayerId(layer.id)}
                  >
                    <span className="layer-index">{index + 1}</span>
                    <span className="layer-name">{layer.name}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        onUpdateLayer(layer.id, { visible: !layer.visible })
                      }}
                    >
                      {layer.visible ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Layer properties */}
            {selectedLayer && (
              <div className="editor-section">
                <h3>🎨 {selectedLayer.name}</h3>
                
                {/* Blend Mode */}
                <div className="control-group">
                  <label>Blend Mode</label>
                  <select
                    value={selectedLayer.blendMode || 'normal'}
                    onChange={(e) => onUpdateLayer(selectedLayer.id, { blendMode: e.target.value })}
                  >
                    <option value="normal">Normal</option>
                    <option value="multiply">Multiply</option>
                    <option value="screen">Screen</option>
                    <option value="overlay">Overlay</option>
                    <option value="darken">Darken</option>
                    <option value="lighten">Lighten</option>
                    <option value="color-dodge">Color Dodge</option>
                    <option value="color-burn">Color Burn</option>
                    <option value="hard-light">Hard Light</option>
                    <option value="soft-light">Soft Light</option>
                    <option value="difference">Difference</option>
                    <option value="exclusion">Exclusion</option>
                    <option value="hue">Hue</option>
                    <option value="saturation">Saturation</option>
                    <option value="color">Color</option>
                    <option value="luminosity">Luminosity</option>
                  </select>
                </div>
                
                {/* Opacity */}
                <div className="control-group">
                  <label>Opacity: {Math.round((selectedLayer.opacity || 1) * 100)}%</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={selectedLayer.opacity || 1}
                    onChange={(e) => onUpdateLayer(selectedLayer.id, { opacity: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
            )}
            
            {/* Mode selector */}
            <div className="editor-section">
              <h3>Mode: {currentMode}</h3>
              <ModeSelector 
                currentMode={currentMode}
                onModeChange={setCurrentMode}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Sinon, mode Selection
  return (
    <div className="artistic-vj selection-mode">
      {/* Mode Selector - Floating top-left */}
      <div className="mode-selector-container">
        {/* Audio Source Selector */}
        <AudioSourceSelector
          onAudioSelect={onAudioSelect}
          currentAudioName={currentAudioName}
        />
        
        <ModeSelector 
          currentMode={currentMode}
          onModeChange={setCurrentMode}
        />
        
        {/* START VJing button */}
        {layers.length > 0 && (
          <button 
            className="start-vjing-btn"
            onClick={() => setIsVJingDrawMode(true)}
          >
            <span className="btn-icon">🎨</span>
            <span className="btn-text">START VJing Draw</span>
          </button>
        )}
        
        {/* Editor button */}
        <button 
          className="editor-btn"
          onClick={() => setIsEditorMode(true)}
        >
          <span className="btn-icon">🛠️</span>
          <span className="btn-text">Mode Editor</span>
        </button>
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
