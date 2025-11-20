# Haïmoji (version ado-adulte)

Haïmoji est une mini webapp React + Vite pensée pour aider un ado ou un adulte à prendre un pas de recul sur un souci en choisissant trois émojis-guides. Tout se passe côté front, sans IA ni backend.

## But de l’app
- proposer un rituel rapide autour de trois émojis pour identifier pensées, sensations physiques et futur mojo ;
- garder l’expérience ultra simple, mobile-first, sans champ de texte ni compte ;
- offrir un résumé lisible et un texte de soutien léger qui peut être relu à tout moment.

## Stack & choix techniques
- React 18 + Vite, écriture en JavaScript.
- Aucune dépendance UI lourde, uniquement quelques styles dans `src/App.css`.
- Pas de persistance pour l’instant : l’état vit uniquement le temps de la session.

## Lancer le projet
```bash
npm install
npm run dev
```
Ensuite, ouvre l’URL fournie par Vite (généralement http://localhost:5173) sur ton navigateur mobile ou desktop.

## Déroulé des étapes Haïmoji
1. **Étape 0 – Accueil**  
   Présentation rapide, phrase-mantra « Un émoji comme un rayon de soleil dans ton nuage de problème » et bouton « Commencer ».
2. **Étape 1 – Émoji des pensées**  
   Une grille de 15 émojis adaptés aux pensées/bad mood. Choisir ton mental du moment débloque « Suivant ».
3. **Étape 2 – Émoji du corps**  
   Même UI, mais orientée sensations physiques (tension, chaleur, fatigue, etc.). L’émoji choisi valide l’étape.
4. **Étape 3 – Émoji du futur mojo**  
   On imagine le petit mieux à venir et on choisit l’émoji positif qui va avec, avant de cliquer sur « Voir mon Haïmoji ».
5. **Étape 4 – Résumé**  
   Affichage des trois émojis (pensées, corps, futur mojo) avec pictos 🧠 / 🫀 / 🌟, texte de soutien personnalisé et bouton « Refaire un Haïmoji » qui relance le flow à l’étape 1.

Tu peux dupliquer ce squelette pour explorer d’autres rituels, ajouter de la persistance ou des variantes de textes plus tard. Pour l’instant, tout est prêt à l’emploi pour un usage 100 % client-side. Bon tirage ! ✨
