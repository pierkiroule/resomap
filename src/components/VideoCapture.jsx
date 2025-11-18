import React, { useState, useRef } from 'react'
import GifEncoder from '../utils/GifEncoder'
import './VideoCapture.css'

function VideoCapture({ canvasRef }) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [countdown, setCountdown] = useState(null)
  const [recordings, setRecordings] = useState([])
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)

  const startCapture = async () => {
    if (!canvasRef || !canvasRef.current) {
      alert('Impossible de capturer - viewer non disponible')
      return
    }

    // Countdown
    setCountdown(3)
    await new Promise(resolve => {
      let count = 3
      const countInterval = setInterval(() => {
        count--
        if (count > 0) {
          setCountdown(count)
        } else {
          clearInterval(countInterval)
          setCountdown(null)
          resolve()
        }
      }, 1000)
    })

    try {
      // Capture the canvas element
      const canvas = canvasRef.current.querySelector('.canvas')
      if (!canvas) {
        alert('Canvas non trouvé')
        return
      }

      // Create a stream from the canvas or viewport
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          mediaSource: 'screen'
        },
        audio: true
      })

      chunksRef.current = []
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 5000000
      })

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop())
        await processRecording()
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)

      // Auto-stop after 10 seconds
      timerRef.current = setTimeout(() => {
        stopCapture()
      }, 10000)

    } catch (error) {
      console.error('Erreur de capture:', error)
      alert('Erreur lors de la capture. Assurez-vous d\'autoriser le partage d\'écran.')
    }
  }

  const stopCapture = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }

  const processRecording = async () => {
    setIsProcessing(true)

    try {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' })
      const videoUrl = URL.createObjectURL(blob)

      // Create video element to process
      const video = document.createElement('video')
      video.src = videoUrl
      video.muted = true

      await new Promise((resolve) => {
        video.onloadedmetadata = resolve
      })

      // Create ping-pong effect
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')

      const frames = []
      const fps = 30
      const duration = video.duration
      const totalFrames = Math.floor(duration * fps)

      // Extract all frames
      for (let i = 0; i < totalFrames; i++) {
        video.currentTime = (i / fps)
        await new Promise(resolve => {
          video.onseeked = resolve
        })
        
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        frames.push(canvas.toDataURL('image/webp', 0.8))
      }

      // Create ping-pong sequence: forward + reverse
      const pingPongFrames = [...frames, ...frames.slice().reverse()]

      // Create the looping video
      const loopCanvas = document.createElement('canvas')
      loopCanvas.width = canvas.width
      loopCanvas.height = canvas.height
      const loopCtx = loopCanvas.getContext('2d')

      const loopStream = loopCanvas.captureStream(fps)
      const loopRecorder = new MediaRecorder(loopStream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 5000000
      })

      const loopChunks = []
      loopRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          loopChunks.push(event.data)
        }
      }

      loopRecorder.onstop = () => {
        const loopBlob = new Blob(loopChunks, { type: 'video/webm' })
        const loopUrl = URL.createObjectURL(loopBlob)
        
        const newRecording = {
          id: Date.now(),
          name: `Loop ${new Date().toLocaleTimeString()}`,
          url: loopUrl,
          blob: loopBlob,
          date: new Date(),
          frames: pingPongFrames.length,
          duration: (pingPongFrames.length / fps).toFixed(1)
        }

        setRecordings(prev => [...prev, newRecording])
        setIsProcessing(false)
      }

      // Render ping-pong animation
      loopRecorder.start()
      
      for (let i = 0; i < pingPongFrames.length; i++) {
        const img = new Image()
        img.src = pingPongFrames[i]
        await new Promise(resolve => {
          img.onload = () => {
            loopCtx.drawImage(img, 0, 0)
            resolve()
          }
        })
        await new Promise(resolve => setTimeout(resolve, 1000 / fps))
      }

      loopRecorder.stop()

    } catch (error) {
      console.error('Erreur de traitement:', error)
      setIsProcessing(false)
      alert('Erreur lors du traitement de la vidéo')
    }
  }

  const downloadRecording = (recording, format = 'webm') => {
    const a = document.createElement('a')
    a.href = recording.url
    a.download = `resomap-loop-${recording.id}.${format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const exportAsGif = async (recording) => {
    setIsProcessing(true)
    
    try {
      // Load the video
      const video = document.createElement('video')
      video.src = recording.url
      video.muted = true
      
      await new Promise((resolve) => {
        video.onloadedmetadata = resolve
      })

      // Create canvas for frame extraction
      const canvas = document.createElement('canvas')
      canvas.width = Math.min(video.videoWidth, 480) // Limit width for GIF size
      canvas.height = Math.min(video.videoHeight, 270)
      const ctx = canvas.getContext('2d')

      const fps = 15 // Reduced FPS for smaller GIF
      const duration = video.duration
      const totalFrames = Math.floor(duration * fps)

      // Extract frames
      const frames = []
      for (let i = 0; i < totalFrames; i++) {
        video.currentTime = (i / fps)
        await new Promise(resolve => {
          video.onseeked = resolve
        })
        
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        frames.push(canvas.toDataURL('image/webp', 0.6))
      }

      // Create GIF/Animated WebP
      const encoder = new GifEncoder(canvas.width, canvas.height, fps)
      frames.forEach(frame => encoder.addFrame(frame))
      const gifBlob = await encoder.finish()
      
      // Download
      const gifUrl = URL.createObjectURL(gifBlob)
      const a = document.createElement('a')
      a.href = gifUrl
      a.download = `resomap-loop-${recording.id}.webm` // Animated WebP format
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      
      setIsProcessing(false)
    } catch (error) {
      console.error('Erreur export GIF:', error)
      alert('Erreur lors de l\'export GIF')
      setIsProcessing(false)
    }
  }

  const exportAsMp4 = async (recording) => {
    setIsProcessing(true)
    
    try {
      // Create a new recording with MP4 codec if supported
      const video = document.createElement('video')
      video.src = recording.url
      video.muted = true
      
      await new Promise((resolve) => {
        video.onloadedmetadata = resolve
      })

      video.play()

      // Create canvas stream
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')

      const stream = canvas.captureStream(30)
      
      // Try MP4 codec, fallback to WebM
      let mimeType = 'video/mp4;codecs=avc1'
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm;codecs=h264'
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'video/webm;codecs=vp9'
        }
      }

      const recorder = new MediaRecorder(stream, {
        mimeType: mimeType,
        videoBitsPerSecond: 8000000
      })

      const chunks = []
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data)
      }

      recorder.onstop = () => {
        const mp4Blob = new Blob(chunks, { type: mimeType })
        const mp4Url = URL.createObjectURL(mp4Blob)
        
        const a = document.createElement('a')
        a.href = mp4Url
        const extension = mimeType.includes('mp4') ? 'mp4' : 'webm'
        a.download = `resomap-loop-${recording.id}.${extension}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        
        setIsProcessing(false)
      }

      recorder.start()

      // Render video to canvas
      const renderLoop = () => {
        if (!video.paused && !video.ended) {
          ctx.drawImage(video, 0, 0)
          requestAnimationFrame(renderLoop)
        } else {
          recorder.stop()
        }
      }
      
      renderLoop()

    } catch (error) {
      console.error('Erreur export MP4:', error)
      alert('Erreur lors de l\'export MP4. Utilisant le format WebM.')
      downloadRecording(recording, 'webm')
      setIsProcessing(false)
    }
  }

  const deleteRecording = (id) => {
    setRecordings(recordings.filter(r => r.id !== id))
  }

  return (
    <div className="video-capture">
      <div className="capture-controls">
        {!isRecording && !isProcessing && (
          <button className="capture-btn" onClick={startCapture}>
            🎥 Capturer Loop (10s)
          </button>
        )}

        {isRecording && (
          <div className="recording-status">
            <div className="rec-indicator">
              <div className="rec-dot"></div>
              <span>Enregistrement...</span>
            </div>
            <button className="stop-btn" onClick={stopCapture}>
              ⏹️ Stop
            </button>
          </div>
        )}

        {isProcessing && (
          <div className="processing-status">
            <div className="spinner"></div>
            <span>Création du loop ping-pong...</span>
          </div>
        )}
      </div>

      {countdown !== null && (
        <div className="countdown-overlay">
          <div className="countdown-number">{countdown}</div>
        </div>
      )}

      {recordings.length > 0 && (
        <div className="recordings-gallery">
          <h4>🎬 Vos Loops</h4>
          <div className="gallery-grid">
            {recordings.map((rec) => (
              <div key={rec.id} className="recording-card">
                <video 
                  src={rec.url} 
                  loop 
                  autoPlay 
                  muted
                  className="preview-video"
                />
                <div className="card-info">
                  <div className="card-title">{rec.name}</div>
                  <div className="card-meta">
                    {rec.frames} frames • {rec.duration}s loop
                  </div>
                </div>
                <div className="card-actions">
                  <button 
                    className="export-btn"
                    onClick={() => downloadRecording(rec, 'webm')}
                    title="Télécharger WebM"
                  >
                    🎬 WebM
                  </button>
                  <button 
                    className="export-btn"
                    onClick={() => exportAsMp4(rec)}
                    title="Export MP4/H264"
                  >
                    🎥 MP4
                  </button>
                  <button 
                    className="export-btn gif"
                    onClick={() => exportAsGif(rec)}
                    title="Export GIF animé"
                  >
                    🖼️ GIF
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => deleteRecording(rec.id)}
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoCapture
