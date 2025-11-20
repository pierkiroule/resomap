# Haïmoji (ado-adulte)

Mini webapp React + Vite pour aider quelqu’un à regarder son bad mood, sentir ce que ça fait dans le corps, puis imaginer la mini-solution qui rend les choses un peu plus respirables. Tout est client-side, sans IA ni backend.

## But de l’app
- guider un focus rapide en 3 émojis (mental, corps, futur mojo) ;
- rester mobile-first, tactile, sans saisie et sans friction ;
- livrer un écran final motivant (haïku, visuel, mini vibe audio, CTA premium).

## Stack & choix techniques
- React 18 + Vite, uniquement du JavaScript.
- Styling custom léger dans `src/App.css`.
- Audio et visuels tirés d’actifs locaux (`src/assets`), aucune requête réseau.

## Lancer
```bash
npm install
npm run dev
```
Ouvre ensuite http://localhost:5173 sur mobile ou desktop.

## Flow Haïmoji
1. **Hero / Accueil**  
   Carte sombre “HAÏMOJI•° – Si t’es kéblo, retrouve ton mojo” + bouton “Commencer”.
2. **1) Ton bad mood**  
   Grille d’émojis mentaux 😡 😢 😶 😤 😰 😞 😵 😬 😔. Tu valides et tu passes à l’étape suivante.
3. **2) Ce que ça te fait dans le corps**  
   Émojis corporels 💔 🤢 😖 😣 🤯 😩 🫨 🫁 🔥, toujours le même composant `EmojiSelector`.
4. **3) Ta mini-solution**  
   Émojis positifs 🌱 ✨ 🕊️ 💫 🌈 🌞 💡 🔓 🫶 pour visualiser le petit mieux qui arrive.
5. **4) Gate “Ton Haïmoji”**  
   Récapitulatif du trio et bouton « Générer mon Haïmoji » (désactivé tant que les trois choix ne sont pas faits).
6. **Écran résultat**  
   - trio emojis mis en avant ;  
   - mini-haïku généré (phrase par emoji) ;  
   - triptyque visuel (3 images locales tirées au hasard) ;  
   - mini vibe audio de 20 s (3 samples locaux mixés, bouton ▶️/⏸️) ;  
   - encart “Option Premium · MojoMaster” listant les futures features.  
   Bouton « Refaire un Haïmoji » pour relancer le rituel.

Tu peux partir de ce squelette pour ajouter persistance, sauvegardes ou autres rituels. Bon tirage ! ✨
