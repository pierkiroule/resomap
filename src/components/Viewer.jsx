import React, { useRef, useEffect } from 'react'
import Layer from './Layer'
import './Viewer.css'

function Viewer({ layers }) {
  const viewerRef = useRef(null)

  return (
    <div className="viewer" ref={viewerRef}>
      <div className="viewer-header">
        <h2>🎨 Aperçu du Rêve</h2>
        <div className="viewer-info">
          {layers.length} calque{layers.length !== 1 ? 's' : ''}
        </div>
      </div>
      <div className="canvas-container">
        <div className="canvas">
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
