import React, { useRef, useState } from 'react'
import Layer from './Layer'
import './Viewer.css'

function Viewer({ layers }) {
  const viewerRef = useRef(null)
  const [backdrop, setBackdrop] = useState('black') // black, white, transparent, color

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
        <h2>🎨 Aperçu du Rêve</h2>
        <div className="viewer-controls">
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
        <div className="canvas" style={getCanvasStyle()}>
          {layers.map((layer) => (
            layer.visible && (
              <Layer 
                key={layer.id} 
                layer={layer}
              />
            )
          ))}
          {layers.length === 0 && (
            <div className="empty-canvas">
              <div className="empty-icon">✨</div>
              <p>Votre rêve multimédia apparaîtra ici</p>
              <p className="empty-hint">Ajoutez des calques pour commencer</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Viewer
