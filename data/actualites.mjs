/*
 * Actualités de la paroisse.
 *
 * La section « Actualités » des pages d'accueil (index.html, ru.html, en.html)
 * et les pages actualites.html, novosti.html et news.html sont construites à
 * partir de ce fichier par `npm run build:home`.
 *
 * Ajouter une actualité : copier un bloc, le placer EN TÊTE de liste, remplir
 * la date (AAAA-MM-JJ) et les textes dans les trois langues, puis lancer
 * `npm run build:home` et committer les fichiers modifiés.
 *
 * - `text` : texte simple ; une ligne vide sépare deux paragraphes.
 * - `link` (facultatif) : un lien affiché sous le texte, { href, label }.
 * Les plus récentes apparaissent en premier ; l'accueil affiche les HOME_NEWS premières.
 */

/** Nombre d'actualités affichées sur la page d'accueil. */
export const HOME_NEWS = 3;

export const actualites = [
  {
    date: '2026-11-24',
    fr: {
      title: 'L’église rouvre le 6 décembre, en la fête de saint Alexandre Nevsky',
      text: 'Nous avons la joie d’annoncer la réouverture de notre église. La première Divine Liturgie sera célébrée le dimanche 6 décembre à 10h30, jour de la fête de saint Alexandre Nevsky, patron de notre église.\n\nTous sont les bienvenus, fidèles de longue date comme visiteurs venus pour la première fois. Adresse : 18 rue Jean-Réveil, 64000 Pau.',
      link: { href: 'premiere-visite.html', label: 'Préparer votre visite →' },
    },
    ru: {
      title: 'Храм открывается 6 декабря, в день памяти святого Александра Невского',
      text: 'С радостью сообщаем об открытии нашего храма. Первая Божественная литургия будет совершена в воскресенье 6 декабря в 10:30, в день памяти святого благоверного князя Александра Невского, небесного покровителя нашего храма.\n\nДобро пожаловать всем — и постоянным прихожанам, и тем, кто придёт впервые. Адрес: 18 rue Jean-Réveil, 64000 Pau.',
      link: { href: 'pervoe-poseshchenie.html', label: 'Впервые в храме? →' },
    },
    en: {
      title: 'The church reopens on 6 December, the feast of St Alexander Nevsky',
      text: 'We are delighted to announce the reopening of our church. The first Divine Liturgy will be celebrated on Sunday 6 December at 10:30, the feast of St Alexander Nevsky, patron saint of our church.\n\nAll are welcome, long-standing faithful and first-time visitors alike. Address: 18 rue Jean-Réveil, 64000 Pau.',
      link: { href: 'first-visit.html', label: 'Plan your visit →' },
    },
  },
  {
    date: '2026-11-22',
    fr: {
      title: 'Le jeûne de la Nativité commence le 28 novembre',
      text: 'Du 28 novembre au 6 janvier, l’Église nous invite à préparer la fête de la Nativité du Christ, que nous célébrons le 7 janvier, par quarante jours de jeûne, de prière et de partage.\n\nPour vous accompagner, trois nouveaux articles sont en ligne : le jeûne de la Nativité, Noël orthodoxe et un guide du jeûne orthodoxe.',
      link: { href: 'jeune-de-la-nativite.html', label: 'Lire l’article sur le jeûne de la Nativité →' },
    },
    ru: {
      title: 'Рождественский пост начинается 28 ноября',
      text: 'С 28 ноября по 6 января Церковь призывает нас приготовиться к празднику Рождества Христова, который мы празднуем 7 января, сорока днями поста, молитвы и милосердия.\n\nВ помощь — три новые статьи: о Рождественском посте, о Рождестве Христовом и о посте в православии.',
      link: { href: 'rozhdestvenskij-post.html', label: 'Читать о Рождественском посте →' },
    },
    en: {
      title: 'The Nativity Fast begins on 28 November',
      text: 'From 28 November to 6 January, the Church invites us to prepare for the feast of the Nativity of Christ, which we celebrate on 7 January, with forty days of fasting, prayer and generosity.\n\nTo help you, three new articles are online: the Nativity Fast, Orthodox Christmas and a guide to Orthodox fasting.',
      link: { href: 'nativity-fast.html', label: 'Read about the Nativity Fast →' },
    },
  },
  {
    date: '2026-11-21',
    fr: {
      title: 'Nouvelle page : l’archange Michel',
      text: 'À l’occasion de la Synaxe de l’archistratège Michel et des puissances célestes, le 21 novembre, découvrez une nouvelle page sur l’archange : le sens de son nom, l’Écriture, le miracle de Chones, ses icônes et une vidéo.',
      link: { href: 'archange-michel.html', label: 'Découvrir l’archange Michel →' },
    },
    ru: {
      title: 'Новая страница: Архангел Михаил',
      text: 'К празднику Собора Архистратига Михаила и прочих Небесных сил бесплотных, 21 ноября, — новая страница об Архангеле: значение имени, Священное Писание, чудо в Хонех, иконы и видео.',
      link: { href: 'arhangel-mihail.html', label: 'Об Архангеле Михаиле →' },
    },
    en: {
      title: 'New page: the Archangel Michael',
      text: 'For the Synaxis of the Archistrategos Michael and the Bodiless Powers on 21 November, discover a new page on the archangel: the meaning of his name, Scripture, the miracle at Chonae, his icons and a video.',
      link: { href: 'archangel-michael.html', label: 'Discover the Archangel Michael →' },
    },
  },
  {
    date: '2026-11-20',
    fr: {
      title: 'L’église est temporairement fermée pour travaux',
      text: 'Notre église a besoin de travaux importants : toiture, chauffage et mise aux normes. Elle est donc temporairement fermée, et aucun office n’y est célébré pour le moment.\n\nInscrivez-vous à la newsletter pour être informé de la réouverture. Vous pouvez aussi soutenir les travaux par un don.',
      link: { href: 'index.html#don', label: 'Soutenir les travaux →' },
    },
    ru: {
      title: 'Храм временно закрыт на ремонт',
      text: 'Нашему храму необходим серьёзный ремонт: кровля, отопление, приведение в соответствие с нормами. Поэтому храм временно закрыт, и богослужения в нём пока не совершаются.\n\nПодпишитесь на рассылку, чтобы узнать о возобновлении служб. Вы также можете поддержать ремонт пожертвованием.',
      link: { href: 'ru.html#don', label: 'Поддержать ремонт →' },
    },
    en: {
      title: 'The church is temporarily closed for works',
      text: 'Our church needs major works: roof, heating and bringing it up to standard. It is therefore temporarily closed, and no services are held there for the moment.\n\nSubscribe to the newsletter to hear when it reopens. You can also support the works with a donation.',
      link: { href: 'en.html#don', label: 'Support the works →' },
    },
  },
];
