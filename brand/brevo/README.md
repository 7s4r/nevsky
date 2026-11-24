# Kit de marque Nevsky pour Brevo

Charte graphique de **nevsky.fr**, prête à reporter dans le **Brand Kit** de Brevo, et un modèle d'e-mail pour annoncer la réouverture.

| Fichier | Rôle |
| --- | --- |
| `logos/logo-nevsky-horizontal.png` | **Logo principal** (croix + « Nevsky »), sur fond clair |
| `logos/logo-nevsky-horizontal-blanc.png` | Le même, pour un fond bleu ou foncé |
| `logos/logo-nevsky-complet.png` | Logo complet, avec « Église orthodoxe russe – Pau » |
| `logos/logo-nevsky-complet-blanc.png` | Logo complet, pour un fond foncé |
| `logos/icone-croix-or.png` | Croix seule (avatar, favicon, petit format) |
| `brand-kit.json` | Toutes les valeurs (couleurs, polices, boutons) au même endroit |
| `modele-reouverture.html` | Modèle d'e-mail aux couleurs du site, à importer dans Brevo |
| `apercu-modele-reouverture.png` | Aperçu du modèle |

Tous les PNG ont un fond transparent.

---

## 1. Remplir le Brand Kit dans Brevo

Brevo ne propose pas d'import de fichier pour le Brand Kit : on saisit les valeurs à la main. Comptez environ 5 minutes.

Chemin : **Campagnes → Modèles → Brand Kit** (ou depuis l'éditeur d'e-mail, panneau *Brand Kit*). Selon la version, Brevo propose aussi de « détecter la marque depuis un site web » : vous pouvez lui donner `https://nevsky.fr` comme point de départ, puis corriger avec les valeurs ci-dessous.

### Logo

Téléversez `logos/logo-nevsky-horizontal.png`. Dans les e-mails, affichez-le en **200 à 220 px de large**.

### Couleurs

| Nom | Code | Usage |
| --- | --- | --- |
| **Bleu Nevsky** | `#10354B` | Couleur principale : titres, logo, pied de page |
| **Or Nevsky** | `#FFD615` | Accent : boutons, filets, puces |
| Bleu liturgique | `#1B3B6F` | Fond des encarts « citation / verset » |
| Or clair | `#FFF2A1` | Fond des encarts d'information (date, horaires) |
| Or foncé | `#7A5C00` | Liens sur fond blanc |
| Texte | `#0F172A` | Texte principal |
| Texte secondaire | `#475569` | Légendes, mentions |
| Fond doux | `#F8FAFC` | Arrière-plan de l'e-mail |
| Bordure | `#E2E8F0` | Séparateurs |

Si Brevo ne demande que 2 ou 3 couleurs : **principale `#10354B`**, **secondaire `#FFD615`**, **fond `#F8FAFC`**.

### Polices

| Élément | Police | Réglages |
| --- | --- | --- |
| Titres | **Helvetica** (ou Arial) | Gras, `#10354B`. H1 30 px, H2 22 px, H3 18 px |
| Texte | **Helvetica** (ou Arial) | 16 px, interligne 1,6, `#0F172A` |
| Citations | **Georgia** | Italique, 20 px |

Le site utilise une police système sans empattement ; Helvetica/Arial en est l'équivalent fiable dans toutes les messageries. La police manuscrite **Great Vibes** de « Nevsky » reste réservée au logo : comme elle est déjà dans l'image, n'en mettez pas dans le texte (Outlook et Gmail l'afficheraient mal).

### Boutons

- Fond **`#FFD615`**, texte **`#0F172A`**, gras
- Coins entièrement arrondis (rayon maximal, forme « pilule »)
- Marges intérieures environ 14 px × 28 px

### Liens

`#7A5C00`, soulignés. Sur fond bleu : `#FFD615`.

---

## 2. Utiliser le modèle de réouverture

1. Dans Brevo : **Campagnes → Créer une campagne e-mail**, puis à l'étape du design, choisissez **« Coller votre code »** (ou *Éditeur HTML*).
2. Collez le contenu de `modele-reouverture.html`.
3. Relisez le texte et adaptez-le si besoin.
4. Objet suggéré : **« L'église rouvre : première Divine Liturgie le 6 décembre »**.
   Le texte d'aperçu est déjà dans le modèle.
5. Envoyez-vous un **e-mail de test** avant l'envoi réel.

Le modèle contient les balises Brevo `{{ unsubscribe }}` (lien de désinscription, obligatoire) et `{{ mirror }}` (version web).

> **Images.** Le modèle charge les logos depuis `https://nevsky.fr/brand/brevo/logos/…`. Ces adresses ne fonctionnent qu'une fois ce dossier publié sur le site. Sinon, téléversez les logos dans la bibliothèque d'images de Brevo et remplacez les adresses dans le code.

---

## 3. Bonnes pratiques

- **Expéditeur** : un nom reconnaissable, par exemple « Église Nevsky de Pau », avec une adresse de votre domaine `@nevsky.fr`. Authentifiez le domaine dans Brevo (SPF/DKIM) pour éviter les spams.
- Un seul bouton principal (or) par e-mail ; les autres liens en texte.
- Gardez le texte d'aperçu court (moins de 90 caractères).
