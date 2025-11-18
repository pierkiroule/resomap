import React, { useRef, useEffect } from 'react'
import './Layer.css'

function Layer({ layer }) {
  const canvasRef = useRef(null)
  const mediaRef = useRef(null)

  useEffect(() => {
    if (layer.chromaKey.enabled && layer.type !== 'audio') {
      applyChromaKey()
    }
  }, [layer])

  const applyChromaKey = () => {
    const canvas = canvasRef.current
    const media = mediaRef.current
    
    if (!canvas || !media) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    
    const processFrame = () => {
      if (media.paused || media.ended) return
      
      canvas.width = media.videoWidth || media.naturalWidth || media.width
      canvas.height = media.videoHeight || media.naturalHeight || media.height
      
      ctx.drawImage(media, 0, 0, canvas.width, canvas.height)
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      
      const keyColor = hexToRgb(layer.chromaKey.color)
      const threshold = layer.chromaKey.threshold * 255
      const smoothness = layer.chromaKey.smoothness * 255
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        
        const distance = Math.sqrt(
          Math.pow(r - keyColor.r, 2) +
          Math.pow(g - keyColor.g, 2) +
          Math.pow(b - keyColor.b, 2)
        )
        
        if (distance < threshold) {
          const alpha = smoothness > 0 
            ? Math.max(0, (distance - threshold + smoothness) / smoothness)
            : 0
          data[i + 3] = alpha * 255
        }
      }
      
      ctx.putImageData(imageData, 0, 0)
      
      if (layer.type === 'video') {
        requestAnimationFrame(processFrame)
      }
    }
    
    if (layer.type === 'video') {
      media.addEventListener('play', processFrame)
      if (!media.paused) processFrame()
    } else if (layer.type === 'image' || layer.type === 'gif') {
      media.onload = processFrame
      if (media.complete) processFrame()
    }
  }

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 255, b: 0 }
  }

  const layerStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%) translate(${layer.position.x}px, ${layer.position.y}px) scale(${layer.scale}) rotate(${layer.rotation}deg)`,
    opacity: layer.opacity,
    mixBlendMode: layer.blendMode,
    pointerEvents: 'none',
  }

  const renderMedia = () => {
    switch (layer.type) {
      case 'image':
      case 'gif':
        if (layer.chromaKey.enabled) {
          return (
            <>
              <img
                ref={mediaRef}
                src={layer.url}
                alt={layer.name}
                style={{ display: 'none' }}
              />
              <canvas
                ref={canvasRef}
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              />
            </>
          )
        }
        return (
          <img
            src={layer.url}
            alt={layer.name}
            style={{ maxWidth: '100%', maxHeight: '100%' }}
          />
        )

      case 'video':
        if (layer.chromaKey.enabled) {
          return (
            <>
              <video
                ref={mediaRef}
                src={layer.url}
                autoPlay
                loop
                muted
                style={{ display: 'none' }}
              />
              <canvas
                ref={canvasRef}
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              />
            </>
          )
        }
        return (
          <video
            src={layer.url}
            autoPlay
            loop
            muted
            style={{ maxWidth: '100%', maxHeight: '100%' }}
          />
        )

      case 'audio':
        return (
          <div className="audio-visualizer">
            <audio src={layer.url} autoPlay loop />
            <div className="audio-icon">🎵</div>
            <div className="audio-name">{layer.name}</div>
          </div>
        )

      default:
        return <div>Type non supporté</div>
    }
  }

  return (
    <div className="layer" style={layerStyle}>
      {renderMedia()}
    </div>
  )
}

export default Layer
