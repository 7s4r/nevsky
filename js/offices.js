/*
 * ============================================================
 *  HORAIRES DES OFFICES — fichier à mettre à jour par la paroisse
 * ============================================================
 *
 *  Ce fichier est le SEUL à modifier pour annoncer les offices.
 *  Ils apparaissent automatiquement :
 *    - dans le calendrier de la page d'accueil (point vert sur la date),
 *    - dans la liste « Prochains offices »,
 *    - dans le fichier agenda du bouton « Ajouter au calendrier ».
 *
 *  Comment faire (sur GitHub : ouvrir ce fichier, cliquer sur le crayon,
 *  modifier, puis « Commit changes ») :
 *
 *  1) OFFICES RÉGULIERS — chaque semaine, le même jour, à la même heure.
 *     day : 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'
 *     time : heure de début, au format 'HH:MM'
 *     duration : durée en minutes (facultatif, 120 par défaut)
 *     from / until : période de validité 'AAAA-MM-JJ' (facultatif)
 *     fr / ru / en : nom de l'office dans chaque langue
 *
 *     Exemple :
 *       { day: 'samedi', time: '18:00', duration: 120,
 *         fr: 'Vigiles', ru: 'Всенощное бдение', en: 'Vigil' },
 *       { day: 'dimanche', time: '10:00', duration: 150,
 *         fr: 'Divine Liturgie', ru: 'Божественная литургия', en: 'Divine Liturgy' },
 *
 *  2) OFFICES PONCTUELS — une date précise (fêtes, offices exceptionnels).
 *     date : 'AAAA-MM-JJ'
 *     note : précision facultative, dans chaque langue (noteFr, noteRu, noteEn)
 *
 *     Exemple :
 *       { date: '2027-01-06', time: '23:00', duration: 180,
 *         fr: 'Vigile de la Nativité', ru: 'Рождественское всенощное бдение', en: 'Nativity Vigil' },
 *
 *  3) ANNULATIONS — dates où les offices réguliers n'ont pas lieu.
 *       cancelled: ['2026-12-27'],
 *
 *  Attention aux virgules entre les lignes et aux apostrophes :
 *  écrire \' pour une apostrophe dans un texte entre '…' (ex. 'Vigile de l\'Ascension').
 */
window.NEVSKY_OFFICES = {
  weekly: [
    // Ajouter ici les offices réguliers dès que leurs horaires sont fixés.
  ],
  dates: [
    { date: '2026-12-06', time: '10:30', duration: 150,
      fr: 'Divine Liturgie', ru: 'Божественная литургия', en: 'Divine Liturgy',
      noteFr: 'Saint Alexandre Nevsky, réouverture de l\'église',
      noteRu: 'Св. блгв. кн. Александр Невский, открытие храма',
      noteEn: 'St Alexander Nevsky, reopening of the church' },
  ],
  cancelled: [
  ],
};
