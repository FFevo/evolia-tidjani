# KAERON — audit et automatisation pour entreprises

Landing page React, TypeScript et Vite pour le site https://kayron-site.netlify.app/. La marque KAERON et son offre proviennent de https://offre-kaeron.vercel.app/ et https://theme-kaeron.vercel.app/index.html.

## Développement

```sh
npm ci
npm run dev
npm run build
```

Le hero associe une image de forteresse et de loup générée pour KAERON (WebP desktop et mobile, 107 et 99 Ko) aux Light Rays de React Bits (MIT). Les rayons gardent un équivalent statique pour mouvement réduit et absence de WebGL ; le rendu animé s'arrête hors écran et lorsque l'onglet est masqué. L'ancien composant forteresse SVG reste dans `src/components/FortressBackground.tsx` pour un éventuel retour arrière.

La balise de suivi `https://ok-ko.io/tracking-helper.js` est intégrée une seule fois. Son runtime conserve les paramètres d'attribution de session et les ajoute aux liens HTTP(S) et aux iframes. Voir la politique de confidentialité pour les limites documentées.

Tous les CTA d’audit ouvrent `https://ok-ko.io/go/kaeron`, destination centralisée dans `src/lib/external-form.ts`. La destination ne dépend pas d’une variable d’environnement. Aucun formulaire n’a été soumis lors de la validation.

Les mentions légales, la confidentialité et les CGU identifient KAERON à partir de la fiche officielle de l’Annuaire des entreprises (SIREN 999495674), consultée le 7 octobre 2026. Les pages décrivent le formulaire et le lecteur VSL externes. Aucun courriel ni téléphone n’est publié à la demande du propriétaire ; le formulaire et l’adresse postale sont les points de contact. Les modalités de conservation et de traitement propres aux services tiers restent à confirmer.
