# Gauts Studio — portfolio

Site portfolio de Gauts Studio (Gauthier Roche), design graphique :
logo, identité de marque, charte graphique, cartes de visite, affiches,
rebranding, sites web. Site statique 100 % HTML/CSS/JS, aucun build.

## Stack
- HTML / CSS / JS pur, aucune dépendance npm, aucun build step.
- `index.html` à la racine + 6 pages services dans `services/`.
- Un seul `styles.css`, un seul `script.js`.
- Police : Roboto (Google Fonts). Logo : `assets/logo.svg` (ne pas modifier).
- Déploiement : glisser le dossier sur Netlify Drop, ou Vercel.

## Structure
```
index.html              # accueil
services/
  sites-web.html
  logo.html
  charte-graphique.html
  cartes-de-visite.html
  affiches.html
  rebranding.html
styles.css              # tous les styles (mobile-first, variables CSS)
script.js               # header partagé + dropdown + transitions de page
                        # (+ carousel/timeline existants)
assets/
  logo.svg              # logo exporté — ne pas modifier
  *.png                 # mockups / images
favicon.ico             # favicon (injecté par script.js)
HUGO.svg                # référence design (export Illustrator)
header_gauts_anim.html  # maquette de référence de l'en-tête (non servie)
CLAUDE.md               # instructions pour l'agent
```

## En-tête partagé + système de pages
Le header n'est pas écrit en dur dans chaque page : chaque page contient
juste `<header data-site-header></header>` et `script.js` construit le
header à partir de la config `PAGES` (source de vérité unique) : nav à
gauche, logo centré, nav à droite, hamburger.

**Ajouter une page** :
1. Créer le HTML (racine ou `services/`). Copier le `<head>` complet
   (Roboto + bloc inline `<style>`/`<script>` de transition + stylesheet)
   et le `<div class="page-transition">…</div>` + `<header data-site-header>`
   depuis une page existante — le bloc inline avant la stylesheet évite le
   flash à l'arrivée, ne pas le retirer.
2. Ajouter une entrée dans `PAGES` (`script.js`). La nav et le dropdown
   se mettent à jour partout. Le lien actif est auto-détecté par URL.

## Encoche de l'onglet actif
L'onglet courant est marqué par une découpe peach dans le haut de la barre
navy : trapèze (base plus étroite que le sommet), coins bas arrondis et
raccords concaves évasés vers le fond de page. Elle glisse d'un onglet à
l'autre à chaque changement de page. Tous les onglets ont la même largeur
pour que la découpe garde le même gabarit. Réglages : objet `NOTCH` dans
`script.js`.

## Navigation
Par défaut, **sans rechargement** : le contenu de `<main>` est récupéré en
`fetch` et remplacé à la volée (URL mise à jour en `pushState`, pages
préchargées au survol). Le contenu sort vers la gauche, le nouveau entre
par la droite, dans le même sens que l'encoche.

Repli conservé : si `fetch` échoue, une vraie redirection a lieu, précédée
d'un overlay navy qui balaie l'écran de droite à gauche. C'est notamment
le cas en ouvrant les fichiers en `file://` (Chrome y bloque `fetch`) —
**pour tester la navigation interne, il faut servir le dossier en HTTP** :

```bash
python -m http.server 8765     # puis http://127.0.0.1:8765/index.html
```

Voir `CLAUDE.md` pour le détail des deux mécanismes.

## État du projet
Fait :
- En-tête partagé injecté en JS (config `PAGES`) : logo centré, onglets de
  largeur égale, hamburger toujours visible, dropdown coulissant.
- Encoche peach de l'onglet actif (trapèze + raccords concaves) qui glisse
  d'un onglet à l'autre.
- Navigation interne sans rechargement, avec repli sur une redirection
  précédée de l'overlay navy. Accessible (`prefers-reduced-motion`).
- Roboto appliqué au texte du site ; logo laissé intact.
- Couleurs de marque `#fcded0` (peach) + `#283977` (navy) issues de `HUGO.svg`.

Reste à personnaliser (prochain agent) :
- Contenu de body des pages services (mockups placeholders, sections
  « en construction », marqueurs de timeline) → vrai contenu + vraies images.
- Vérifier l'endpoint Formspree du formulaire de contact avant prod.
- Confirmer les coordonnées (email / téléphone) avec le client.

Voir `CLAUDE.md` pour les conventions complètes.