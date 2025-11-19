import React, { useRef, useState, useEffect } from 'react'
import Layer from './Layer'
import TouchInteraction from './TouchInteraction'
import './PerformMode.css'

function PerformMode({ layers, audioData, onUpdateLayer, scenes, currentSceneIndex, onSceneChange }) {
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef(null)
  const hideControlsTimer = useRef(null)

  // Auto-hide controls after 3 seconds of inactivity
  useEffect(() => {
    const resetTimer = () => {
      setShowControls(true)
      clearTimeout(hideControlsTimer.current)
      hideControlsTimer.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }

    window.addEventListener('mousemove', resetTimer)
    window.addEventListener('touchstart', resetTimer)
    
    resetTimer()

    return () => {
      clearTimeout(hideControlsTimer.current)
      window.removeEventListener('mousemove', resetTimer)
      window.removeEventListener('touchstart', resetTimer)
    }
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // ESC to exit fullscreen
      if (e.key === 'Escape' && isFullscreen) {
        exitFullscreen()
      }
      
      // F11 to toggle fullscreen
      if (e.key === 'F11') {
        e.preventDefault()
        toggleFullscreen()
      }
      
      // Number keys 1-9 for scene switching
      if (e.key >= '1' && e.key <= '9') {
        const sceneIndex = parseInt(e.key) - 1
        if (sceneIndex < scenes.length) {
          onSceneChange(sceneIndex)
        }
      }
      
      // Arrow keys for scene navigation
      if (e.key === 'ArrowLeft' && currentSceneIndex > 0) {
        onSceneChange(currentSceneIndex - 1)
      }
      if (e.key === 'ArrowRight' && currentSceneIndex < scenes.length - 1) {
        onSceneChange(currentSceneIndex + 1)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isFullscreen, currentSceneIndex, scenes.length])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <div 
      ref={containerRef}
      className={`perform-mode ${isFullscreen ? 'fullscreen' : ''}`}
    >
      {/* Main Performance Canvas */}
      <div className="perform-canvas">
        {layers.map((layer) => (
          layer.visible && (
            <TouchInteraction
              key={layer.id}
              layer={layer}
              audioData={audioData}
              onUpdateLayer={onUpdateLayer}
              isPerformanceMode={true}
            >
              <Layer 
                layer={layer}
                audioData={audioData}
              />
            </TouchInteraction>
          )
        ))}
        
        {layers.length === 0 && (
          <div className="perform-empty">
            <div className="empty-icon">🎭</div>
            <p>Mode Performance Activé</p>
            <p className="empty-hint">Ajoutez des calques pour commencer</p>
          </div>
        )}
      </div>

      {/* Performance Controls Overlay */}
      <div className={`perform-controls ${showControls ? 'visible' : 'hidden'}`}>
        {/* Audio Levels */}
        <div className="audio-display">
          <div className="level-indicator">
            <span className="level-label">🔊 BASS</span>
            <div className="level-meter">
              <div 
                className="level-fill bass" 
                style={{ width: `${audioData.bass * 100}%` }}
              />
            </div>
            <span className="level-value">{Math.round(audioData.bass * 100)}</span>
          </div>
          
          <div className="level-indicator">
            <span className="level-label">🎸 MID</span>
            <div className="level-meter">
              <div 
                className="level-fill mid" 
                style={{ width: `${audioData.mid * 100}%` }}
              />
            </div>
            <span className="level-value">{Math.round(audioData.mid * 100)}</span>
          </div>
          
          <div className="level-indicator">
            <span className="level-label">🎹 HIGH</span>
            <div className="level-meter">
              <div 
                className="level-fill high" 
                style={{ width: `${audioData.high * 100}%` }}
              />
            </div>
            <span className="level-value">{Math.round(audioData.high * 100)}</span>
          </div>
        </div>

        {/* Scene Selector */}
        {scenes && scenes.length > 0 && (
          <div className="scene-selector">
            <div className="scene-label">SCENES</div>
            <div className="scene-buttons">
              {scenes.map((scene, index) => (
                <button
                  key={index}
                  className={`scene-btn ${index === currentSceneIndex ? 'active' : ''}`}
                  onClick={() => onSceneChange(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="quick-actions">
          <button 
            className="action-btn fullscreen"
            onClick={toggleFullscreen}
            title="Plein écran (F11)"
          >
            {isFullscreen ? '⛶' : '⛶'}
          </button>
        </div>

        {/* Keyboard Shortcuts Help */}
        <div className="shortcuts-help">
          <div className="shortcut">
            <kbd>1-9</kbd> Scènes
          </div>
          <div className="shortcut">
            <kbd>←</kbd><kbd>→</kbd> Navigation
          </div>
          <div className="shortcut">
            <kbd>F11</kbd> Plein écran
          </div>
          <div className="shortcut">
            <kbd>ESC</kbd> Quitter
          </div>
        </div>
      </div>

      {/* Performance Info Corner */}
      <div className={`perform-info ${showControls ? 'visible' : 'hidden'}`}>
        <div className="info-item">
          <span className="info-icon">🎭</span>
          <span className="info-text">LIVE</span>
        </div>
        <div className="info-item">
          <span className="info-icon">🎨</span>
          <span className="info-text">{layers.filter(l => l.visible).length} Layers</span>
        </div>
      </div>
    </div>
  )
}

export default PerformMode
