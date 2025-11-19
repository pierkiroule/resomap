import React, { useRef, useState } from 'react'
import Layer from './Layer'
import TouchVJPad from './TouchVJPad'
import VideoCapture from './VideoCapture'
import PlayerControls from './PlayerControls'
import './Viewer.css'

function Viewer({ layers, audioData, audioAnalyzer, onUpdateLayer, selectedLayer }) {
  const viewerRef = useRef(null)
  const [backdrop, setBackdrop] = useState('black')
  const [isTouchVJMode, setIsTouchVJMode] = useState(false)
  const [showVideoCapture, setShowVideoCapture] = useState(false)

  const getCanvasStyle = () => {
    switch(backdrop) {
      case 'black':
        return { background: '#000' }
      case 'white':
        return { background: '#fff' }
      case 'transparent':
        return { 
          background: `
            linear-gradient(45deg, #808080 25%, transparent 25%),
            linear-gradient(-45deg, #808080 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #808080 75%),
            linear-gradient(-45deg, transparent 75%, #808080 75%)`,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
        }
      case 'gradient':
        return { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
      default:
        return { background: '#000' }
    }
  }

  // Touch VJ Mode - Fullscreen immersive
  if (isTouchVJMode) {
    return (
      <div className="viewer touch-vj-viewer" ref={viewerRef}>
        <div className="viewer-header compact">
          <button 
            className="exit-touch-vj"
            onClick={() => setIsTouchVJMode(false)}
            title="Quitter Touch VJ Mode"
          >
            ← Retour
          </button>
          <h2>👆 Touch VJ</h2>
        </div>
        
        <div className="canvas" style={getCanvasStyle()}>
          {layers.map((layer) => (
            layer.visible && <Layer key={layer.id} layer={layer} audioData={audioData} />
          ))}
          
          <TouchVJPad 
            layers={layers}
            audioData={audioData}
            onUpdateLayer={onUpdateLayer}
          />
        </div>
      </div>
    )
  }

  // Normal Mode - Player avec contrôles
  return (
    <div className="viewer" ref={viewerRef}>
      <div className="viewer-header">
        <h2>🎨 Player</h2>
        <div className="viewer-controls">
          {/* Backdrop selector */}
          <div className="backdrop-buttons">
            <button
              className={`backdrop-btn ${backdrop === 'black' ? 'active' : ''}`}
              onClick={() => setBackdrop('black')}
              title="Fond noir"
            >
              ⬛
            </button>
            <button
              className={`backdrop-btn ${backdrop === 'white' ? 'active' : ''}`}
              onClick={() => setBackdrop('white')}
              title="Fond blanc"
            >
              ⬜
            </button>
            <button
              className={`backdrop-btn ${backdrop === 'transparent' ? 'active' : ''}`}
              onClick={() => setBackdrop('transparent')}
              title="Transparent"
            >
              🔲
            </button>
            <button
              className={`backdrop-btn ${backdrop === 'gradient' ? 'active' : ''}`}
              onClick={() => setBackdrop('gradient')}
              title="Gradient"
            >
              🌈
            </button>
          </div>

          {/* Touch VJ Mode toggle */}
          <button 
            className="performance-toggle"
            onClick={() => setIsTouchVJMode(true)}
            title="Touch VJ Mode - Contrôle tactile temps réel"
          >
            👆 Touch VJ
          </button>

          {/* Video Capture toggle */}
          <button 
            className={`video-capture-toggle ${showVideoCapture ? 'active' : ''}`}
            onClick={() => setShowVideoCapture(!showVideoCapture)}
            title="Capturer des loops vidéo"
          >
            🎥 Loop Recorder
          </button>

          {/* Audio visualization */}
          {audioData && (
            <div className="audio-level-display">
              <div className="level-bar">
                <span>🔊</span>
                <div className="bar" style={{ height: `${audioData.bass * 100}%` }} />
              </div>
              <div className="level-bar">
                <span>🎸</span>
                <div className="bar" style={{ height: `${audioData.mid * 100}%` }} />
              </div>
              <div className="level-bar">
                <span>🎹</span>
                <div className="bar" style={{ height: `${audioData.high * 100}%` }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main canvas */}
      <div className="canvas" style={getCanvasStyle()} ref={viewerRef}>
        {layers.length === 0 ? (
          <div className="empty-canvas">
            <p className="empty-icon">🎨</p>
            <p className="empty-text">Aucun calque</p>
            <p className="empty-hint">Ajoutez des médias pour commencer</p>
          </div>
        ) : (
          layers.map((layer) => (
            layer.visible && (
              <Layer 
                key={layer.id} 
                layer={layer}
                audioData={audioData}
              />
            )
          ))
        )}
      </div>

      {/* Player Controls */}
      <PlayerControls 
        layers={layers}
        onUpdateLayer={onUpdateLayer}
      />

      {/* Video Capture */}
      {showVideoCapture && (
        <VideoCapture canvasRef={viewerRef} />
      )}
    </div>
  )
}

export default Viewer
