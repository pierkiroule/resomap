class AudioAnalyzer {
  constructor() {
    this.audioContext = null
    this.analyzer = null
    this.dataArray = null
    this.bufferLength = null
    this.isAnalyzing = false
    this.audioSources = new Map() // Track audio sources for each layer
  }

  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      this.analyzer = this.audioContext.createAnalyser()
      this.analyzer.fftSize = 512
      this.bufferLength = this.analyzer.frequencyBinCount
      this.dataArray = new Uint8Array(this.bufferLength)
    }
    return this.audioContext
  }

  connectAudioElement(audioElement, layerId) {
    if (!this.audioContext) this.init()
    
    // Disconnect previous source if exists
    if (this.audioSources.has(layerId)) {
      const oldSource = this.audioSources.get(layerId)
      try {
        oldSource.disconnect()
      } catch (e) {
        // Source already disconnected
      }
    }

    try {
      const source = this.audioContext.createMediaElementSource(audioElement)
      source.connect(this.analyzer)
      this.analyzer.connect(this.audioContext.destination)
      this.audioSources.set(layerId, source)
      this.isAnalyzing = true
      return true
    } catch (error) {
      console.warn('Audio element already connected or error:', error)
      return false
    }
  }

  disconnectAudio(layerId) {
    if (this.audioSources.has(layerId)) {
      const source = this.audioSources.get(layerId)
      try {
        source.disconnect()
      } catch (e) {
        // Already disconnected
      }
      this.audioSources.delete(layerId)
    }
    
    if (this.audioSources.size === 0) {
      this.isAnalyzing = false
    }
  }

  getFrequencyData() {
    if (!this.analyzer || !this.isAnalyzing) {
      return { bass: 0, mid: 0, high: 0, overall: 0 }
    }

    this.analyzer.getByteFrequencyData(this.dataArray)

    // Split frequency ranges
    const bassEnd = Math.floor(this.bufferLength * 0.15)
    const midEnd = Math.floor(this.bufferLength * 0.5)

    let bass = 0
    let mid = 0
    let high = 0

    // Calculate bass (20Hz - 250Hz)
    for (let i = 0; i < bassEnd; i++) {
      bass += this.dataArray[i]
    }
    bass = bass / bassEnd / 255

    // Calculate mid (250Hz - 4kHz)
    for (let i = bassEnd; i < midEnd; i++) {
      mid += this.dataArray[i]
    }
    mid = mid / (midEnd - bassEnd) / 255

    // Calculate high (4kHz+)
    for (let i = midEnd; i < this.bufferLength; i++) {
      high += this.dataArray[i]
    }
    high = high / (this.bufferLength - midEnd) / 255

    // Overall level
    let overall = 0
    for (let i = 0; i < this.bufferLength; i++) {
      overall += this.dataArray[i]
    }
    overall = overall / this.bufferLength / 255

    return { bass, mid, high, overall }
  }

  resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }
  }

  destroy() {
    this.audioSources.forEach((source, layerId) => {
      try {
        source.disconnect()
      } catch (e) {
        // Already disconnected
      }
    })
    this.audioSources.clear()
    
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
    this.isAnalyzing = false
  }
}

export default AudioAnalyzer
