import React, { useState, useRef, useEffect } from 'react'
import SimplifiedEditor from './components/SimplifiedEditor'
import Viewer from './components/Viewer'
import PerformMode from './components/PerformMode'
import ModeSwitcher from './components/ModeSwitcher'
import AudioAnalyzer from './utils/AudioAnalyzer'
import './App.css'

function App() {
  // VJ Mode System
  const [currentMode, setCurrentMode] = useState('prepare') // 'prepare' or 'perform'
  
  // Scene Management
  const [scenes, setScenes] = useState([])
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0)
  
  // Layer Management
  const [layers, setLayers] = useState([])
  const [selectedLayerId, setSelectedLayerId] = useState(null)
  
  // Audio System
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

  const restoreSnapshot = (snapshotLayers) => {
    setLayers(snapshotLayers)
    setSelectedLayerId(null)
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

  // Scene Management Functions
  const saveCurrentScene = () => {
    const scene = {
      id: Date.now(),
      name: `Scene ${scenes.length + 1}`,
      layers: JSON.parse(JSON.stringify(layers)), // Deep copy
      timestamp: new Date().toISOString()
    }
    setScenes([...scenes, scene])
    return scene
  }

  const loadScene = (index) => {
    if (index >= 0 && index < scenes.length) {
      setLayers(JSON.parse(JSON.stringify(scenes[index].layers)))
      setCurrentSceneIndex(index)
    }
  }

  const deleteScene = (index) => {
    const newScenes = scenes.filter((_, i) => i !== index)
    setScenes(newScenes)
    if (currentSceneIndex >= newScenes.length && newScenes.length > 0) {
      setCurrentSceneIndex(newScenes.length - 1)
    }
  }

  const updateCurrentScene = () => {
    if (scenes.length > 0 && currentSceneIndex < scenes.length) {
      const updatedScenes = [...scenes]
      updatedScenes[currentSceneIndex] = {
        ...updatedScenes[currentSceneIndex],
        layers: JSON.parse(JSON.stringify(layers))
      }
      setScenes(updatedScenes)
    }
  }

  // Mode switching
  const handleModeChange = (mode) => {
    setCurrentMode(mode)
    if (mode === 'perform' && scenes.length === 0 && layers.length > 0) {
      // Auto-save current state as first scene when entering perform mode
      saveCurrentScene()
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🌙 Resomap VJ</h1>
          <ModeSwitcher 
            currentMode={currentMode}
            onModeChange={handleModeChange}
          />
        </div>
      </header>

      {currentMode === 'prepare' ? (
        // PREPARE MODE - Configuration et édition simplifiée
        <div className="app-content prepare-mode">
          <SimplifiedEditor 
            layers={layers}
            selectedLayerId={selectedLayerId}
            onSelectLayer={setSelectedLayerId}
            onAddLayer={addLayer}
            onUpdateLayer={updateLayer}
            onDeleteLayer={deleteLayer}
            onReorderLayers={reorderLayers}
            scenes={scenes}
            currentSceneIndex={currentSceneIndex}
            onSaveScene={saveCurrentScene}
            onLoadScene={loadScene}
            onDeleteScene={deleteScene}
          />
          <Viewer 
            layers={layers}
            audioData={audioData}
            audioAnalyzer={audioAnalyzerRef.current}
            onUpdateLayer={updateLayer}
          />
        </div>
      ) : (
        // PERFORM MODE - Performance live plein écran
        <PerformMode
          layers={layers}
          audioData={audioData}
          onUpdateLayer={updateLayer}
          scenes={scenes}
          currentSceneIndex={currentSceneIndex}
          onSceneChange={loadScene}
        />
      )}
    </div>
  )
}

export default App
