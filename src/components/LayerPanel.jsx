import React from 'react'
import './LayerPanel.css'

function LayerPanel({ 
  layers, 
  selectedLayerId, 
  onSelectLayer, 
  onDeleteLayer, 
  onUpdateLayer,
  onReorderLayers 
}) {
  const getLayerIcon = (type) => {
    switch(type) {
      case 'image': return '🖼️'
      case 'video': return '🎬'
      case 'audio': return '🎵'
      case 'gif': return '🎭'
      default: return '📄'
    }
  }

  const moveLayer = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex >= 0 && newIndex < layers.length) {
      onReorderLayers(index, newIndex)
    }
  }

  return (
    <div className="layer-panel">
      <h3>Calques ({layers.length})</h3>
      <div className="layers-list">
        {layers.length === 0 ? (
          <div className="empty-state">
            <p>Aucun calque</p>
            <p className="hint">Importez des médias pour commencer</p>
          </div>
        ) : (
          layers.map((layer, index) => (
            <div 
              key={layer.id}
              className={`layer-item ${selectedLayerId === layer.id ? 'selected' : ''}`}
              onClick={() => onSelectLayer(layer.id)}
            >
              <div className="layer-icon">{getLayerIcon(layer.type)}</div>
              <div className="layer-info">
                <div className="layer-name">{layer.name}</div>
                <div className="layer-type">{layer.type}</div>
              </div>
              <div className="layer-controls">
                <button 
                  className="layer-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    onUpdateLayer(layer.id, { visible: !layer.visible })
                  }}
                  title={layer.visible ? "Masquer" : "Afficher"}
                >
                  {layer.visible ? '👁️' : '👁️‍🗨️'}
                </button>
                <button 
                  className="layer-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    moveLayer(index, 'up')
                  }}
                  disabled={index === 0}
                  title="Monter"
                >
                  ⬆️
                </button>
                <button 
                  className="layer-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    moveLayer(index, 'down')
                  }}
                  disabled={index === layers.length - 1}
                  title="Descendre"
                >
                  ⬇️
                </button>
                <button 
                  className="layer-btn delete"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteLayer(layer.id)
                  }}
                  title="Supprimer"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default LayerPanel
