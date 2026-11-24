# Kit de marque Nevsky

Charte graphique de **nevsky.fr** : logos, couleurs, typographie et composants. Elle sert de référence pour tous les supports : e-mails, affiches, réseaux sociaux, documents, outils tiers.

| Fichier | Rôle |
| --- | --- |
| `logos/logo-nevsky-horizontal.png` | **Logo principal** (croix + « Nevsky »), sur fond clair |
| `logos/logo-nevsky-horizontal-blanc.png` | Le même, pour un fond bleu ou foncé |
| `logos/logo-nevsky-complet.png` | Logo complet, avec « Église orthodoxe russe – Pau » |
| `logos/logo-nevsky-complet-blanc.png` | Logo complet, pour un fond foncé |
| `logos/icone-croix-or.png` | Croix seule (avatar, favicon, petit format) |
| `brand-kit.json` | Toutes les valeurs (couleurs, polices, boutons) au même endroit |
| `modele-reouverture.html` | Exemple d'e-mail aux couleurs du site (annonce de réouverture) |
| `apercu-modele-reouverture.png` | Aperçu de cet exemple |

Tous les PNG ont un fond transparent.

---

## Logos

- **Fond clair** : `logo-nevsky-horizontal.png`. Dans un e-mail ou un en-tête, affichez-le entre 200 et 220 px de large.
- **Fond foncé** (bleu Nevsky, photo sombre) : versions `-blanc`.
- **Petit format** (avatar, icône) : `icone-croix-or.png`.
- Ne pas déformer, recolorer ni ajouter d'ombre.

## Couleurs

| Nom | Code | Usage |
| --- | --- | --- |
| **Bleu Nevsky** | `#10354B` | Couleur principale : titres, logo, pied de page |
| **Or Nevsky** | `#FFD615` | Accent : boutons, filets, puces |
| Bleu liturgique | `#1B3B6F` | Fond des encarts « citation / verset » |
| Or clair | `#FFF2A1` | Fond des encarts d'information (date, horaires) |
| Or foncé | `#7A5C00` | Liens sur fond blanc (contraste suffisant) |
| Texte | `#0F172A` | Texte principal |
| Texte secondaire | `#475569` | Légendes, mentions |
| Fond doux | `#F8FAFC` | Arrière-plan, sections alternées |
| Bordure | `#E2E8F0` | Séparateurs |

Si un outil ne demande que 2 ou 3 couleurs : **principale `#10354B`**, **secondaire `#FFD615`**, **fond `#F8FAFC`**.

**Contraste.** N'écrivez pas de texte or `#FFD615` sur fond blanc : il est illisible. Utilisez l'or foncé `#7A5C00`. Sur un bouton or, le texte est toujours foncé (`#0F172A`).

## Typographie

| Élément | Police | Réglages |
| --- | --- | --- |
| Titres | **Helvetica** (ou Arial) | Gras, `#10354B`. H1 30 px, H2 22 px, H3 18 px |
| Texte | **Helvetica** (ou Arial) | 16 px, interligne 1,6, `#0F172A` |
| Citations | **Georgia** | Italique, 20 px |
| Nom « Nevsky » | **Great Vibes** (Google Fonts) | Uniquement dans le logo |

Le site utilise une police système sans empattement ; Helvetica/Arial en est l'équivalent le plus répandu. La police manuscrite Great Vibes est réservée au nom « Nevsky ». Dans un e-mail, passez par l'image du logo : les messageries l'afficheraient mal en texte.

## Boutons

- **Principal** : fond `#FFD615`, texte `#0F172A`, gras, coins entièrement arrondis (forme « pilule »), marges intérieures environ 14 px × 28 px.
- **Sur fond foncé** : fond blanc, texte `#0F172A`.
- Un seul bouton principal par écran ou par e-mail ; les autres liens en texte.

## Liens

`#7A5C00`, soulignés. Sur fond bleu : `#FFD615`.

## Mise en page

- Largeur d'un e-mail : 600 px.
- Coins arrondis des cartes et encarts : 16 px.
- Marges intérieures : 32 à 40 px.

---

## Exemple : e-mail de réouverture

`modele-reouverture.html` applique la charte à un e-mail : logo, photo de l'église, encart date, bouton, citation et pied de page. Il fonctionne dans n'importe quel outil d'e-mailing qui accepte du HTML :

1. Remplacez `LIEN_DESINSCRIPTION` et `LIEN_VERSION_WEB` par les balises de votre outil. Le lien de désinscription est obligatoire.
2. Les logos sont chargés depuis `https://nevsky.fr/brand/logos/…`. Ces adresses ne fonctionnent qu'une fois ce dossier publié sur le site.
