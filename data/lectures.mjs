/*
 * Liste unique des lectures spirituelles.
 *
 * La section « Lectures spirituelles » des pages d'accueil (index.html,
 * ru.html, en.html) est construite à partir de ce fichier par
 * `npm run build:home` : les lectures les plus récentes (champ `date`)
 * apparaissent en premier, et seules les HOME_COUNT premières sont affichées.
 *
 * Ajouter une lecture : copier un bloc, le placer en tête de liste, remplir
 * la date de publication, l'image (images/lecture-<page>-1200.webp, 1200×750,
 * accompagnée de sa version -600.webp à 600×375) et les textes dans les trois langues, puis lancer
 * `npm run build:home`.
 */

/** Nombre de lectures affichées sur la page d'accueil. */
export const HOME_COUNT = 6;

export const lectures = [
  {
    date: '2026-11-26',
    image: 'images/lecture-saint-jean-chrysostome-1200.webp',
    fr: { href: 'saint-jean-chrysostome.html', title: "Saint Jean Chrysostome", text: "La « Bouche d’or » : prédicateur d’Antioche, archevêque de Constantinople, auteur de la Liturgie du dimanche. Fêté le 26 novembre." },
    ru: { href: 'ioann-zlatoust.html', title: "Святитель Иоанн Златоуст", text: "«Золотые уста» Церкви: проповедник Антиохии, архиепископ Константинопольский, автор воскресной литургии. Память 26 ноября." },
    en: { href: 'john-chrysostom.html', title: "Saint John Chrysostom", text: "The “Golden Mouth”: preacher of Antioch, Archbishop of Constantinople, author of the Sunday Liturgy. Feast on 26 November." },
  },
  {
    date: '2026-11-22',
    image: 'images/lecture-noel-orthodoxe-1200.webp',
    fr: { href: 'noel-orthodoxe.html', title: "Noël orthodoxe", text: "Pourquoi le 7 janvier, la veille de Noël et le sotchivo, l’icône et les chants de la Nativité." },
    ru: { href: 'rozhdestvo-hristovo.html', title: "Рождество Христово", text: "Почему 7 января, Сочельник и сочиво, икона и песнопения праздника." },
    en: { href: 'orthodox-christmas.html', title: "Orthodox Christmas", text: "Why 7 January, Christmas Eve and sochivo, the icon and hymns of the Nativity." },
  },
  {
    date: '2026-11-22',
    image: 'images/lecture-jeune-de-la-nativite-1200.webp',
    fr: { href: 'jeune-de-la-nativite.html', title: "Le jeûne de la Nativité", text: "Du 28 novembre au 6 janvier : dates, ce que l’on mange, les fêtes du jeûne et le sens de ces quarante jours." },
    ru: { href: 'rozhdestvenskij-post.html', title: "Рождественский пост", text: "С 28 ноября по 6 января: сроки, что можно есть, праздники поста и смысл сорока дней." },
    en: { href: 'nativity-fast.html', title: "The Nativity Fast", text: "28 November to 6 January: dates, what one eats, the feasts of the fast and the meaning of these forty days." },
  },
  {
    date: '2026-11-22',
    image: 'images/lecture-jeune-orthodoxe-1200.webp',
    fr: { href: 'jeune-orthodoxe.html', title: "Le jeûne orthodoxe", text: "Les quatre carêmes, le mercredi et le vendredi, ce que l’on mange, des idées de repas et l’esprit du jeûne." },
    ru: { href: 'post-v-pravoslavii.html', title: "Пост в православии", text: "Четыре многодневных поста, среда и пятница, что можно есть, постные блюда и дух поста." },
    en: { href: 'orthodox-fasting.html', title: "Orthodox fasting", text: "The four fasts, Wednesdays and Fridays, what one eats, meal ideas and the spirit of fasting." },
  },
  {
    date: '2026-11-21',
    image: 'images/lecture-archange-michel-1200.webp',
    fr: { href: 'archange-michel.html', title: "L’archange Michel", text: "Le chef des armées célestes : son nom, l’Écriture, le miracle de Chones, ses icônes, sa fête du 21 novembre, en vidéo." },
    ru: { href: 'arhangel-mihail.html', title: "Архангел Михаил", text: "Архистратиг Небесных сил: имя, Писание, чудо в Хонех, иконы, праздник 21 ноября, видео." },
    en: { href: 'archangel-michael.html', title: "The Archangel Michael", text: "The commander of the heavenly hosts: his name, Scripture, the miracle at Chonae, his icons, his feast on 21 November, with a video." },
  },
  {
    date: '2026-11-20',
    image: 'images/lecture-prosphore-1200.webp',
    fr: { href: 'prosphore.html', title: "La prosphore", text: "Le petit pain de l’offrande : son sceau, les cinq prosphores de la Liturgie, la prière pour nos proches." },
    ru: { href: 'prosfora.html', title: "Просфора", text: "Хлеб приношения: печать, пять просфор на литургии, молитва о близких." },
    en: { href: 'prosphora.html', title: "Prosphora", text: "The bread of offering: its seal, the five loaves of the Liturgy, prayer for our loved ones." },
  },
  {
    date: '2026-11-18',
    image: 'images/lecture-premiere-visite-1200.webp',
    fr: { href: 'premiere-visite.html', title: "Première visite", text: "Comment se passe un office orthodoxe et ce qu’il est bon de savoir avant de venir." },
    ru: { href: 'pervoe-poseshchenie.html', title: "Первое посещение храма", text: "Как проходит православное богослужение и что полезно знать перед первым приходом." },
    en: { href: 'first-visit.html', title: "Your first visit", text: "What happens at an Orthodox service and what is good to know before you come." },
  },
  {
    date: '2026-11-18',
    image: 'images/lecture-saint-jean-de-cronstadt-1200.webp',
    fr: { href: 'saint-jean-de-cronstadt.html', title: "Saint Jean de Cronstadt", text: "Le prêtre de Cronstadt, ami des pauvres, que toute la Russie venait consulter, auteur de Ma vie en Christ." },
    ru: { href: 'ioann-kronshtadtskij.html', title: "Святой Иоанн Кронштадтский", text: "Кронштадтский пастырь, друг бедных, к которому шла вся Россия, автор «Моей жизни во Христе»." },
    en: { href: 'john-of-kronstadt.html', title: "Saint John of Kronstadt", text: "The priest of Kronstadt, friend of the poor, whom all Russia came to consult, author of My Life in Christ." },
  },
  {
    date: '2026-11-18',
    image: 'images/lecture-saint-alexandre-nevsky-1200.webp',
    fr: { href: 'saint-alexandre-nevsky.html', title: "Saint Alexandre Nevsky", text: "Prince de Novgorod, défenseur de la Russie, mort moine sous le nom d’Alexis : le patron de notre église." },
    ru: { href: 'aleksandr-nevskij.html', title: "Святой Александр Невский", text: "Князь новгородский, защитник Руси, скончавшийся схимником Алексием, — покровитель нашего храма." },
    en: { href: 'alexander-nevsky.html', title: "Saint Alexander Nevsky", text: "Prince of Novgorod, defender of Russia, who died a monk with the name Alexis: the patron of our church." },
  },
  {
    date: '2026-11-18',
    image: 'images/lecture-livre-de-prieres-1200.webp',
    fr: { href: 'livre-de-prieres.html', title: "Livre de prières", text: "Les prières du matin, du soir et des repas, en français avec le texte slavon, et des conseils pour prier chez soi." },
    ru: { href: 'molitvoslov.html', title: "Молитвослов", text: "Утренние и вечерние молитвы, молитвы перед едой и после еды, советы для домашней молитвы." },
    en: { href: 'prayer-book.html', title: "Prayer book", text: "Morning, evening and mealtime prayers, in English with the Church Slavonic text, and advice for praying at home." },
  },
  {
    date: '2026-11-17',
    image: 'images/lecture-saint-silouane-athonite-1200.webp',
    fr: { href: 'saint-silouane-athonite.html', title: "Saint Silouane l’Athonite", text: "Un paysan russe devenu moine au mont Athos, témoin de l’amour de Dieu, de l’amour des ennemis et de la prière pour le monde entier." },
    ru: { href: 'siluan-afonskij.html', title: "Преподобный Силуан Афонский", text: "Русский крестьянин, ставший монахом на Афоне, — свидетель Божией любви, любви к врагам и молитвы за весь мир." },
    en: { href: 'silouan-the-athonite.html', title: "Saint Silouan the Athonite", text: "A Russian peasant who became a monk on Mount Athos, witness of God’s love, of love for enemies and of prayer for the whole world." },
  },
  {
    date: '2026-11-17',
    image: 'images/lecture-philocalie-1200.webp',
    fr: { href: 'philocalie.html', title: "La Philocalie", text: "L’anthologie des Pères sur la vigilance, la garde du cœur et la prière de Jésus, le livre que le pèlerin portait dans son sac." },
    ru: { href: 'dobrotolyubie.html', title: "Добротолюбие", text: "Собрание святоотеческих творений о трезвении, хранении сердца и Иисусовой молитве — книга, которую странник носил в своей сумке." },
    en: { href: 'philokalia.html', title: "The Philokalia", text: "The anthology of the Fathers on watchfulness, guarding the heart and the Jesus Prayer: the book the pilgrim carried in his bag." },
  },
  {
    date: '2026-11-17',
    image: 'images/lecture-saint-seraphin-de-sarov-1200.webp',
    fr: { href: 'saint-seraphin-de-sarov.html', title: "Saint Séraphin de Sarov", text: "L’ermite de la forêt, le starets qui accueillait chacun par « Ma joie, le Christ est ressuscité ! », et sa règle de prière pour les laïcs." },
    ru: { href: 'serafim-sarovskij.html', title: "Преподобный Серафим Саровский", text: "Лесной пустынник, старец, встречавший каждого словами «Радость моя, Христос воскресе!», и его молитвенное правило для мирян." },
    en: { href: 'seraphim-of-sarov.html', title: "Saint Seraphim of Sarov", text: "The hermit of the forest, the elder who greeted everyone with “My joy, Christ is risen!”, and his rule of prayer for lay people." },
  },
  {
    date: '2026-11-17',
    image: 'images/lecture-priere-de-jesus-1200.webp',
    fr: { href: 'priere-de-jesus.html', title: "La Prière de Jésus", text: "Un pèlerin pauvre parcourt la Russie pour comprendre comment « prier sans cesse ». Son récit est la plus belle introduction à la prière du cœur." },
    ru: { href: 'iisusova-molitva.html', title: "Иисусова молитва", text: "Бедный странник обходит Россию, чтобы понять, как «непрестанно молиться». Его рассказ — лучшее введение в сердечную молитву." },
    en: { href: 'jesus-prayer.html', title: "The Jesus Prayer", text: "A poor pilgrim walks across Russia to understand how to “pray without ceasing”. His story is the finest introduction to the prayer of the heart." },
  },
  {
    date: '2026-11-13',
    image: 'images/lecture-catechisme-orthodoxe-1200.webp',
    fr: { href: 'catechisme-orthodoxe.html', title: "Catéchisme orthodoxe", text: "La Trinité, le Credo, les sacrements, les icônes, la Divine Liturgie, et les 313 questions-réponses du catéchisme, avec une recherche dans tout le texte." },
    ru: { href: 'zakon-bozhij.html', title: "Закон Божий", text: "Святая Троица, Символ веры, Таинства, иконы, Божественная литургия и 313 вопросов и ответов катехизиса, с поиском по всему тексту." },
    en: { href: 'orthodox-catechism.html', title: "Orthodox catechism", text: "The Trinity, the Creed, the sacraments, icons, the Divine Liturgy, and the catechism’s 313 questions and answers, with full-text search." },
  },
];
