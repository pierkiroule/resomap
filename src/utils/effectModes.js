/**
 * Modes d'effets prédéfinis pour le VJ artistique
 * 
 * Chaque mode définit comment les shapes/trails/audio
 * sont mappés aux effets visuels
 */

export const EFFECT_MODES = {
  psychedelic: {
    id: 'psychedelic',
    name: '🌈 Psychédélique',
    description: 'Couleurs explosives, rotations rapides',
    
    // Mapping shape → effect
    shapeEffects: {
      circle: {
        rotation: 'intense', // rotation continue
        hueRotation: 'rainbow', // cycle de couleurs
        scale: 'pulse' // pulse rythmique
      },
      line: {
        translation: 'smooth',
        brightness: 'boost',
        saturation: 'max'
      },
      zigzag: {
        hueRotation: 'chaotic',
        scale: 'bounce',
        blur: 'pulsing'
      },
      spiral: {
        rotation: 'vortex',
        hueRotation: 'spiral',
        scale: 'expand'
      },
      curve: {
        hueRotation: 'flow',
        blur: 'soft',
        brightness: 'wave'
      }
    },
    
    // Audio reactivity config
    audioReactive: {
      bass: {
        scale: 0.8,
        glow: 1.5,
        blur: 0.5
      },
      mid: {
        hueRotation: 180,
        rotation: 45
      },
      high: {
        brightness: 50,
        saturation: 100,
        sparkle: true
      }
    },
    
    // Base effects (toujours actifs)
    baseEffects: {
      saturate: 200,
      brightness: 110,
      contrast: 110
    }
  },

  glitch: {
    id: 'glitch',
    name: '⚡ Glitch',
    description: 'Effets numériques chaotiques',
    
    shapeEffects: {
      circle: {
        displacement: 'circular',
        rgbSplit: 'pulse'
      },
      line: {
        scanlines: true,
        displacement: 'linear',
        chromatic: true
      },
      zigzag: {
        displacement: 'chaos',
        rgbSplit: 'intense',
        digitalNoise: true
      },
      spiral: {
        displacement: 'vortex',
        twist: true
      },
      curve: {
        displacement: 'wave',
        chromatic: true
      }
    },
    
    audioReactive: {
      bass: {
        displacement: 1.0,
        rgbSplit: 0.8
      },
      mid: {
        scanlines: true,
        glitchIntensity: 0.7
      },
      high: {
        digitalNoise: 0.5,
        flicker: true
      }
    },
    
    baseEffects: {
      contrast: 130,
      saturate: 120
    }
  },

  smooth: {
    id: 'smooth',
    name: '🌊 Smooth',
    description: 'Transitions fluides et douces',
    
    shapeEffects: {
      circle: {
        rotation: 'slow',
        scale: 'gentle'
      },
      line: {
        translation: 'fluid',
        blur: 'soft'
      },
      zigzag: {
        blur: 'wave',
        opacity: 'fade'
      },
      spiral: {
        rotation: 'smooth-vortex',
        blur: 'radial'
      },
      curve: {
        blur: 'motion',
        opacity: 'wave'
      }
    },
    
    audioReactive: {
      bass: {
        scale: 0.3,
        blur: 0.8
      },
      mid: {
        hueRotation: 30,
        rotation: 15
      },
      high: {
        brightness: 20,
        glow: 0.5
      }
    },
    
    baseEffects: {
      blur: 3,
      brightness: 105,
      saturate: 110
    }
  },

  strobe: {
    id: 'strobe',
    name: '💥 Strobe',
    description: 'Flash et contraste intense',
    
    shapeEffects: {
      circle: {
        flash: 'circular',
        contrast: 'extreme'
      },
      line: {
        flash: 'linear',
        invert: 'pulse'
      },
      zigzag: {
        flash: 'chaos',
        contrast: 'spike'
      },
      spiral: {
        flash: 'vortex',
        invert: 'spiral'
      },
      curve: {
        flash: 'wave',
        contrast: 'flow'
      }
    },
    
    audioReactive: {
      bass: {
        flash: 1.5,
        contrast: 1.0
      },
      mid: {
        brightness: 100,
        invert: true
      },
      high: {
        flash: 2.0,
        sharpness: 1.5
      }
    },
    
    baseEffects: {
      contrast: 150,
      brightness: 100
    }
  },

  vortex: {
    id: 'vortex',
    name: '🌀 Vortex',
    description: 'Spirales et distorsions',
    
    shapeEffects: {
      circle: {
        twist: 'circular',
        radialBlur: 'pulse'
      },
      line: {
        twist: 'linear',
        displacement: 'wave'
      },
      zigzag: {
        twist: 'chaos',
        displacement: 'turbulent'
      },
      spiral: {
        twist: 'intense',
        radialBlur: 'vortex',
        rotation: 'spiral'
      },
      curve: {
        twist: 'smooth',
        displacement: 'flow'
      }
    },
    
    audioReactive: {
      bass: {
        twist: 1.2,
        radialBlur: 0.8
      },
      mid: {
        rotation: 60,
        displacement: 0.7
      },
      high: {
        twist: 0.5,
        sparkle: true
      }
    },
    
    baseEffects: {
      saturate: 130,
      contrast: 110
    }
  },

  painting: {
    id: 'painting',
    name: '🎨 Painting',
    description: 'Effet aquarelle et artistique',
    
    shapeEffects: {
      circle: {
        watercolor: 'circular',
        blend: 'soft'
      },
      line: {
        brushStroke: 'linear',
        colorBleed: 'trail'
      },
      zigzag: {
        splatter: true,
        colorBleed: 'chaos'
      },
      spiral: {
        watercolor: 'vortex',
        blend: 'swirl'
      },
      curve: {
        brushStroke: 'smooth',
        watercolor: 'flow'
      }
    },
    
    audioReactive: {
      bass: {
        brushSize: 0.8,
        colorIntensity: 0.6
      },
      mid: {
        hueRotation: 45,
        saturation: 30
      },
      high: {
        brightness: 20,
        colorBleed: 0.4
      }
    },
    
    baseEffects: {
      blur: 2,
      saturate: 140,
      brightness: 105
    }
  }
}

