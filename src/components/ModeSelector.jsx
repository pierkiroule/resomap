import React from 'react'
import { EFFECT_MODES } from '../utils/effectModes'
import './ModeSelector.css'

/**
 * ModeSelector - Sélection des modes d'effets
 * 
 * Affiche les 6 modes prédéfinis avec icônes et descriptions
 */
function ModeSelector({ currentMode, onModeChange }) {
  return (
    <div className="mode-selector">
      <h3>🎭 Modes</h3>
      <div className="mode-buttons">
        {Object.values(EFFECT_MODES).map(mode => (
          <button
            key={mode.id}
            className={`mode-button ${currentMode === mode.id ? 'active' : ''}`}
            onClick={() => onModeChange(mode.id)}
            title={mode.description}
          >
            <span className="mode-icon">{mode.name.split(' ')[0]}</span>
            <span className="mode-name">{mode.name.split(' ')[1]}</span>
          </button>
        ))}
      </div>
      
      {currentMode && (
        <div className="mode-description">
          {EFFECT_MODES[currentMode].description}
        </div>
      )}
    </div>
  )
}

export default ModeSelector
