

📘 README — Haïmoji•° (version minimale)

Webapp React + Vite — générateur multimodal poétique basé sur 3 emojis.


---

🌟 Description

Haïmoji•° est une webapp minimaliste.
Tu choisis 3 émojis :

1. dissonance (surface)


2. profondeur (enjeu)


3. mojonance (solution)



L’app génère alors :

un haïku texte (générateur local combinatoire)

un triptyque d’images (3 images prédéfinies remplies aléatoirement)

un mix audio basé sur 1 sample par emoji

un mix vidéo VJ (3 clips en overlay)
→ tout en client-side, sans IA ni backend.


Version P0 = squelette fonctionnel + UI simple.


---

🧩 Fonctionnalités (P0 sans IA)

1. Sélection des émojis (3 étapes)

Emoji 1 = dissonance

Emoji 2 = profondeur

Emoji 3 = mojonance


2. Générateur A.I.ku local

3 tableaux de lignes (début / pivot / sortie)

1 haïku = ligne A + ligne B + ligne C

64 000 combinaisons possibles

Zéro IA


3. Triptyque d’images

Dossier /public/images/

50 images abstraites

3 tirées aléatoirement

affichage en colonne ou grille


4. Mix audio minimal

Chaque emoji = 1 sample .mp3

3 samples mixés en parallèle

Volume léger

Fade-in / fade-out

WebAudio API


5. Mix vidéo VJ léger

Chaque emoji = 1 clip .mp4

3 clips joués en overlay + blend mode CSS

Légère pulsation


6. Bouton “Rejouer / Régénérer”

Recharge aléatoire du haïku

Recharge du triptyque

Recharge du mix audio

Recharge du VJ mix



---

🏗️ Architecture technique

haimoji/
 ├─ public/
 │   ├─ images/        (50 images abstraites)
 │   ├─ audio/         (samples emoji)
 │   └─ video/         (clips VJ)
 ├─ src/
 │   ├─ components/
 │   │   ├─ EmojiPicker.jsx
 │   │   ├─ HaikuGenerator.jsx
 │   │   ├─ Triptych.jsx
 │   │   ├─ AudioMixer.jsx
 │   │   └─ VideoMixer.jsx
 │   ├─ data/
 │   │   ├─ haikuLinesA.js
 │   │   ├─ haikuLinesB.js
 │   │   └─ haikuLinesC.js
 │   ├─ App.jsx
 │   └─ main.jsx
 ├─ index.html
 ├─ package.json
 └─ vite.config.js


---

🛠️ Installation

npm install
npm run dev


---

🚀 Usage

1. Ouvre l’app.


2. Choisis ton émoji de dissonance.


3. Choisis ton émoji profondeur.


4. Choisis ton émoji mojonance.


5. L’app génère automatiquement :

haïku

triptyque visuel

mix audio

mix VJ vidéo



6. Clique “Rejouer” pour une nouvelle version.




---

🎨 Design minimal

fond neutre

emojis très lisibles

transitions légères

sans fioritures

responsive mobile-first



---

📦 Roadmap P0 (livrable minimal)

[ ] UI 3 écrans d’emoji

[ ] générateur haïku local

[ ] triptyque images

[ ] mix audio 3 samples

[ ] mix vidéo 3 overlays

[ ] bouton replay

[ ] mode plein écran

[ ] dépôt sur GitHub



---

📦 Roadmap P1 (après P0)

[ ] système Cosmoji (version statique)

[ ] transition narrative entre les 3 niveaux

[ ] presets émotionnels

[ ] animations CSS plus douces

[ ] sauvegarde locale (localStorage)



---

🌌 Vision (future Premium)

Boost InspirIA (1/jour)

Cosmoji vivant

triptyques IA

haïkus IA

vidéos 3 minutes

constellation personnelle

identité MojoMaster



---

📄 Licence

Libre pour usage personnel.
Commercialisation réservée au projet Haïmoji•°.


---

Si tu veux, je peux te donner :
👉 la version “README PRO” pour GitHub (plus formelle)
👉 les fichiers haikuLinesA/B/C.js
👉 les noms de dossiers exacts
👉 le App.jsx minimal pour démarrer.
