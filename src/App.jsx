import React, { useState, useRef, useEffect } from 'react'
import ArtisticVJ from './components/ArtisticVJ'
import AudioAnalyzer from './utils/AudioAnalyzer'
import './App.css'

function App() {
  const [layers, setLayers] = useState([])
  const [audioData, setAudioData] = useState({ bass: 0, mid: 0, high: 0, overall: 0 })
  const audioAnalyzerRef = useRef(null)
  const animationFrameRef = useRef(null)
  const fileInputRef = useRef(null)

  // Setup audio analyzer
  useEffect(() => {
    audioAnalyzerRef.current = new AudioAnalyzer()
    
    const updateAudioData = () => {
      if (audioAnalyzerRef.current) {
        const data = audioAnalyzerRef.current.getFrequencyData()
        setAudioData(data)
      }
      animationFrameRef.current = requestAnimationFrame(updateAudioData)
    }
    
    updateAudioData()
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (audioAnalyzerRef.current) {
        audioAnalyzerRef.current.disconnect()
      }
    }
  }, [])

  // Ajouter un layer
  const addLayer = (file) => {
    const type = getFileType(file)
    const url = URL.createObjectURL(file)
    
    const newLayer = {
      id: Date.now() + Math.random(),
      name: file.name,
      type,
      src: url,
      visible: true,
      opacity: 1,
      blendMode: 'normal',
      filters: {
        hueRotate: 0,
        saturate: 100,
        brightness: 100,
        contrast: 100,
        blur: 0,
        invert: 0
      },
      transform: {
        scale: 1,
        rotation: 0,
        translateX: 0,
        translateY: 0
      }
    }
    
    setLayers(prev => [...prev, newLayer])
    
    // Si c'est un audio, le connecter à l'analyzer
    if (type === 'audio' && audioAnalyzerRef.current) {
      const audio = new Audio(url)
      audio.loop = true
      audio.play()
      audioAnalyzerRef.current.connectAudio(audio)
    }
  }

  // Détecter le type de fichier
  const getFileType = (file) => {
    const type = file.type
    if (type.startsWith('image/gif')) return 'gif'
    if (type.startsWith('image/')) return 'image'
    if (type.startsWith('video/')) return 'video'
    if (type.startsWith('audio/')) return 'audio'
    return 'unknown'
  }

  // Mettre à jour un layer
  const updateLayer = (layerId, updates) => {
    setLayers(prev => 
      prev.map(layer => 
        layer.id === layerId 
          ? { ...layer, ...updates }
          : layer
      )
    )
  }

  // Supprimer un layer
  const deleteLayer = (layerId) => {
    const layer = layers.find(l => l.id === layerId)
    if (layer?.src) {
      URL.revokeObjectURL(layer.src)
    }
    setLayers(prev => prev.filter(l => l.id !== layerId))
  }

  // Import de fichiers
  const handleFileImport = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || [])
    files.forEach(addLayer)
    e.target.value = '' // Reset input
  }

  return (
    <div className="app artistic-mode">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,audio/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Simple header */}
      <header className="artistic-header">
        <h1 className="artistic-title">
          <span className="title-icon">🌙</span>
          <span className="title-text">RESOMAP</span>
          <span className="title-tagline">VJ Artistique</span>
        </h1>
        
        <div className="header-actions">
          <button className="import-btn" onClick={handleFileImport}>
            <span className="btn-icon">➕</span>
            <span className="btn-text">Ajouter Média</span>
          </button>
          
          {layers.length > 0 && (
            <div className="layers-count">
              {layers.length} layer{layers.length > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </header>

      {/* Main ArtisticVJ */}
      <main className="artistic-main">
        <ArtisticVJ
          layers={layers}
          audioData={audioData}
          onUpdateLayer={updateLayer}
        />
      </main>

      {/* Quick layers list - collapsible */}
      {layers.length > 0 && (
        <div className="quick-layers">
          <details>
            <summary>
              📋 Layers ({layers.length})
            </summary>
            <div className="quick-layers-list">
              {layers.map(layer => (
                <div key={layer.id} className="quick-layer-item">
                  <span className="layer-icon">
                    {layer.type === 'video' && '🎬'}
                    {layer.type === 'image' && '🖼️'}
                    {layer.type === 'gif' && '✨'}
                    {layer.type === 'audio' && '🎵'}
                  </span>
                  <span className="layer-name">{layer.name}</span>
                  <button
                    className="layer-visibility"
                    onClick={() => updateLayer(layer.id, { visible: !layer.visible })}
                    title={layer.visible ? 'Masquer' : 'Afficher'}
                  >
                    {layer.visible ? '👁️' : '👁️‍🗨️'}
                  </button>
                  <button
                    className="layer-delete"
                    onClick={() => deleteLayer(layer.id)}
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  )
}

export default App
