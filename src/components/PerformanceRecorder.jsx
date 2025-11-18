import React, { useState, useRef } from 'react'
import './PerformanceRecorder.css'

function PerformanceRecorder({ layers, onRestoreSnapshot }) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordings, setRecordings] = useState([])
  const [currentRecording, setCurrentRecording] = useState(null)
  const recordingDataRef = useRef([])
  const startTimeRef = useRef(null)

  const startRecording = () => {
    setIsRecording(true)
    startTimeRef.current = Date.now()
    recordingDataRef.current = []
    
    // Take initial snapshot
    recordingDataRef.current.push({
      timestamp: 0,
      layers: JSON.parse(JSON.stringify(layers))
    })
  }

  const stopRecording = () => {
    setIsRecording(false)
    const duration = Date.now() - startTimeRef.current
    
    const newRecording = {
      id: Date.now(),
      name: `Performance ${new Date().toLocaleTimeString()}`,
      duration: duration,
      data: recordingDataRef.current,
      date: new Date()
    }
    
    setRecordings([...recordings, newRecording])
    setCurrentRecording(null)
  }

  const playRecording = (recording) => {
    let currentFrame = 0
    const startTime = Date.now()
    
    const playFrame = () => {
      const elapsed = Date.now() - startTime
      
      // Find the appropriate frame
      const frame = recording.data.find((frame, index) => {
        const nextFrame = recording.data[index + 1]
        return frame.timestamp <= elapsed && (!nextFrame || nextFrame.timestamp > elapsed)
      })
      
      if (frame) {
        onRestoreSnapshot(frame.layers)
      }
      
      if (elapsed < recording.duration) {
        requestAnimationFrame(playFrame)
      }
    }
    
    playFrame()
  }

  const deleteRecording = (id) => {
    setRecordings(recordings.filter(r => r.id !== id))
  }

  const saveSnapshot = () => {
    const snapshot = {
      id: Date.now(),
      name: `Snapshot ${new Date().toLocaleTimeString()}`,
      layers: JSON.parse(JSON.stringify(layers)),
      date: new Date()
    }
    
    setRecordings([...recordings, { ...snapshot, type: 'snapshot' }])
  }

  const formatDuration = (ms) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="performance-recorder">
      <div className="recorder-controls">
        {!isRecording ? (
          <>
            <button className="rec-btn start" onClick={startRecording}>
              ⏺️ Enregistrer
            </button>
            <button className="snapshot-btn" onClick={saveSnapshot}>
              📸 Snapshot
            </button>
          </>
        ) : (
          <button className="rec-btn stop" onClick={stopRecording}>
            ⏹️ Stop
          </button>
        )}
      </div>

      {isRecording && (
        <div className="recording-indicator">
          <div className="pulse-dot"></div>
          <span>Enregistrement en cours...</span>
        </div>
      )}

      <div className="recordings-list">
        <h4>Enregistrements & Snapshots</h4>
        {recordings.length === 0 ? (
          <p className="empty-list">Aucun enregistrement</p>
        ) : (
          recordings.map((rec) => (
            <div key={rec.id} className="recording-item">
              <div className="rec-info">
                <span className="rec-icon">
                  {rec.type === 'snapshot' ? '📸' : '🎬'}
                </span>
                <div>
                  <div className="rec-name">{rec.name}</div>
                  {rec.duration && (
                    <div className="rec-duration">{formatDuration(rec.duration)}</div>
                  )}
                </div>
              </div>
              <div className="rec-actions">
                {rec.type === 'snapshot' ? (
                  <button 
                    className="play-btn"
                    onClick={() => onRestoreSnapshot(rec.layers)}
                    title="Charger ce snapshot"
                  >
                    ⚡
                  </button>
                ) : (
                  <button 
                    className="play-btn"
                    onClick={() => playRecording(rec)}
                    title="Rejouer"
                  >
                    ▶️
                  </button>
                )}
                <button 
                  className="delete-btn"
                  onClick={() => deleteRecording(rec.id)}
                  title="Supprimer"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default PerformanceRecorder
