# 🌙 Resomap - Générateur de Rêve Multimédia

Une webapp React moderne pour créer des compositions multimédias immersives avec support de calques hétérogènes, effets d'overlay et chromakey.

## ✨ Fonctionnalités

- **🎨 Éditeur Multi-Calques** : Superposez et organisez différents types de médias
- **👁️ Viewer en Temps Réel** : Visualisez vos créations instantanément avec différents fonds
- **📁 Support Multi-Format** : Images (JPG, PNG, GIF), Vidéos (MP4, WebM), Audio (MP3, WAV)
- **🎭 Effets Avancés** :
  - **Chromakey** (fond vert/bleu) avec contrôle de seuil et lissage
  - **12 modes de fusion** (overlay, multiply, screen, etc.)
  - **8 filtres visuels** : Blur, Brightness, Contrast, Saturate, Hue Rotate, Grayscale, Sepia, Invert
  - **4 presets de filtres** : Vibrant, Dramatique, Noir & Blanc, Vintage
  - **Opacité, rotation, échelle** par calque
- **🎨 Gestion des Transparences** : 
  - 4 types de fond : Noir, Blanc, Grille de transparence, Dégradé
  - Visualisation optimale des effets d'overlay et de mélange
- **🎬 Interface Moderne** : Design élégant avec animations fluides

## 🚀 Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour la production
npm run build
```

## 🎯 Utilisation

1. **Importer des Médias** : Cliquez sur "📁 Importer Média" pour ajouter des fichiers
2. **Organiser les Calques** : Utilisez les flèches ⬆️⬇️ pour réorganiser l'ordre
3. **Ajuster les Propriétés de Base** :
   - Sélectionnez un calque pour modifier ses propriétés
   - Ajustez l'opacité, l'échelle, la rotation
   - Choisissez un mode de fusion parmi 12 options
4. **Appliquer des Filtres Visuels** :
   - Utilisez les 8 filtres disponibles (blur, brightness, contrast, etc.)
   - Essayez les 4 presets : ☀️ Vibrant, 🌙 Dramatique, ⚫ Noir & Blanc, 📜 Vintage
   - Réinitialisez les filtres avec le bouton 🔄 Reset
5. **Appliquer le Chromakey** :
   - Activez le chromakey dans les propriétés
   - Sélectionnez la couleur à supprimer
   - Ajustez le seuil et le lissage
6. **Choisir le Fond** : 
   - ⚫ Noir (par défaut)
   - ⚪ Blanc
   - 🔲 Grille de transparence
   - 🌈 Dégradé
7. **Profitez du Résultat** : Votre composition s'affiche en temps réel dans le viewer

## 🎨 Effets Disponibles

### Modes de Fusion
- Normal
- Multiply
- Screen
- Overlay
- Darken / Lighten
- Color Dodge / Color Burn
- Hard Light / Soft Light
- Difference / Exclusion

### Filtres CSS
- **Blur** : Flou artistique (0-20px)
- **Brightness** : Luminosité (0-200%)
- **Contrast** : Contraste (0-200%)
- **Saturate** : Saturation des couleurs (0-200%)
- **Hue Rotate** : Rotation de teinte (0-360°)
- **Grayscale** : Niveaux de gris (0-100%)
- **Sepia** : Effet sépia vintage (0-100%)
- **Invert** : Inversion des couleurs (0-100%)

### Presets de Filtres
- ☀️ **Vibrant** : +20% luminosité, +10% contraste, +20% saturation
- 🌙 **Dramatique** : -10% luminosité, +20% contraste, -20% saturation
- ⚫ **Noir & Blanc** : 100% grayscale, +10% contraste
- 📜 **Vintage** : 80% sépia, +10% luminosité

## 🛠️ Technologies

- React 18
- Vite (Build tool ultra-rapide)
- CSS3 avec animations
- Canvas API pour le chromakey
- HTML5 Video/Audio APIs

## 📝 Structure du Projet

```
resomap/
├── src/
│   ├── components/
│   │   ├── Editor.jsx       # Panneau d'édition
│   │   ├── Viewer.jsx       # Viewer de composition
│   │   ├── LayerPanel.jsx   # Gestion des calques
│   │   └── Layer.jsx        # Rendu d'un calque
│   ├── App.jsx              # Composant principal
│   └── main.jsx             # Point d'entrée
├── package.json
└── vite.config.js
```

## 🌟 Fonctionnalités Techniques

- **Chromakey en Temps Réel** : Utilise Canvas API pour le traitement d'image pixel par pixel
- **Support Vidéo** : Traitement frame par frame pour l'effet chromakey sur vidéos
- **Filtres CSS Combinés** : Application de multiples filtres simultanément pour des effets complexes
- **Modes de Fusion Avancés** : Utilise CSS `mix-blend-mode` pour des mélanges professionnels
- **Gestion des Transparences** : Plusieurs types de fond pour visualiser les effets alpha
- **Gestion d'État Réactive** : Mise à jour instantanée du viewer
- **Performance Optimisée** : Rendu efficace avec React

## 🎭 Mode Performance VJ

Active le mode révolutionnaire de VJing tactile audio-réactif :

### Gestes Tactiles
- **Glisser** : Déplacer les calques en temps réel
- **Scroll** : Zoomer/dézoomer
- **Shift + Scroll** : Rotation
- **Ctrl + Scroll** : Contrôle du blur
- **Pinch (2 doigts)** : Zoom simultané
- **Rotate (2 doigts)** : Rotation gestuelle

### Audio-Réactivité Live
- Liaison des paramètres visuels aux fréquences audio
- Visualisation en temps réel (bass, mid, high)
- Modulation automatique sync audio
- Presets audio-réactifs

### Recording & Playback
- 🎬 Enregistrez vos performances live
- 📸 Prenez des snapshots de vos scènes
- ▶️ Rejouez vos performances
- 💾 Sauvegardez et partagez vos créations

### 🎥 Loop Video Recorder (RÉVOLUTIONNAIRE !)
Capturer des loops vidéo de 10 secondes avec effet **ping-pong automatique** :
- **Countdown 3-2-1** avant capture
- **Auto-loop parfait** : lecture normale + reverse
- **Export multi-format** :
  - 🎬 WebM (haute qualité)
  - 🎥 MP4/H264 (compatible partout)
  - 🖼️ GIF animé (optimisé, 15 FPS)
- **Galerie visuelle** avec preview loop
- Créez des loops hypnotiques en secondes !

**C'est comme un Boomerang Instagram mais pour VJs ! 🌀✨**

### Prochaines Fonctionnalités
- Effets de glitch audio-réactifs
- Transitions automatiques intelligentes
- Systèmes de particules
- MIDI/OSC support
- Export vidéo
- Mode multi-joueurs

Voir `VISION.md` pour la roadmap complète ! 🚀

---

Créé avec ❤️ pour transformer vos rêves en réalité multimédia !