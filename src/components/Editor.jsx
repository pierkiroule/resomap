import React, { useRef } from 'react'
import LayerPanel from './LayerPanel'
import AudioReactiveControl from './AudioReactiveControl'
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

          <div className="property-group filters-section">
            <div className="section-header">
              <h4>🎨 Filtres Visuels</h4>
              <button 
                className="reset-btn"
                onClick={() => onUpdateLayer(selectedLayer.id, {
                  filters: {
                    blur: 0,
                    brightness: 100,
                    contrast: 100,
                    saturate: 100,
                    hueRotate: 0,
                    grayscale: 0,
                    sepia: 0,
                    invert: 0
                  }
                })}
                title="Réinitialiser les filtres"
              >
                🔄 Reset
              </button>
            </div>

            <div className="filter-presets">
              <button 
                className="preset-btn"
                onClick={() => onUpdateLayer(selectedLayer.id, {
                  filters: { ...selectedLayer.filters, brightness: 120, contrast: 110, saturate: 120 }
                })}
              >
                ☀️ Vibrant
              </button>
              <button 
                className="preset-btn"
                onClick={() => onUpdateLayer(selectedLayer.id, {
                  filters: { ...selectedLayer.filters, brightness: 90, contrast: 120, saturate: 80 }
                })}
              >
                🌙 Dramatique
              </button>
              <button 
                className="preset-btn"
                onClick={() => onUpdateLayer(selectedLayer.id, {
                  filters: { ...selectedLayer.filters, grayscale: 100, contrast: 110 }
                })}
              >
                ⚫ Noir & Blanc
              </button>
              <button 
                className="preset-btn"
                onClick={() => onUpdateLayer(selectedLayer.id, {
                  filters: { ...selectedLayer.filters, sepia: 80, brightness: 110 }
                })}
              >
                📜 Vintage
              </button>
            </div>
            
            <label>
              <span>Flou (Blur)</span>
              <input 
                type="range" 
                min="0" 
                max="20" 
                step="0.5"
                value={selectedLayer.filters.blur}
                onChange={(e) => onUpdateLayer(selectedLayer.id, {
                  filters: { ...selectedLayer.filters, blur: parseFloat(e.target.value) }
                })}
              />
              <span className="value">{selectedLayer.filters.blur.toFixed(1)}px</span>
            </label>

            <label>
              <span>Luminosité</span>
              <input 
                type="range" 
                min="0" 
                max="200" 
                step="1"
                value={selectedLayer.filters.brightness}
                onChange={(e) => onUpdateLayer(selectedLayer.id, {
                  filters: { ...selectedLayer.filters, brightness: parseInt(e.target.value) }
                })}
              />
              <span className="value">{selectedLayer.filters.brightness}%</span>
            </label>

            <label>
              <span>Contraste</span>
              <input 
                type="range" 
                min="0" 
                max="200" 
                step="1"
                value={selectedLayer.filters.contrast}
                onChange={(e) => onUpdateLayer(selectedLayer.id, {
                  filters: { ...selectedLayer.filters, contrast: parseInt(e.target.value) }
                })}
              />
              <span className="value">{selectedLayer.filters.contrast}%</span>
            </label>

            <label>
              <span>Saturation</span>
              <input 
                type="range" 
                min="0" 
                max="200" 
                step="1"
                value={selectedLayer.filters.saturate}
                onChange={(e) => onUpdateLayer(selectedLayer.id, {
                  filters: { ...selectedLayer.filters, saturate: parseInt(e.target.value) }
                })}
              />
              <span className="value">{selectedLayer.filters.saturate}%</span>
            </label>

            <label>
              <span>Teinte (Hue Rotate)</span>
              <input 
                type="range" 
                min="0" 
                max="360" 
                step="1"
                value={selectedLayer.filters.hueRotate}
                onChange={(e) => onUpdateLayer(selectedLayer.id, {
                  filters: { ...selectedLayer.filters, hueRotate: parseInt(e.target.value) }
                })}
              />
              <span className="value">{selectedLayer.filters.hueRotate}°</span>
            </label>

            <label>
              <span>Niveaux de Gris</span>
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="1"
                value={selectedLayer.filters.grayscale}
                onChange={(e) => onUpdateLayer(selectedLayer.id, {
                  filters: { ...selectedLayer.filters, grayscale: parseInt(e.target.value) }
                })}
              />
              <span className="value">{selectedLayer.filters.grayscale}%</span>
            </label>

            <label>
              <span>Sépia</span>
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="1"
                value={selectedLayer.filters.sepia}
                onChange={(e) => onUpdateLayer(selectedLayer.id, {
                  filters: { ...selectedLayer.filters, sepia: parseInt(e.target.value) }
                })}
              />
              <span className="value">{selectedLayer.filters.sepia}%</span>
            </label>

            <label>
              <span>Inversion</span>
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="1"
                value={selectedLayer.filters.invert}
                onChange={(e) => onUpdateLayer(selectedLayer.id, {
                  filters: { ...selectedLayer.filters, invert: parseInt(e.target.value) }
                })}
              />
              <span className="value">{selectedLayer.filters.invert}%</span>
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
