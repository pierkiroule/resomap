# 🌙 RESOMAP - VJ Artistique Tactile

> **"Au bout du doigt, le rêve en image"**

Une application web révolutionnaire pour le **VJing tactile audioréactif**. Dessine sur l'écran comme un patineur sur glace, et regarde tes vidéos s'animer en temps réel ! 🎨✨

---

## 🎯 CONCEPT

**RESOMAP** transforme ton écran en une surface magique où chaque geste devient art visuel.

### L'Expérience

1. **👆 DESSINE** avec ton doigt sur l'écran
2. **🎨 LES FORMES** que tu crées contrôlent les effets
3. **🎵 L'AUDIO** booste automatiquement le tout
4. **✨ LA MAGIE** opère instantanément

Pas de sliders. Pas de réglages précis. **Juste ton doigt et ta créativité.**

---

## ✨ FONCTIONNALITÉS

### 🎨 Drawing Canvas
- **Multi-touch trails** : Plusieurs doigts = plusieurs traces colorées
- **Détection de formes** : Circle, Line, Zigzag, Spiral automatiquement détectés
- **Trails animés** : Glow audio-réactif, fade progressif, couleurs uniques
- **Système de particules** : Points lumineux le long des trajectoires

### 🎭 6 Modes Prédéfinis

#### 🌈 **PSYCHÉDÉLIQUE**
Couleurs explosives, rotations rapides, effets psychédéliques intenses

#### ⚡ **GLITCH**
Effets numériques chaotiques, displacement, RGB split, digital noise

#### 🌊 **SMOOTH**
Transitions fluides et douces, blur artistique, mouvements lents

#### 💥 **STROBE**
Flash et contraste intense, effets de lumière stroboscopique

#### 🌀 **VORTEX**
Spirales et distorsions, effet tourbillon, radial blur

#### 🎨 **PAINTING**
Effet aquarelle et artistique, brush strokes, color bleeding

### 🎵 Audio-Réactivité Automatique

L'audio contrôle **automatiquement** tous les effets :

- **Bass** : Glow, scale, displacement
- **Mid** : Hue rotation, color shift
- **High** : Brightness, sparkle, saturation

### 🎬 Support Multi-Média

- **Images** : JPG, PNG, GIF
- **Vidéos** : MP4, WebM, MOV
- **Audio** : MP3, WAV, OGG

---

## 🚀 QUICK START

### Installation

```bash
npm install
```

### Lancement

```bash
npm run dev
```

