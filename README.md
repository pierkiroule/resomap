# 🌙 Resomap - Générateur de Rêve Multimédia

Une webapp React moderne pour créer des compositions multimédias immersives avec support de calques hétérogènes, effets d'overlay et chromakey.

## ✨ Fonctionnalités

- **🎨 Éditeur Multi-Calques** : Superposez et organisez différents types de médias
- **👁️ Viewer en Temps Réel** : Visualisez vos créations instantanément
- **📁 Support Multi-Format** : Images (JPG, PNG, GIF), Vidéos (MP4, WebM), Audio (MP3, WAV)
- **🎭 Effets Avancés** :
  - Chromakey (fond vert/bleu) avec contrôle de seuil et lissage
  - 12 modes de fusion (overlay, multiply, screen, etc.)
  - Opacité, rotation, échelle par calque
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
3. **Ajuster les Propriétés** :
   - Sélectionnez un calque pour modifier ses propriétés
   - Ajustez l'opacité, l'échelle, la rotation
   - Choisissez un mode de fusion
4. **Appliquer le Chromakey** :
   - Activez le chromakey dans les propriétés
   - Sélectionnez la couleur à supprimer
   - Ajustez le seuil et le lissage
5. **Profitez du Résultat** : Votre composition s'affiche en temps réel dans le viewer

## 🎨 Modes de Fusion Disponibles

- Normal
- Multiply
- Screen
- Overlay
- Darken / Lighten
- Color Dodge / Color Burn
- Hard Light / Soft Light
- Difference / Exclusion

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
- **Gestion d'État Réactive** : Mise à jour instantanée du viewer
- **Performance Optimisée** : Rendu efficace avec React

Créé avec ❤️ pour transformer vos rêves en réalité multimédia !