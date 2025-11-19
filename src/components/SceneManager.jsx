import React from 'react'
import './SceneManager.css'

function SceneManager({ 
  scenes, 
  currentSceneIndex, 
  onSaveScene, 
  onLoadScene, 
  onDeleteScene,
  onUpdateScene 
}) {
  return (
    <div className="scene-manager">
      <div className="scene-header">
        <h3>🎬 Scènes</h3>
        <button 
          className="save-scene-btn"
          onClick={onSaveScene}
          title="Sauvegarder la scène actuelle"
        >
          💾 Sauvegarder
        </button>
      </div>

      {scenes.length === 0 ? (
        <div className="empty-scenes">
          <p>Aucune scène sauvegardée</p>
          <p className="hint">Créez des scènes pour basculer rapidement entre différentes compositions</p>
        </div>
      ) : (
        <div className="scenes-list">
          {scenes.map((scene, index) => (
            <div 
              key={scene.id}
              className={`scene-item ${index === currentSceneIndex ? 'active' : ''}`}
            >
              <div className="scene-number">{index + 1}</div>
              <div className="scene-info">
                <div className="scene-name">{scene.name}</div>
                <div className="scene-meta">
                  {scene.layers.length} calque{scene.layers.length !== 1 ? 's' : ''}
                </div>
              </div>
              <div className="scene-actions">
                <button
                  className="scene-action-btn load"
                  onClick={() => onLoadScene(index)}
                  title="Charger cette scène"
                >
                  ▶️
                </button>
                {index === currentSceneIndex && (
                  <button
                    className="scene-action-btn update"
                    onClick={onUpdateScene}
                    title="Mettre à jour cette scène"
                  >
                    🔄
                  </button>
                )}
                <button
                  className="scene-action-btn delete"
                  onClick={() => onDeleteScene(index)}
                  title="Supprimer cette scène"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="scene-tips">
        <div className="tip">
          <strong>💡 Astuce VJ :</strong> Préparez plusieurs scènes en mode PREPARE, puis basculez en mode PERFORM pour switcher rapidement entre elles pendant votre set.
        </div>
        <div className="tip">
          <strong>⌨️ Raccourcis :</strong> En mode PERFORM, utilisez les touches <kbd>1-9</kbd> ou <kbd>←</kbd><kbd>→</kbd> pour naviguer entre les scènes.
        </div>
      </div>
    </div>
  )
}

export default SceneManager
