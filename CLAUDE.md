# Projet : site vitrine client

## État actuel — Gauts Studio (portfolio)

Ce dossier est le portfolio de Gauts Studio (Gauthier Roche, design
graphique). Il a été repris pour fixer l'en-tête et les transitions de page.
Ce qui suit décrit l'architecture en place pour que le prochain agent
travaille sans tout relire.

### Architecture
- Site multi-page statique, aucun build : `index.html` à la racine + 6 pages
  services dans `services/`. Un seul `styles.css`, un seul `script.js`.
- Header **partagé et injecté en JS** : chaque page contient juste
  `<header data-site-header></header>`. `script.js` lit la config `PAGES`
  et construit le header (nav gauche, logo centré, nav droite, hamburger,
  panneau dropdown). Source de vérité unique → modifier la nav dans
  `PAGES`, pas dans le HTML.
- Les chemins (`base`) sont déduits de **l'URL de `script.js`**, qui est à
  la racine du site. Ne pas revenir à un comptage de dossiers depuis
  `location.pathname` : ça casse en `file://` et en sous-dossier.
- Le footer, lui, est dupliqué dans chaque page (volontairement simple) —
  il est remplacé en même temps que `<main>` lors d'une navigation interne.
- Favicon : `favicon.ico` (32×32) à la racine, injecté par `script.js` et
  non déclaré dans le HTML des pages.

### Config `PAGES` (dans `script.js`)
```js
const PAGES = [ { href, label }, ... ];   // liens de navigation principaux
const ANCHOR_LINKS = [ { href, label } ]; // ex. « À propos » (#apropos)
const CTA = { href, label };              // bouton Contact
```
Le lien actif est détecté automatiquement par comparaison du `basename`
de l'URL — pas besoin de marquer la page courante dans le HTML. Les
chemins relatifs (`base`) sont calculés selon la profondeur du dossier,
donc le même header fonctionne à la racine et dans `services/`.

### Ajouter une page
1. Créer le fichier HTML (racine ou `services/`).
2. Y mettre le `<head>` Roboto + le bloc critique inline de transition +
   `<link rel="stylesheet" href="…">` + `<div class="page-transition" …>`
   + `<header data-site-header></header>`. **Copier littéralement ces
   blocs depuis une page existante** (ex. `services/logo.html`) — le bloc
   inline `<style>`+`<script>` avant la stylesheet est ce qui évite le
   flash à l'arrivée, ne pas le retirer.
3. Ajouter une entrée dans `PAGES` (`script.js`). C'est tout — la nav et
   le dropdown se mettent à jour partout automatiquement.

### Encoche de l'onglet actif (élément signature)
L'onglet courant est signalé par une **découpe peach dans le haut de la
barre navy**, tracée en un seul path SVG par `notchPath()` (`script.js`).
De gauche à droite : raccord concave → côté penché → coin bas arrondi →
base → coin bas arrondi → côté penché → raccord concave. Deux règles à
ne pas casser :
- la forme est un **trapèze** : la base est plus étroite que le sommet ;
- les raccords du haut sont **concaves et tournés vers l'extérieur** (le
  peach s'évase vers le fond de page), tangents au bord haut de la barre.
  C'est le sens inverse d'un simple `border-radius`, et l'erreur la plus
  facile à commettre en retouchant cette forme.

