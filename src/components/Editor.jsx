import React, { useRef } from 'react'
import LayerPanel from './LayerPanel'
import './Editor.css'

function Editor({ 
  layers, 
  selectedLayerId, 
  onSelectLayer, 
  onAddLayer, 
  onUpdateLayer, 
  onDeleteLayer,
  onReorderLayers 
}) {
  const fileInputRef = useRef(null)
  const selectedLayer = layers.find(l => l.id === selectedLayerId)

  const handleFileImport = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => onAddLayer(file))
    e.target.value = '' // Reset input
  }

  return (
    <div className="editor">
      <div className="editor-toolbar">
        <button 
          className="import-btn"
          onClick={() => fileInputRef.current.click()}
        >
          📁 Importer Média
        </button>
        <input 
          ref={fileInputRef}
          type="file" 
          multiple
          accept="image/*,video/*,audio/*"
          onChange={handleFileImport}
          style={{ display: 'none' }}
        />
      </div>

      <LayerPanel 
        layers={layers}
        selectedLayerId={selectedLayerId}
        onSelectLayer={onSelectLayer}
        onDeleteLayer={onDeleteLayer}
        onUpdateLayer={onUpdateLayer}
        onReorderLayers={onReorderLayers}
      />

      {selectedLayer && (
        <div className="layer-properties">
          <h3>Propriétés du Calque</h3>
          
          <div className="property-group">
            <label>
              <span>Opacité</span>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01"
                value={selectedLayer.opacity}
                onChange={(e) => onUpdateLayer(selectedLayer.id, { opacity: parseFloat(e.target.value) })}
              />
              <span className="value">{(selectedLayer.opacity * 100).toFixed(0)}%</span>
            </label>
          </div>

          <div className="property-group">
            <label>
              <span>Échelle</span>
              <input 
                type="range" 
                min="0.1" 
                max="3" 
                step="0.1"
                value={selectedLayer.scale}
                onChange={(e) => onUpdateLayer(selectedLayer.id, { scale: parseFloat(e.target.value) })}
              />
              <span className="value">{selectedLayer.scale.toFixed(1)}x</span>
            </label>
          </div>

          <div className="property-group">
            <label>
              <span>Rotation</span>
              <input 
                type="range" 
                min="0" 
                max="360" 
                step="1"
                value={selectedLayer.rotation}
                onChange={(e) => onUpdateLayer(selectedLayer.id, { rotation: parseInt(e.target.value) })}
              />
              <span className="value">{selectedLayer.rotation}°</span>
            </label>
          </div>

          <div className="property-group">
            <label>
              <span>Mode de Fusion</span>
              <select 
                value={selectedLayer.blendMode}
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
              </select>
            </label>
          </div>

          <div className="property-group chromakey-section">
            <label className="checkbox-label">
              <input 
                type="checkbox"
                checked={selectedLayer.chromaKey.enabled}
                onChange={(e) => onUpdateLayer(selectedLayer.id, {
                  chromaKey: { ...selectedLayer.chromaKey, enabled: e.target.checked }
                })}
              />
              <span>Activer Chromakey</span>
            </label>

            {selectedLayer.chromaKey.enabled && (
              <>
                <label>
                  <span>Couleur Clé</span>
                  <input 
                    type="color"
                    value={selectedLayer.chromaKey.color}
                    onChange={(e) => onUpdateLayer(selectedLayer.id, {
                      chromaKey: { ...selectedLayer.chromaKey, color: e.target.value }
                    })}
                  />
                </label>

                <label>
                  <span>Seuil</span>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01"
                    value={selectedLayer.chromaKey.threshold}
                    onChange={(e) => onUpdateLayer(selectedLayer.id, {
                      chromaKey: { ...selectedLayer.chromaKey, threshold: parseFloat(e.target.value) }
                    })}
                  />
                  <span className="value">{(selectedLayer.chromaKey.threshold * 100).toFixed(0)}%</span>
                </label>

                <label>
                  <span>Lissage</span>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01"
                    value={selectedLayer.chromaKey.smoothness}
                    onChange={(e) => onUpdateLayer(selectedLayer.id, {
                      chromaKey: { ...selectedLayer.chromaKey, smoothness: parseFloat(e.target.value) }
                    })}
                  />
                  <span className="value">{(selectedLayer.chromaKey.smoothness * 100).toFixed(0)}%</span>
                </label>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Editor
