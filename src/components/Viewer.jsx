import React, { useRef, useState } from 'react'
import Layer from './Layer'
import TouchInteraction from './TouchInteraction'
import VideoCapture from './VideoCapture'
import './Viewer.css'

function Viewer({ layers, audioData, audioAnalyzer, onUpdateLayer }) {
  const viewerRef = useRef(null)
  const [backdrop, setBackdrop] = useState('black')
  const [isPerformanceMode, setIsPerformanceMode] = useState(false)
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

  return (
    <div className="viewer" ref={viewerRef}>
      <div className="viewer-header">
        <h2>{isPerformanceMode ? '🎭 Mode Performance VJ' : '🎨 Aperçu du Rêve'}</h2>
        <div className="viewer-controls">
          <button 
            className={`performance-toggle ${isPerformanceMode ? 'active' : ''}`}
            onClick={() => setIsPerformanceMode(!isPerformanceMode)}
            title={isPerformanceMode ? 'Quitter le mode Performance' : 'Activer le mode Performance'}
          >
            {isPerformanceMode ? '🎭 VJ Mode ON' : '🎬 VJ Mode OFF'}
          </button>

          <button 
            className={`video-capture-toggle ${showVideoCapture ? 'active' : ''}`}
            onClick={() => setShowVideoCapture(!showVideoCapture)}
            title="Capturer des loops vidéo"
          >
            🎥 Loop Recorder
          </button>
          
          {isPerformanceMode && (
            <div className="audio-level-display">
              <div className="level-bar">
                <span>🔊</span>
                <div className="bar" style={{ width: `${audioData.bass * 100}%`, background: '#ff3366' }}></div>
              </div>
              <div className="level-bar">
                <span>🎸</span>
                <div className="bar" style={{ width: `${audioData.mid * 100}%`, background: '#33ff88' }}></div>
              </div>
              <div className="level-bar">
                <span>🎹</span>
                <div className="bar" style={{ width: `${audioData.high * 100}%`, background: '#3366ff' }}></div>
              </div>
            </div>
          )}
          
          <div className="viewer-info">
            {layers.length} calque{layers.length !== 1 ? 's' : ''}
          </div>
          <div className="backdrop-buttons">
            <button 
              className={`backdrop-btn ${backdrop === 'black' ? 'active' : ''}`}
              onClick={() => setBackdrop('black')}
              title="Fond noir"
            >
              ⚫
            </button>
            <button 
              className={`backdrop-btn ${backdrop === 'white' ? 'active' : ''}`}
              onClick={() => setBackdrop('white')}
              title="Fond blanc"
            >
              ⚪
            </button>
            <button 
              className={`backdrop-btn ${backdrop === 'transparent' ? 'active' : ''}`}
              onClick={() => setBackdrop('transparent')}
              title="Grille de transparence"
            >
              🔲
            </button>
            <button 
              className={`backdrop-btn ${backdrop === 'gradient' ? 'active' : ''}`}
              onClick={() => setBackdrop('gradient')}
              title="Dégradé"
            >
              🌈
            </button>
          </div>
        </div>
      </div>
      <div className="canvas-container">
        <div className={`canvas ${isPerformanceMode ? 'performance-active' : ''}`} style={getCanvasStyle()}>
          {layers.map((layer) => (
            layer.visible && (
              isPerformanceMode ? (
                <TouchInteraction
                  key={layer.id}
                  layer={layer}
                  audioData={audioData}
                  onUpdateLayer={onUpdateLayer}
                  isPerformanceMode={isPerformanceMode}
                >
                  <Layer 
                    layer={layer}
                    audioData={audioData}
                  />
                </TouchInteraction>
              ) : (
                <Layer 
                  key={layer.id} 
                  layer={layer}
                  audioData={audioData}
                />
              )
            )
          ))}
          {layers.length === 0 && (
            <div className="empty-canvas">
              <div className="empty-icon">✨</div>
              <p>Votre rêve multimédia apparaîtra ici</p>
              <p className="empty-hint">Ajoutez des calques pour commencer</p>
            </div>
          )}
          
          {isPerformanceMode && layers.length > 0 && (
            <div className="performance-hints">
              <p>🖱️ Glisser pour déplacer</p>
              <p>🔄 Scroll pour zoomer</p>
              <p>⇧ Shift+Scroll pour rotation</p>
              <p>⌃ Ctrl+Scroll pour blur</p>
              <p>👆 2 doigts: pinch & rotate</p>
            </div>
          )}
        </div>
      </div>

      {showVideoCapture && (
        <VideoCapture canvasRef={viewerRef} />
      )}
    </div>
  )
}

export default Viewer
