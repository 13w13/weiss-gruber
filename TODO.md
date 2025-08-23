# Plan de développement — Weiss‑Gruber

Priorité actuelle: finaliser le catalogue (données + images). Ensuite CMS, puis architecture.

## Phase 1 — Catalogue des vitraux (PRIORITÉ)
- [ ] Compléter `vitraux_metadata.csv` (43 entrées) avec tous les champs requis
  - id, title_fr, title_en (optionnel)
  - year, building_name, building_type, city, department
  - location_in_building, type_of_work, theme
  - description_fr (1–2 phrases min), alt_fr, alt_en
  - main_image (nom exact du fichier), credit_photo, photo_status
- [ ] Normaliser les valeurs (types d’édifice, villes, départements)
- [ ] Vérifier la correspondance images ⇄ métadonnées
  - Noms des fichiers cohérents, présence dans le stockage (Vercel Blob)
  - Taille/qualité suffisantes (≥ 1600px côté long)
- [ ] QA du CSV (colonnes critiques non vides, encodage UTF‑8)

## Phase 2 — Texte d’introduction / prise de note
- [ ] Rédiger un paragraphe FR/EN d’introduction du catalogue
- [ ] L’intégrer en haut de `src/pages/jeannette/catalogue.tsx`

## Phase 3 — CMS (Sanity)
- [ ] Initialiser le projet Sanity (free tier)
- [ ] Définir les schémas `vitrail` et `lieu`
- [ ] Convertir le CSV en JSON importable + téléverser les images
- [ ] Importer les métadonnées et relier les médias
- [ ] Configurer le client Sanity dans le projet Next.js

## Phase 4 — Intégration et UI
- [ ] Remplacer la source CSV par Sanity (catalogue + détail)
- [ ] Ajouter filtres, recherche et tri
- [ ] SEO (titles/meta), i18n des champs

## Phase 5 — Architecture du site
- [ ] Étudier Pages Router vs App Router (petit POC + métriques)
- [ ] Structurer `/src/types/`, conventions d’URL et organisation des pages
- [ ] Planifier une migration progressive après stabilisation des données

## Historique (références)
- [x] Connecter le site au fichier `vitraux_metadata.csv` pour afficher les données dynamiquement
