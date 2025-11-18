import React, { useState, useRef, useEffect } from 'react'
import Editor from './components/Editor'
import Viewer from './components/Viewer'
import AudioAnalyzer from './utils/AudioAnalyzer'
import './App.css'

function App() {
  const [layers, setLayers] = useState([])
  const [selectedLayerId, setSelectedLayerId] = useState(null)
  const [audioData, setAudioData] = useState({ bass: 0, mid: 0, high: 0, overall: 0 })
  const audioAnalyzerRef = useRef(null)
  const animationFrameRef = useRef(null)

  useEffect(() => {
    // Initialize audio analyzer
    audioAnalyzerRef.current = new AudioAnalyzer()
    
    // Animation loop for audio analysis
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
        audioAnalyzerRef.current.destroy()
      }
    }
  }, [])

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
      filters: {
        blur: 0,
        brightness: 100,
        contrast: 100,
        saturate: 100,
        hueRotate: 0,
        grayscale: 0,
        sepia: 0,
        invert: 0
      },
      audioReactive: {
        opacity: { enabled: false, source: 'overall', min: 0, max: 1, intensity: 1 },
        scale: { enabled: false, source: 'bass', min: 0.8, max: 1.5, intensity: 1 },
        rotation: { enabled: false, source: 'mid', min: 0, max: 360, intensity: 1 },
        blur: { enabled: false, source: 'high', min: 0, max: 10, intensity: 1 },
        brightness: { enabled: false, source: 'overall', min: 80, max: 150, intensity: 1 },
        hueRotate: { enabled: false, source: 'overall', min: 0, max: 360, intensity: 1 }
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
          audioData={audioData}
          audioAnalyzer={audioAnalyzerRef.current}
          onUpdateLayer={updateLayer}
        />
      </div>
    </div>
  )
}

export default App
