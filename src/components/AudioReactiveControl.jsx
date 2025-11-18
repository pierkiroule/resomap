import React, { useState } from 'react'
import './AudioReactiveControl.css'

function AudioReactiveControl({ parameter, config, onUpdate }) {
  const [showConfig, setShowConfig] = useState(false)

  const toggleAudioReactive = () => {
    onUpdate({ ...config, enabled: !config.enabled })
  }

  return (
    <div className="audio-reactive-control">
      <button 
        className={`audio-btn ${config.enabled ? 'active' : ''}`}
        onClick={toggleAudioReactive}
        title={config.enabled ? 'Désactiver audio-réactif' : 'Activer audio-réactif'}
      >
        {config.enabled ? '🔊' : '🔇'}
      </button>
      
      {config.enabled && (
        <button 
          className="config-btn"
          onClick={() => setShowConfig(!showConfig)}
          title="Configurer"
        >
          ⚙️
        </button>
      )}

      {showConfig && config.enabled && (
        <div className="audio-config-panel">
          <h5>Audio-Réactif: {parameter}</h5>
          
          <label>
            <span>Source Audio</span>
            <select 
              value={config.source}
              onChange={(e) => onUpdate({ ...config, source: e.target.value })}
            >
              <option value="overall">🎵 Overall</option>
              <option value="bass">🔊 Bass (graves)</option>
              <option value="mid">🎸 Mid (moyens)</option>
              <option value="high">🎹 High (aigus)</option>
            </select>
          </label>

          <label>
            <span>Intensité</span>
            <input 
              type="range" 
              min="0" 
              max="2" 
              step="0.1"
              value={config.intensity}
              onChange={(e) => onUpdate({ ...config, intensity: parseFloat(e.target.value) })}
            />
            <span className="value">{config.intensity.toFixed(1)}x</span>
          </label>

          <div className="range-controls">
            <label>
              <span>Min</span>
              <input 
                type="number" 
                value={config.min}
                step="0.1"
                onChange={(e) => onUpdate({ ...config, min: parseFloat(e.target.value) })}
              />
            </label>
            <label>
              <span>Max</span>
              <input 
                type="number" 
                value={config.max}
                step="0.1"
                onChange={(e) => onUpdate({ ...config, max: parseFloat(e.target.value) })}
              />
            </label>
          </div>

          <button 
            className="close-config-btn"
            onClick={() => setShowConfig(false)}
          >
            ✕ Fermer
          </button>
        </div>
      )}
    </div>
  )
}

export default AudioReactiveControl
