import React, { useRef, useState } from 'react'
import './SimplifiedEditor.css'

function SimplifiedEditor({ 
  layers, 
  selectedLayerId, 
  onSelectLayer, 
  onAddLayer, 
  onUpdateLayer, 
  onDeleteLayer,
  onReorderLayers,
  scenes,
  currentSceneIndex,
  onSaveScene,
  onLoadScene,
  onDeleteScene
}) {
  const fileInputRef = useRef(null)
  const selectedLayer = layers.find(l => l.id === selectedLayerId)
  const [expandedSection, setExpandedSection] = useState('layers')

  const handleFileImport = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => onAddLayer(file))
    e.target.value = ''
  }

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  return (
    <div className="simplified-editor">
      {/* Import Button */}
      <div className="editor-actions">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*,audio/*"
          multiple
          onChange={handleFileImport}
          style={{ display: 'none' }}
        />
        <button 
          className="import-btn-simple"
          onClick={() => fileInputRef.current?.click()}
        >
          <span className="btn-icon">📁</span>
          <span className="btn-text">Ajouter Média</span>
        </button>
      </div>

      {/* Layers Section */}
      <div className={`editor-section ${expandedSection === 'layers' ? 'expanded' : ''}`}>
        <button className="section-header" onClick={() => toggleSection('layers')}>
          <span className="section-icon">🎨</span>
          <span className="section-title">Calques</span>
          <span className="section-count">{layers.length}</span>
          <span className="section-arrow">{expandedSection === 'layers' ? '▼' : '▶'}</span>
        </button>
        
        {expandedSection === 'layers' && (
          <div className="section-content">
            {layers.length === 0 ? (
              <div className="empty-hint">Ajoutez des médias pour commencer</div>
            ) : (
              <div className="layers-simple">
                {layers.map((layer, index) => (
                  <div 
                    key={layer.id}
                    className={`layer-simple ${selectedLayerId === layer.id ? 'selected' : ''}`}
                    onClick={() => onSelectLayer(layer.id)}
                  >
                    <button
                      className="layer-visibility"
                      onClick={(e) => {
                        e.stopPropagation()
                        onUpdateLayer(layer.id, { visible: !layer.visible })
                      }}
                    >
                      {layer.visible ? '👁️' : '⚫'}
                    </button>
                    <span className="layer-name-simple">{layer.name}</span>
                    <div className="layer-controls-simple">
                      <button
                        className="layer-move-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (index > 0) onReorderLayers(index, index - 1)
                        }}
                        disabled={index === 0}
                      >
                        ▲
                      </button>
                      <button
                        className="layer-move-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (index < layers.length - 1) onReorderLayers(index, index + 1)
                        }}
                        disabled={index === layers.length - 1}
                      >
                        ▼
                      </button>
                      <button
                        className="layer-delete-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteLayer(layer.id)
                        }}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Layer Properties - Only if layer selected */}
      {selectedLayer && (
        <div className={`editor-section ${expandedSection === 'props' ? 'expanded' : ''}`}>
          <button className="section-header" onClick={() => toggleSection('props')}>
            <span className="section-icon">⚙️</span>
            <span className="section-title">Propriétés</span>
            <span className="section-arrow">{expandedSection === 'props' ? '▼' : '▶'}</span>
          </button>
          
          {expandedSection === 'props' && (
            <div className="section-content">
              <div className="prop-row">
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
                </label>
              </div>
              
              <div className="prop-row">
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
                </label>
              </div>
              
              <div className="prop-row">
                <label>
                  <span>Rotation</span>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    step="1"
                    value={selectedLayer.rotation}
                    onChange={(e) => onUpdateLayer(selectedLayer.id, { rotation: parseFloat(e.target.value) })}
                  />
                </label>
              </div>
              
              <div className="prop-row">
                <label>
                  <span>Flou</span>
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
                </label>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Scenes Section */}
      <div className={`editor-section ${expandedSection === 'scenes' ? 'expanded' : ''}`}>
        <button className="section-header" onClick={() => toggleSection('scenes')}>
          <span className="section-icon">🎬</span>
          <span className="section-title">Scènes</span>
          <span className="section-count">{scenes.length}</span>
          <span className="section-arrow">{expandedSection === 'scenes' ? '▼' : '▶'}</span>
        </button>
        
        {expandedSection === 'scenes' && (
          <div className="section-content">
            <button className="save-scene-simple" onClick={onSaveScene}>
              💾 Sauvegarder Scène
            </button>
            
            {scenes.length === 0 ? (
              <div className="empty-hint">Aucune scène sauvegardée</div>
            ) : (
              <div className="scenes-simple">
                {scenes.map((scene, index) => (
                  <div 
                    key={scene.id}
                    className={`scene-simple ${index === currentSceneIndex ? 'active' : ''}`}
                  >
                    <span className="scene-number">{index + 1}</span>
                    <span className="scene-name">{scene.name}</span>
                    <div className="scene-actions-simple">
                      <button
                        className="scene-action load"
                        onClick={() => onLoadScene(index)}
                        title="Charger"
                      >
                        ▶
                      </button>
                      <button
                        className="scene-action delete"
                        onClick={() => onDeleteScene(index)}
                        title="Supprimer"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SimplifiedEditor
