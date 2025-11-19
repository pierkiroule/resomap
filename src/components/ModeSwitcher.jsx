import React from 'react'
import './ModeSwitcher.css'

function ModeSwitcher({ currentMode, onModeChange }) {
  return (
    <div className="mode-switcher">
      <button 
        className={`mode-btn prepare ${currentMode === 'prepare' ? 'active' : ''}`}
        onClick={() => onModeChange('prepare')}
        title="Mode Préparation - Configurez vos scènes"
      >
        <span className="mode-icon">🎨</span>
        <span className="mode-label">PREPARE</span>
      </button>
      
      <button 
        className={`mode-btn perform ${currentMode === 'perform' ? 'active' : ''}`}
        onClick={() => onModeChange('perform')}
        title="Mode Performance - VJ Live en plein écran"
      >
        <span className="mode-icon">🎭</span>
        <span className="mode-label">PERFORM</span>
      </button>
    </div>
  )
}

export default ModeSwitcher