Ouvre [http://localhost:5173](http://localhost:5173) dans ton navigateur.

### Build Production

```bash
npm run build
```

---

## 🎮 COMMENT UTILISER

### 1. Importe tes médias

Clique sur **"➕ Ajouter Média"** et sélectionne tes vidéos/images/audio.

### 2. Choisis un mode

Sélectionne un des **6 modes** dans le panneau en haut à gauche :
- 🌈 Psychédélique
- ⚡ Glitch
- 🌊 Smooth
- 💥 Strobe
- 🌀 Vortex
- 🎨 Painting

### 3. Dessine !

**👆 Utilise ton doigt** (ou ta souris) pour dessiner sur l'écran.

**Les formes créent des effets :**
- **Cercle** → Rotation, hue shift
- **Ligne droite** → Translation, blur
- **Zigzag** → Glitch, chaos
- **Spirale** → Vortex, twist

### 4. Laisse l'audio guider

Si tu as importé un fichier audio, les effets s'intensifient automatiquement avec le son ! 🎵

---

## 🎨 MAPPING DES EFFETS

### Formes → Effets

| Forme | Effets générés |
|-------|----------------|
| **Circle** | Rotation continue, hue cycling, scale pulse |
| **Line** | Translation, blur motion, brightness boost |
| **Zigzag** | Glitch intense, displacement chaos, flicker |
| **Spiral** | Vortex distortion, radial blur, twist |
| **Curve** | Smooth transitions, color flow, soft blur |

### Audio → Intensité

| Fréquence | Impact |
|-----------|--------|
| **Bass** (0-250Hz) | Glow size, scale, displacement, blur |
| **Mid** (250-2000Hz) | Hue rotation, color shift, rotation speed |
| **High** (2000-20000Hz) | Brightness, saturation, sparkle, contrast |

---

## 🎭 MODES DÉTAILLÉS

### 🌈 Mode PSYCHÉDÉLIQUE

**Idéal pour :** Ambiances psychédéliques, festivals, expériences immersives

**Effets :**
- Hue rotation rapide basée sur position X
- Scale pulse audio-réactif (bass)
- Brightness boost (vélocité + high)
- Saturation maximale
- Blur oscillant

**Formes spéciales :**
- Circle → Rotation continue
- Spiral → Rotation 2x + scale 1.4x

---

### ⚡ Mode GLITCH

**Idéal pour :** Techno, effets digitaux, cyberpunk

**Effets :**
- Displacement aléatoire (bass)
- Contrast boost (mid)
- RGB split simulation
- Hue rotation chaotique (zigzag)
- Invert aléatoire

**Formes spéciales :**
- Zigzag → Hue aléatoire + invert possible

---

### 🌊 Mode SMOOTH

**Idéal pour :** Ambient, chill, transitions douces

**Effets :**
- Blur important (vélocité + bass)
- Opacity 0.9
- Brightness subtil (high)
- Hue rotation douce (position X + mid)
- Scale léger (bass)

**Style :** Fluide, apaisant, artistique

---

### 💥 Mode STROBE

**Idéal pour :** Drops, climax, energy peaks

**Effets :**
- Flash activé si bass > 0.6 ou vélocité > 0.7
- Brightness 200% (flash) / 80% (normal)
- Contrast 200% (flash) / 100% (normal)
- Invert aléatoire durant flash

**Attention :** Effets intenses !

---

### 🌀 Mode VORTEX

**Idéal pour :** Effets hypnotiques, transitions complexes

**Effets :**
- Rotation continue
- Scale oscillant (intensité vélocité + bass)
- Blur audio-réactif (mid)
- Scale X/Y différentiels (distorsion radiale)

**Formes spéciales :**
- Spiral → Rotation 2x + scale 1.4x

---

### 🎨 Mode PAINTING

**Idéal pour :** Art visuel, organic, watercolor

**Effets :**
- Blur artistique (vélocité)
- Saturation boost (mid)
- Brightness subtil (high)
- Hue rotation position X
- Opacity 0.95

**Formes spéciales :**
- Circle/Spiral → Blur +2

---

## 📱 MOBILE FIRST

**RESOMAP** est optimisé pour les **appareils tactiles** :

✅ Multi-touch natif
✅ Responsive design
✅ Gestures optimisés
✅ Performance 60fps

**Fonctionne sur :**
- 📱 Smartphones (iOS, Android)
- 🖥️ Tablettes
- 💻 Desktop (avec souris)

---

## 🛠️ ARCHITECTURE TECHNIQUE

### Stack

- **React 18** : UI framework
- **Vite** : Build tool ultra-rapide
- **Canvas API** : Rendering des trails
- **Web Audio API** : Analyse audio temps réel
- **CSS3** : Filters & transforms hardware-accelerated

### Components

```
App.jsx
└── ArtisticVJ.jsx
    ├── DrawingCanvas.jsx (trails + shapes detection)
    ├── ModeSelector.jsx (6 modes buttons)
    └── Layer rendering (video/image/audio)

Utils
├── AudioAnalyzer.js (frequency analysis)
└── effectModes.js (modes config + effects calculation)
```

### Performance

- **60fps** rendering via `requestAnimationFrame`
- **Hardware acceleration** pour filters CSS
- **Throttled updates** pour éviter surcharge
- **Canvas optimization** (devicePixelRatio)

---

## 🎯 EXEMPLES D'USAGE

### Session VJ Live

```
1. Prépare 3-4 vidéos en avance
2. Import audio track (musique live)
3. Start mode 🌊 Smooth (intro)
4. Build up avec 🌈 Psychédélique
5. Drop avec ⚡ Glitch ou 💥 Strobe
6. Break avec 🌀 Vortex
7. Outro avec 🎨 Painting
```

### Performance Freestyle

```
1. Import médias variés
2. Laisse l'audio jouer
3. Ferme les yeux
4. Sens le rythme
5. Dessine librement
6. Magie ! ✨
```

### Installation Artistique

```
1. Setup grand écran tactile
2. Loop vidéos ambient
3. Mode 🎨 Painting ou 🌊 Smooth
4. Laisse le public interagir
5. Chaque session unique !
```

---

## 🎨 TIPS & ASTUCES

### Pour des effets intenses
- Utilise mode **⚡ Glitch** ou **💥 Strobe**
- Dessine rapidement (haute vélocité)
- Multiplie les trails (plusieurs doigts)

### Pour des effets doux
- Utilise mode **🌊 Smooth** ou **🎨 Painting**
- Dessine lentement
- Formes circulaires et courbes

### Pour synchroniser avec l'audio
- Les effets sont **automatiquement** audio-réactifs !
- Le bass contrôle l'intensité
- Les highs ajoutent du sparkle

### Pour créer des patterns
- Dessine des formes répétitives
- Alterne entre différentes formes
- Combine plusieurs doigts

---

## 🚧 ROADMAP

### Version 2.0 (Prochainement)

- [ ] **Recording** : Capturer les performances en vidéo
- [ ] **Presets** : Sauvegarder tes configurations
- [ ] **MIDI support** : Contrôle via hardware
- [ ] **Webcam input** : Utilise ta caméra comme source
- [ ] **3D effects** : WebGL pour effets avancés
- [ ] **Collaborative** : Session VJ multi-utilisateurs

### Version 2.1

- [ ] **AI shape recognition** : Détection avancée
- [ ] **Beat detection** : Sync parfait avec BPM
- [ ] **OSC support** : Intégration Resolume/TouchDesigner
- [ ] **Shader editor** : Crée tes propres effets

---

## 🤝 CONTRIBUTION

Les contributions sont les bienvenues ! 🎉

### Comment contribuer

1. Fork le projet
2. Crée une branche (`git checkout -b feature/AmazingFeature`)
3. Commit tes changes (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvre une Pull Request

---

## 📄 LICENSE

MIT License - Utilise librement, crée, partage ! ❤️

---

## 🙏 CREDITS

### Inspiration

- **Resolume** : VJ software professionnel
- **TouchDesigner** : Générateur visuel temps réel
- **Ableton Live** : Workflow intuitif
- **Light painting** : Traces lumineuses artistiques

### Technologies

- React Team
- Vite Team
- Web Audio API
- Canvas API

---

## 💬 CONTACT & SUPPORT

**Questions ?** Ouvre une issue sur GitHub

**Showcase ?** Tag #RESOMAP sur les réseaux !

**Pro support ?** Contact via GitHub

---

## 🎨 PHILOSOPHIE

> RESOMAP croit que **la création visuelle doit être accessible à tous**.
> 
> Pas besoin d'être expert. Pas de courbe d'apprentissage.
> Juste toi, ton doigt, et ta créativité.
> 
> **L'art au bout des doigts.** 🌙✨

---

**Développé avec ❤️ pour la communauté VJ** 🎭

**"Au bout du doigt, le rêve en image"** 🌙
