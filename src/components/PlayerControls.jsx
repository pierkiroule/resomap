import React, { useState, useEffect, useRef } from 'react'
import './PlayerControls.css'

function PlayerControls({ layers, onUpdateLayer }) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const intervalRef = useRef(null)

  // Get all video/audio layers
  const mediaLayers = layers.filter(l => l.type === 'video' || l.type === 'audio')

  // Update duration from longest media
  useEffect(() => {
    let maxDuration = 0
    mediaLayers.forEach(layer => {
      const element = document.querySelector(`[data-layer-id="${layer.id}"]`)
      if (element && element.duration && !isNaN(element.duration)) {
        maxDuration = Math.max(maxDuration, element.duration)
      }
    })
    if (maxDuration > 0) {
      setDuration(maxDuration)
    }
  }, [mediaLayers])

  // Update current time while playing
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        const videoElements = mediaLayers.map(l => 
          document.querySelector(`[data-layer-id="${l.id}"]`)
        ).filter(Boolean)
        
        if (videoElements.length > 0) {
          const avgTime = videoElements.reduce((sum, el) => sum + (el.currentTime || 0), 0) / videoElements.length
          setCurrentTime(avgTime)
        }
      }, 100)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying, mediaLayers])

  // Play/Pause all media
  const togglePlayPause = () => {
    mediaLayers.forEach(layer => {
      const element = document.querySelector(`[data-layer-id="${layer.id}"]`)
      if (element) {
        if (isPlaying) {
          element.pause()
        } else {
          element.play()
        }
      }
    })
    setIsPlaying(!isPlaying)
  }

  // Stop (pause + reset to 0)
  const handleStop = () => {
    mediaLayers.forEach(layer => {
      const element = document.querySelector(`[data-layer-id="${layer.id}"]`)
      if (element) {
        element.pause()
        element.currentTime = 0
      }
    })
    setIsPlaying(false)
    setCurrentTime(0)
  }

  // Seek
  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value)
    mediaLayers.forEach(layer => {
      const element = document.querySelector(`[data-layer-id="${layer.id}"]`)
      if (element) {
        element.currentTime = newTime
      }
    })
    setCurrentTime(newTime)
  }

  // Volume
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    mediaLayers.forEach(layer => {
      const element = document.querySelector(`[data-layer-id="${layer.id}"]`)
      if (element && (layer.type === 'video' || layer.type === 'audio')) {
        element.volume = isMuted ? 0 : newVolume
      }
    })
  }

  // Mute toggle
  const toggleMute = () => {
    const newMuted = !isMuted
    setIsMuted(newMuted)
    mediaLayers.forEach(layer => {
      const element = document.querySelector(`[data-layer-id="${layer.id}"]`)
      if (element && (layer.type === 'video' || layer.type === 'audio')) {
        element.volume = newMuted ? 0 : volume
      }
    })
  }

  // Playback speed
  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed)
    mediaLayers.forEach(layer => {
      const element = document.querySelector(`[data-layer-id="${layer.id}"]`)
      if (element) {
        element.playbackRate = speed
      }
    })
  }

  // Format time (seconds to MM:SS)
  const formatTime = (seconds) => {
    if (isNaN(seconds) || !isFinite(seconds)) return '00:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (mediaLayers.length === 0) {
    return null // No media to control
  }

  return (
    <div className="player-controls">
      {/* Transport controls */}
      <div className="transport-controls">
        <button 
          className="transport-btn"
          onClick={handleStop}
          title="Stop (⏹)"
        >
          ⏹
        </button>
        <button 
          className={`transport-btn play-btn ${isPlaying ? 'playing' : ''}`}
          onClick={togglePlayPause}
          title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
      </div>

      {/* Timeline */}
      <div className="timeline-section">
        <span className="time-display">{formatTime(currentTime)}</span>
        <input
          type="range"
          className="timeline-slider"
          min={0}
          max={duration || 100}
          step={0.1}
          value={currentTime}
          onChange={handleSeek}
        />
        <span className="time-display">{formatTime(duration)}</span>
      </div>

      {/* Volume */}
      <div className="volume-section">
        <button 
          className="volume-btn"
          onClick={toggleMute}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? '🔇' : volume > 0.5 ? '🔊' : volume > 0 ? '🔉' : '🔈'}
        </button>
        <input
          type="range"
          className="volume-slider"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>

      {/* Speed control */}
      <div className="speed-section">
        <span className="speed-label">Speed</span>
        <div className="speed-buttons">
          {[0.5, 1, 1.5, 2].map(speed => (
            <button
              key={speed}
              className={`speed-btn ${playbackSpeed === speed ? 'active' : ''}`}
              onClick={() => handleSpeedChange(speed)}
              title={`${speed}x speed`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PlayerControls
