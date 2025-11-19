import React, { useRef, useEffect } from 'react'

/**
 * PingPongVideo - Vidéo en mode ping-pong infini
 * 
 * Joue la vidéo en avant, puis en arrière, puis en avant, etc.
 * Loop infini automatique.
 */
function PingPongVideo({ src, style, className, layerId }) {
  const videoRef = useRef(null)
  const directionRef = useRef(1) // 1 = forward, -1 = reverse

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let animationFrameId = null
    let lastTime = 0

    const pingPong = () => {
      if (!video.paused && !video.ended) {
        const currentTime = video.currentTime
        const duration = video.duration

        // Si on atteint la fin en mode forward
        if (directionRef.current === 1 && currentTime >= duration) {
          directionRef.current = -1 // Switch to reverse
          video.currentTime = duration - 0.05 // Petit recul
        }
        
        // Si on atteint le début en mode reverse
        if (directionRef.current === -1 && currentTime <= 0) {
          directionRef.current = 1 // Switch to forward
          video.currentTime = 0.05 // Petit avancement
        }

        // Mise à jour du temps selon la direction
        if (directionRef.current === -1) {
          // Mode reverse : reculer manuellement
          const delta = (performance.now() - lastTime) / 1000
          video.currentTime = Math.max(0, currentTime - delta * video.playbackRate)
        }
      }

      lastTime = performance.now()
      animationFrameId = requestAnimationFrame(pingPong)
    }

    // Start video
    video.play().catch(err => console.log('Video play error:', err))
    
    // Start ping-pong loop
    lastTime = performance.now()
    pingPong()

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [src])

  return (
    <video
      ref={videoRef}
      src={src}
      data-layer-id={layerId}
      muted
      playsInline
      className={className}
      style={style}
    />
  )
}

export default PingPongVideo
