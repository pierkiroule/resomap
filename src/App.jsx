import React, { useState } from 'react'
import Editor from './components/Editor'
import Viewer from './components/Viewer'
import './App.css'

function App() {
  const [layers, setLayers] = useState([])
  const [selectedLayerId, setSelectedLayerId] = useState(null)

  const addLayer = (file) => {
    const newLayer = {
      id: Date.now(),
      name: file.name,
      type: getFileType(file),
      url: URL.createObjectURL(file),
      file: file,
      visible: true,
      opacity: 1,
      blendMode: 'normal',
      chromaKey: {
        enabled: false,
        color: '#00ff00',
        threshold: 0.4,
        smoothness: 0.1
      },
      position: { x: 0, y: 0 },
      scale: 1,
      rotation: 0
    }
    setLayers([...layers, newLayer])
  }

  const getFileType = (file) => {
    const type = file.type
    if (type.startsWith('image/')) return 'image'
    if (type.startsWith('video/')) return 'video'
    if (type.startsWith('audio/')) return 'audio'
    if (type === 'image/gif') return 'gif'
    return 'unknown'
  }

  const updateLayer = (id, updates) => {
    setLayers(layers.map(layer => 
      layer.id === id ? { ...layer, ...updates } : layer
    ))
  }

  const deleteLayer = (id) => {
    setLayers(layers.filter(layer => layer.id !== id))
    if (selectedLayerId === id) setSelectedLayerId(null)
  }

  const reorderLayers = (startIndex, endIndex) => {
    const result = Array.from(layers)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    setLayers(result)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌙 Resomap - Générateur de Rêve Multimédia</h1>
      </header>
      <div className="app-content">
        <Editor 
          layers={layers}
          selectedLayerId={selectedLayerId}
          onSelectLayer={setSelectedLayerId}
          onAddLayer={addLayer}
          onUpdateLayer={updateLayer}
          onDeleteLayer={deleteLayer}
          onReorderLayers={reorderLayers}
        />
        <Viewer 
          layers={layers}
        />
      </div>
    </div>
  )
}

export default App