/**
 * Calculer les effets finaux basés sur :
 * - Mode actif
 * - Shape détectée
 * - Velocity du trait
 * - Audio data
 */
export function calculateEffects(mode, shapeData, audioData) {
  const modeConfig = EFFECT_MODES[mode]
  if (!modeConfig) return {}

  const { shape, velocity, points } = shapeData
  const shapeConfig = modeConfig.shapeEffects[shape] || {}
  const audioConfig = modeConfig.audioReactive
  const baseEffects = modeConfig.baseEffects

  // Calculer position moyenne du trait (pour mapping spatial)
  const avgX = points.reduce((sum, p) => sum + p.x, 0) / points.length
  const avgY = points.reduce((sum, p) => sum + p.y, 0) / points.length

  // Normaliser vélocité (0-1)
  const normalizedVelocity = Math.min(velocity / 1000, 1)

  // Build effects object
  const effects = { ...baseEffects }

  // === PSYCHEDELIC MODE ===
  if (mode === 'psychedelic') {
    effects.hueRotate = (avgX * 360 + Date.now() / 10) % 360
    effects.scale = 1 + Math.sin(Date.now() / 500) * 0.3 + (audioData.bass || 0) * 0.8
    effects.brightness = 100 + normalizedVelocity * 50 + (audioData.high || 0) * 50
    effects.saturate = 200 + (audioData.high || 0) * 100
    effects.blur = 2 + Math.sin(Date.now() / 300) * 3
    
    if (shape === 'circle') {
      effects.rotation = (Date.now() / 20) % 360
    } else if (shape === 'spiral') {
      effects.rotation = (Date.now() / 10) % 360
      effects.scale *= 1.3
    }
  }

  // === GLITCH MODE ===
  else if (mode === 'glitch') {
    const glitchAmount = normalizedVelocity * (audioData.bass || 0)
    effects.translateX = (Math.random() - 0.5) * glitchAmount * 50
    effects.translateY = (Math.random() - 0.5) * glitchAmount * 50
    effects.contrast = 130 + (audioData.mid || 0) * 50
    effects.saturate = 120 + (audioData.high || 0) * 80
    
    if (shape === 'zigzag') {
      effects.hueRotate = Math.random() * 360
      if (Math.random() > 0.7) effects.invert = 100
    }
  }

  // === SMOOTH MODE ===
  else if (mode === 'smooth') {
    effects.blur = 5 + normalizedVelocity * 10 + (audioData.bass || 0) * 5
    effects.opacity = 0.9
    effects.brightness = 100 + (audioData.high || 0) * 20
    effects.hueRotate = avgX * 60 + (audioData.mid || 0) * 30
    effects.scale = 1 + (audioData.bass || 0) * 0.3
  }

  // === STROBE MODE ===
  else if (mode === 'strobe') {
    const strobeActive = (audioData.bass || 0) > 0.6 || normalizedVelocity > 0.7
    effects.brightness = strobeActive ? 200 : 80
    effects.contrast = strobeActive ? 200 : 100
    effects.saturate = strobeActive ? 200 : 80
    
    if (strobeActive && Math.random() > 0.5) {
      effects.invert = 100
    }
  }

  // === VORTEX MODE ===
  else if (mode === 'vortex') {
    const vortexIntensity = normalizedVelocity + (audioData.bass || 0)
    effects.rotation = (Date.now() / 30) % 360
    effects.scale = 1 + Math.sin(Date.now() / 400) * 0.4 * vortexIntensity
    effects.blur = 3 + (audioData.mid || 0) * 8
    
    if (shape === 'spiral') {
      effects.rotation *= 2
      effects.scale *= 1.4
    }
    
    // Effet de distorsion radiale (simulé avec scale oscillant)
    effects.scaleX = effects.scale * (1 + Math.sin(Date.now() / 200) * 0.2)
    effects.scaleY = effects.scale * (1 - Math.sin(Date.now() / 200) * 0.2)
  }

  // === PAINTING MODE ===
  else if (mode === 'painting') {
    effects.blur = 2 + normalizedVelocity * 3
    effects.saturate = 140 + (audioData.mid || 0) * 40
    effects.brightness = 105 + (audioData.high || 0) * 20
    effects.hueRotate = avgX * 45
    effects.opacity = 0.95
    
    if (shape === 'circle' || shape === 'spiral') {
      effects.blur += 2
    }
  }

  return effects
}

/**
 * Appliquer les effets à un layer
 */
export function applyEffectsToLayer(layer, effects) {
  const {
    hueRotate = 0,
    saturate = 100,
    brightness = 100,
    contrast = 100,
    blur = 0,
    invert = 0,
    scale = 1,
    scaleX = scale,
    scaleY = scale,
    rotation = 0,
    translateX = 0,
    translateY = 0,
    opacity = 1
  } = effects

  return {
    ...layer,
    filters: {
      hueRotate,
      saturate,
      brightness,
      contrast,
      blur,
      invert
    },
    transform: {
      scale: scaleX !== scale || scaleY !== scale 
        ? { x: scaleX, y: scaleY }
        : scale,
      rotation,
      translateX,
      translateY
    },
    opacity
  }
}
