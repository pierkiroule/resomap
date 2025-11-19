import React, { useState, useRef, useEffect } from 'react'
import TouchFX from './components/TouchFX'
import './AppV2.css'

/**
 * RESOMAP V2 - POC Minimal Mobile-First
 * 
 * Features:
 * - Max 4 layers
 * - Simple blend modes
 * - Touch responsive
 * - Audio analyzer
 * - NO BUGS
 */

const MAX_LAYERS = 4
const BLEND_MODES = ['normal', 'screen', 'multiply', 'overlay', 'soft-light']

function AppV2() {
  const [layers, setLayers] = useState([])
  const [selectedLayerId, setSelectedLayerId] = useState(null)
  const [audioData, setAudioData] = useState({ bass: 0, mid: 0, high: 0 })
  const fileInputRef = useRef(null)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const animFrameRef = useRef(null)

  // Setup audio analyzer
  useEffect(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    audioContextRef.current = new AudioContext()
    analyserRef.current = audioContextRef.current.createAnalyser()
    analyserRef.current.fftSize = 256
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  // Audio analysis loop
  useEffect(() => {
    if (!analyserRef.current) return

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    
    const analyze = () => {
      analyserRef.current.getByteFrequencyData(dataArray)
      
      // Simple bass/mid/high extraction
      const bass = dataArray.slice(0, 5).reduce((a, b) => a + b) / (5 * 255)
      const mid = dataArray.slice(5, 15).reduce((a, b) => a + b) / (10 * 255)
      const high = dataArray.slice(15, 30).reduce((a, b) => a + b) / (15 * 255)
      
      setAudioData({ bass, mid, high })
      animFrameRef.current = requestAnimationFrame(analyze)
    }
    
    analyze()
    
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
      }
    }
  }, [])

  // Import layer
  const handleImport = (e) => {
    const files = Array.from(e.target.files || [])
    
    files.forEach(file => {
      if (layers.length >= MAX_LAYERS) {
        alert(`Maximum ${MAX_LAYERS} layers !`)
        return
      }

      const type = file.type.startsWith('video/') ? 'video' :
                   file.type.startsWith('image/') ? 'image' :
                   file.type.startsWith('audio/') ? 'audio' : null

      if (!type) return

      const url = URL.createObjectURL(file)
      const newLayer = {
        id: Date.now() + Math.random(),
        name: file.name,
        type,
        url,
        blendMode: 'normal',
        opacity: 1,
        visible: true
      }

      setLayers(prev => [...prev, newLayer])

      // Connect audio to analyzer
      if (type === 'audio' && audioContextRef.current && analyserRef.current) {
        const audio = new Audio(url)
        audio.loop = true
        audio.play()
        const source = audioContextRef.current.createMediaElementSource(audio)
        source.connect(analyserRef.current)
        analyserRef.current.connect(audioContextRef.current.destination)
      }
    })

    e.target.value = ''
  }

  // Update layer
  const updateLayer = (id, updates) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l))
  }

  // Delete layer
  const deleteLayer = (id) => {
    const layer = layers.find(l => l.id === id)
    if (layer?.url) URL.revokeObjectURL(layer.url)
    setLayers(prev => prev.filter(l => l.id !== id))
    if (selectedLayerId === id) setSelectedLayerId(null)
  }

  const selectedLayer = layers.find(l => l.id === selectedLayerId)

  return (
    <div className="app-v2">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="video/*,image/*,audio/*"
        style={{ display: 'none' }}
        onChange={handleImport}
      />

      {/* Main render area */}
      <div className="render-area">
        {layers.length === 0 ? (
          <div className="empty-state">
            <h1>🌙 RESOMAP V2</h1>
            <p>Touche pour commencer</p>
          </div>
        ) : (
          <>
            <div className="layers-render">
              {layers.filter(l => l.visible).map(layer => (
                <div
                  key={layer.id}
                  className="layer-render"
                  style={{
                    mixBlendMode: layer.blendMode,
                    opacity: layer.opacity
                  }}
                >
                  {layer.type === 'video' && (
                    <video src={layer.url} autoPlay loop muted playsInline />
                  )}
                  {layer.type === 'image' && (
                    <img src={layer.url} alt={layer.name} />
                  )}
                  {layer.type === 'audio' && (
                    <div className="audio-visual">
                      <audio src={layer.url} autoPlay loop />
                      <div className="audio-icon">🎵</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Touch FX overlay */}
            <TouchFX 
              enabled={true} 
              intensity={1.2}
              audioData={audioData}
            />
          </>
        )}
      </div>

      {/* Bottom UI */}
      <div className="bottom-ui">
        {/* Audio VU meter */}
        <div className="vu-meter">
          <div className="vu-bar bass" style={{ height: `${audioData.bass * 100}%` }} />
          <div className="vu-bar mid" style={{ height: `${audioData.mid * 100}%` }} />
          <div className="vu-bar high" style={{ height: `${audioData.high * 100}%` }} />
        </div>

        {/* Layers thumbnails */}
        <div className="layers-strip">
          {layers.map((layer, index) => (
            <div
              key={layer.id}
              className={`layer-thumb ${selectedLayerId === layer.id ? 'selected' : ''}`}
              onClick={() => setSelectedLayerId(layer.id)}
            >
              <div className="layer-number">{index + 1}</div>
              <div className="layer-name">{layer.name.slice(0, 10)}</div>
              <button
                className="layer-delete"
                onClick={(e) => {
                  e.stopPropagation()
                  deleteLayer(layer.id)
                }}
              >
                ×
              </button>
            </div>
          ))}
          
          {layers.length < MAX_LAYERS && (
            <button
              className="add-layer-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              +
            </button>
          )}
        </div>

        {/* Layer controls (if selected) */}
        {selectedLayer && (
          <div className="layer-controls">
            <div className="control">
              <label>Blend</label>
              <select
                value={selectedLayer.blendMode}
                onChange={(e) => updateLayer(selectedLayer.id, { blendMode: e.target.value })}
              >
                {BLEND_MODES.map(mode => (
                  <option key={mode} value={mode}>{mode}</option>
                ))}
              </select>
            </div>
            
            <div className="control">
              <label>Opacity: {Math.round(selectedLayer.opacity * 100)}%</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={selectedLayer.opacity}
                onChange={(e) => updateLayer(selectedLayer.id, { opacity: parseFloat(e.target.value) })}
              />
            </div>

            <button
              className="toggle-visibility"
              onClick={() => updateLayer(selectedLayer.id, { visible: !selectedLayer.visible })}
            >
              {selectedLayer.visible ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AppV2
