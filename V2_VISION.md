# 🎨 RESOMAP V2 - Vision Clean

## 🎯 OBJECTIF

Une app VJing **mobile-first, tactile, audioreactive** qui MARCHE.

**Principe** : Minimaliste, naturelle, addictive.

---

## ✨ FONCTIONNALITÉS

### 1. Import Simple
- 1 MP3 (ou micro live)
- Max 4 vidéos/gifs/images
- Mini-vignettes en bas

### 2. Layers (Max 4)
- 1 vidéo + 1 blend mode + 1 FX
- Blend modes : add, screen, multiply, overlay, soft-light

### 3. FX (7 au total)
1. **Warp liquide** (WebGL shader)
2. **Ripple** (canvas)
3. **Glow dynamique** (shader)
4. **Pixel stretch** (canvas)
5. **Chromatic shift** (RGB split shader)
6. **Blur directionnel** (directional blur shader)
7. **Fractal noise** (shader noise)

**Contrôle** :
- Glissé horizontal = intensité
- Glissé vertical = vitesse/fréquence

### 4. Audio-Réactivité
- Analyse : bass / mid / high
- Checkboxes simples :
  - Bass → Scale
  - Mid → Distortion
  - High → Opacity
  - Overall → Color shift

### 5. Gestes Naturels
- **Centre** : Crossfader circulaire (mix global)
- **Bords** : Tap → sélectionner layer
- **Pinch** : Zoom FX intensity
- **Rotate 2 doigts** : Rotation layer
- **Swipe 3 doigts** : Switch scène

### 6. Timeline
- Scrubber live en bas
- Bouton loop par layer
- Bouton reverse
- Bouton strobe

### 7. Mode Performance
- HUD minimale :
  - Mini vumètre
  - Layers light
  - Crossfade discret
- Tout le reste disparaît

### 8. Recording
- Export vidéo 1080p + audio
- Preset TikTok/Reels
- Record gestures (replay)

---

## 🎨 UX MOBILE-FIRST

### Écran Principal
```
┌─────────────────────────────────────┐
│                                     │
│      RENDU LIVE (fullscreen)       │
│                                     │
│                                     │
│                                     │
├─────────────────────────────────────┤
│ [🎬][🎬][🎬][🎬] ← 4 layers max    │
│  ▓▓▓ Bass  Mid  High (vumètre)     │
└─────────────────────────────────────┘
```

### Mode Tactile
- Fond = rendu live
- Effet liquide sous les doigts
- Distorsions TouchDesigner-like
- Haptic feedback
- Couleurs auto depuis vidéo

### Scenes (Max 6)
- Swipe horizontal pour changer
- Comme Ableton Scenes

### Presets
1. **Fluid Dream** (liquide + glow)
2. **Strobe Pulse** (hard FX rythmiques)
3. **Organic Flow** (blend soft + grains)

---

## 🛠️ STACK TECHNIQUE

### Core
- React 18 (minimal)
- Vite
- TypeScript (optionnel)

### Gestes
- Hammer.js (multi-touch)

### FX Engine
- WebGL (Three.js ou shader custom)
- Canvas 2D (effets simples)

### Audio
- Web Audio API (AnalyserNode)
- MediaRecorder (export)

### UI
- CSS3 (animations, transitions)
- Tailwind CSS (optionnel)

---

## 📱 MOBILE OPTIMIZATION

### Performance
- Max 4 layers (hard limit)
- FX optimisés WebGL
- 60fps constant
- Lazy loading

### Touch
- Gestures natifs
- Haptic feedback
- Double-tap actions
- Long-press menus

### Responsive
- Mobile-first
- Landscape optimized
- Tablet support

---

## 🚀 PHASES DE DEV

### Phase 1 : Core (Week 1)
- [ ] Architecture clean
- [ ] Max 4 layers
- [ ] Blend modes CSS
- [ ] Audio analyzer

### Phase 2 : Gestes (Week 2)
- [ ] Hammer.js setup
- [ ] Multi-touch detection
- [ ] Crossfader circulaire
- [ ] Layer select
- [ ] Pinch/Rotate

### Phase 3 : FX (Week 3)
- [ ] 7 FX WebGL shaders
- [ ] Contrôle H/V
- [ ] Real-time rendering

### Phase 4 : Audio (Week 4)
- [ ] Bass/Mid/High analysis
- [ ] Checkbox UI
- [ ] Smooth reactivity

### Phase 5 : Timeline (Week 5)
- [ ] Scrubber
- [ ] Loop/Reverse/Strobe
- [ ] Mini-vignettes

### Phase 6 : Performance (Week 6)
- [ ] Mode Performance
- [ ] HUD minimale
- [ ] Optimizations

### Phase 7 : Recording (Week 7)
- [ ] MediaRecorder
- [ ] 1080p export
- [ ] Gesture replay

---

## 💡 UNIQUE VALUE PROPOSITION

✅ **Full tactile** : Pas de sliders, juste des gestes  
✅ **Audio simple** : 3 bandes, 4 paramètres  
✅ **Minimalisme** : 10 FX ultra optimisés  
✅ **VJing émotionnel** : Manipuler la matière visuelle  
✅ **Mobile-first** : Performant sur smartphone  

---

## 🎯 SUCCESS METRICS

- **< 3s** : Premier layer importé
- **< 10s** : Premier FX appliqué
- **< 30s** : Première performance live
- **60fps** : Constant sur mobile
- **< 50ms** : Touch latency

---

**"VJing mobile tactile. Simple. Puissant. Addictif."** 🎨✨