Réglages dans l'objet `NOTCH` : `fillet` (rayon des raccords), `slant`
(resserrement du trapèze), `radius` (coins du bas), `pad` (débord autour
de l'onglet), `depth` (profondeur), `duration` (glissement).

Tous les onglets ont la **même largeur** (`.nav-link { min-width }`) :
sans ça, la découpe change de gabarit à chaque clic et le rendu est sale.
Le remplissage de l'encoche doit rester **identique au fond de page**
(`--color-white`), c'est lui qu'on voit à travers la découpe — d'où le
`background` sur `.site-header`.

### Navigation entre pages
Par défaut, **aucun rechargement** : au clic sur un lien interne, `goTo()`
récupère la page cible en `fetch`, remplace le contenu de `<main>` (et du
footer), met l'URL à jour en `pushState`, puis rejoue `initPage()`. Le
corps de page sort vers la gauche et le nouveau entre par la droite
(`.is-swapping-out` / `.is-swapping-in`), dans le même sens que l'encoche
qui glisse vers le nouvel onglet. Les pages sont préchargées au survol et
mises en cache. `popstate` est géré (retour arrière).

**Repli — l'overlay navy (conservé volontairement).** Si le `fetch`
échoue (hors ligne, page ouverte en `file://`, page sans `<main>`), on
retombe sur une vraie redirection précédée de `navigateWithTransition` :
l'overlay fixe `#page-transition` balaie l'écran de droite à gauche
(`.is-covering`), la navigation se fait, puis à l'arrivée un script inline
du `<head>` lit `sessionStorage.pt-enter` et pose `html.pt-active` avant
le premier paint — l'overlay couvre immédiatement et repart vers la gauche
(`.is-leaving`). C'est aussi ce qui se passe si le JS de navigation est
absent. **Ne pas supprimer ce mécanisme** ni les blocs inline du `<head>`.
Dans ce cas, `sessionStorage.nav-from` permet à l'encoche de glisser depuis
l'ancien onglet à l'arrivée.

Exclusions (navigation normale du navigateur) : classe
`page-transition-skip`, `target=_blank`, `mailto:`, `tel:`, ancres de la
même page, origine croisée, clic avec Ctrl/Cmd/Maj/Alt.
`prefers-reduced-motion` est respecté partout (overlay masqué, glissements
désactivés).

### Menu déroulant (dropdown)
- Hamburger toujours visible (y compris desktop, comme dans `HUGO.svg`).
  `≥1180px` la nav en ligne est aussi affichée (en dessous, seuls le logo
  et le hamburger restent : la barre ne peut pas tenir 7 onglets).
- Le clic ouvre un panneau peach qui glisse de la droite ; fermeture par
  Échap, clic sur le fond, ou bouton de fermeture. Focus géré.

### Marque & design
- **Couleurs** (issues de `HUGO.svg`) : `--color-peach: #fcded0`,
  `--color-navy: #283977`. Le navy est le fond de l'en-tête et de
  l'overlay ; le peach est le texte du header, le fond du dropdown et
  les accents.
- **Police** : Roboto (Google Fonts) pour tout le texte du site et la nav.
  **Ne pas modifier `assets/logo.svg`** : c'est le logo exporté, il utilise
  ses propres polices vectorielles embarquées (LibreFranklin/Jost) — il
  reste tel quel.
- Référence design : `HUGO.svg` (export Adobe Illustrator) à interpréter
  **depuis son code SVG**, jamais via une capture PNG (perte de contexte).

### Ce que le prochain agent doit faire
- **Contenu de body** : les pages services ont des contenus provisoires
  (mockups `[MOCKUP À VENIR]`, section « page en cours de construction »,
  marqueurs de timeline 01/02/03 + « Étape 1/2/3 »). À remplacer par le
  vrai contenu du client / de vraies images.
- **Images réelles** dans `assets/` (placeholder mockups → vraies visuels).
- **Formulaire de contact** : déjà câblé côté front (validation), branché
  sur Formspree (`action="https://formspree.io/f/xlgyvnkq"`). Vérifier que
  l'endpoint est bien celui du client avant mise en prod, ou le remplacer.
- **Coordonnées** : actuelles (email/tél) présentes — confirmer avec le
  client avant prod.
- Respecter la convention « Livraison » ci-dessous (résumé 3-4 lignes).

---

## Stack
- HTML / CSS / JS pur, aucun build step, aucune dépendance npm.
- Un seul `index.html`, un seul `styles.css`, un seul `script.js` (+ pages
  dans `services/`).
- Objectif : pouvoir déployer en glissant le dossier sur Netlify Drop, Vercel,
  ou n'importe quel hébergement statique, sans étape de compilation.
- Polices : Google Fonts via `<link>` dans le `<head>` (pas d'import npm).
- Icônes : SVG inline copiés directement dans le HTML (pas de librairie externe).

## Avant de commencer un nouveau client
Remplis d'abord ces informations (demande-les à l'utilisateur si elles manquent) :
- Nom de l'entreprise / du client
- Secteur d'activité
- Public cible
- Ton souhaité (sérieux / chaleureux / premium / accessible...)
- Couleurs de marque si elles existent déjà (logo, charte)
- Contenu réel : textes, services, coordonnées (ne jamais inventer un numéro
  de téléphone ou une adresse réelle — utiliser des placeholders explicites
  du type `[TÉLÉPHONE]` tant que le client ne les a pas fournis)

## Direction design
- Ne jamais partir sur le look par défaut "IA" : fond crème + serif +
  accent terracotta, OU fond noir + accent néon, OU style journal avec
  filets fins. Choisir une direction spécifique au secteur et à la marque
  du client à chaque nouveau projet.
- Définir avant de coder : 4-6 couleurs nommées (hex), une police display
  + une police texte, un concept de mise en page en une phrase.
- Un seul élément "signature" fort par site (pas dix idées à moitié faites).
- Rester sobre partout ailleurs autour de cet élément signature.
- Respecter : responsive mobile, focus clavier visible, `prefers-reduced-motion`.

## Structure de page par défaut
1. Header / nav (logo + liens + CTA)
2. Hero (message principal + CTA)
3. Services / offres
4. Portfolio / réalisations (ou preuves sociales si pas de portfolio dispo)
5. À propos / pourquoi nous
6. Témoignages (si contenu fourni, sinon omettre plutôt qu'inventer des faux avis)
7. Contact (formulaire simple + coordonnées)
8. Footer

Adapter l'ordre et le contenu de ces sections selon le secteur du client —
ce n'est pas un ordre figé.

## Conventions de code
- Classes CSS en kebab-case, une feuille de style unique, variables CSS
  (`:root { --color-... }`) pour toutes les couleurs et tailles récurrentes.
- Mobile-first : écrire les styles de base pour mobile, puis les media
  queries pour les écrans plus larges.
- JS vanilla uniquement : menu mobile, smooth scroll, éventuel slider léger
  fait main. Pas de framework.
- Formulaire de contact : le laisser fonctionnel côté front (validation),
  mais prévenir l'utilisateur qu'il faudra brancher un service d'envoi
  (Formspree, Netlify Forms, etc.) avant mise en prod.

## Ce qu'il ne faut jamais faire
- Ne pas inventer de faux avis clients, fausses statistiques, ou fausses
  adresses/numéros de téléphone.
- Ne pas copier le contenu ou le design d'un concurrent existant.
- Ne pas ajouter de dépendances lourdes (frameworks JS, build tools) sauf
  demande explicite.

## Livraison
- Une fois le site validé, résumer en 3-4 lignes ce qui a été fait et ce
  qui reste à personnaliser (textes définitifs, images réelles, formulaire
  de contact, nom de domaine).