// Simplified GIF encoder using modern canvas techniques
class GifEncoder {
  constructor(width, height, fps = 30, quality = 10) {
    this.width = width
    this.height = height
    this.fps = fps
    this.delay = Math.floor(1000 / fps)
    this.quality = quality
    this.frames = []
  }

  addFrame(imageData) {
    this.frames.push(imageData)
  }

  async finish() {
    // Note: This is a placeholder. For real GIF encoding, we'd use a library like gif.js
    // For now, we'll create an animated WebP as fallback which has better support
    return this.createAnimatedWebP()
  }

  async createAnimatedWebP() {
    // Create a canvas for encoding
    const canvas = document.createElement('canvas')
    canvas.width = this.width
    canvas.height = this.height
    const ctx = canvas.getContext('2d')

    // For animated format, we'll use MediaRecorder approach
    const stream = canvas.captureStream(this.fps)
    const recorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: 2500000
    })

    const chunks = []
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data)
    }

    return new Promise((resolve) => {
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' })
        resolve(blob)
      }

      recorder.start()

      // Render all frames
      let frameIndex = 0
      const renderFrame = () => {
        if (frameIndex < this.frames.length) {
          const img = new Image()
          img.onload = () => {
            ctx.drawImage(img, 0, 0, this.width, this.height)
            frameIndex++
            setTimeout(renderFrame, this.delay)
          }
          img.src = this.frames[frameIndex]
        } else {
          recorder.stop()
        }
      }

      renderFrame()
    })
  }
}

export default GifEncoder
