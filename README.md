# Template de site vitrine — workflow Claude Code

## Comment démarrer un nouveau site client

1. Copie ce dossier entier avec un nom explicite :
   ```bash
   cp -r site-template client-boulangerie-dupont
   cd client-boulangerie-dupont
   ```

2. Lance Claude Code dans ce dossier :
   ```bash
   claude
   ```

3. Donne le brief du client en une fois, le plus précis possible :
   ```
   Nouveau client : boulangerie artisanale à Marseille, cible familles du
   quartier, ton chaleureux et authentique. Couleurs de la boutique :
   bordeaux foncé et jaune blé. Services : pain, viennoiseries, gâteaux
   sur commande. Pas encore de photos, utilise des placeholders clairs.
   Construis le site en suivant CLAUDE.md.
   ```

4. Itère avec des demandes précises plutôt que vagues :
   - Bien : "change le titre du hero pour X, passe la couleur d'accent en bordeaux"
   - Moins bien : "améliore le site"

5. Une fois satisfait, `/clear` avant de passer au client suivant dans un
   nouveau dossier — ne jamais réutiliser l'historique d'un client pour
   un autre.

## Déploiement rapide
Le site est 100% statique (HTML/CSS/JS), donc pour livrer une preview au
client sans rien configurer :
- Glisser le dossier sur https://app.netlify.com/drop
- Ou utiliser `vercel` en ligne de commande si tu as un compte Vercel

## Fichiers
- `CLAUDE.md` — instructions que Claude Code lit à chaque session
- `index.html` / `styles.css` / `script.js` — le squelette de départ
- `assets/` — dossier pour les images du client
