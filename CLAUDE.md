# Projet : site vitrine client

## Stack
- HTML / CSS / JS pur, aucun build step, aucune dépendance npm.
- Un seul `index.html`, un seul `styles.css`, un seul `script.js`.
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
