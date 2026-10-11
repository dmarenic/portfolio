/**
 * All content of the site lives in this file: profile, projects, skills,
 * experience, education and the text of the interface. Components only decide
 * how things look, so changing a sentence or adding a project never requires
 * touching a component.
 *
 * Every piece of text is written in both languages: { en: "...", hr: "..." }.
 * The long text of the Online Trivia Quiz case study is in
 * trivia-case-study.ts, because it would make this file hard to read.
 */
import type { Localized } from "@/lib/i18n";

/* -------------------------------------------------------------------------- */
/* Site                                                                       */
/* -------------------------------------------------------------------------- */

// VERIFY: update after the first Vercel deploy if the subdomain is different.
// Used for canonical links, the sitemap and Open Graph images.
export const siteUrl = "https://dominik-marenic.vercel.app";

/* -------------------------------------------------------------------------- */
/* Profile                                                                    */
/* -------------------------------------------------------------------------- */

export const profile = {
  name: "Dominik Marenić",
  role: {
    en: "Junior backend and full stack developer",
    hr: "Junior backend i full stack programer",
  },
  // The hero text under the name: two short sentences, at most 20 words.
  summary: {
    lead: {
      en: "Junior backend and full stack developer from Osijek, Croatia.",
      hr: "Junior backend i full stack programer iz Osijeka.",
    },
    text: {
      en: "Looking for my first role, in Osijek or remote.",
      hr: "Tražim prvi posao, u Osijeku ili na daljinu.",
    },
  },
  email: "dominik.marenic@gmail.com",
  github: "https://github.com/dmarenic",
  linkedin: "https://www.linkedin.com/in/dominik-marenic/",
  // The black and white cut-out at the top of the home page. Made from the
  // studio headshot with drafts/portrait-cutout.cjs.
  portrait: {
    src: "/images/dominik-marenic-portrait.webp",
    width: 1108,
    height: 1213,
    alt: {
      en: "Black and white portrait of Dominik Marenić",
      hr: "Crno-bijeli portret Dominika Marenića",
    },
  },
  // Shown in the About section. Set to null to hide it.
  photo: {
    src: "/images/dominik-marenic.jpg",
    width: 1125,
    height: 2000,
    alt: {
      en: "Dominik Marenić leaning on a wooden railing above a seaside village of colourful houses",
      hr: "Dominik Marenić naslonjen na drvenu ogradu iznad primorskog mjesta sa šarenim kućama",
    },
  } as { src: string; width: number; height: number; alt: Localized } | null,
  // CV files offered on each language version of the site.
  cv: {
    en: [
      { href: "/cv/dominik-marenic-cv-en.pdf", label: "CV (PDF)", lang: "en" },
    ],
    hr: [
      {
        href: "/cv/dominik-marenic-cv-hr.pdf",
        label: "Životopis (PDF)",
        lang: "hr",
      },
      {
        href: "/cv/dominik-marenic-cv-en.pdf",
        label: "CV in English (PDF)",
        lang: "en",
      },
    ],
  } satisfies Localized<{ href: string; label: string; lang: string }[]>,
};

/* -------------------------------------------------------------------------- */
/* Text of the interface                                                      */
/* -------------------------------------------------------------------------- */

export const ui = {
  meta: {
    homeTitle: {
      en: "Dominik Marenić | Junior backend and full stack developer",
      hr: "Dominik Marenić | Junior backend i full stack programer",
    },
    homeDescription: {
      en: "Junior backend and full stack developer from Osijek, Croatia. Projects in TypeScript, Next.js, NestJS, Python and Django.",
      hr: "Junior backend i full stack programer iz Osijeka. Projekti u TypeScriptu, Next.jsu, NestJS-u, Pythonu i Djangu.",
    },
  },
  skipLink: { en: "Skip to content", hr: "Preskoči na sadržaj" },
  nav: {
    label: { en: "Main", hr: "Glavna navigacija" },
    // Screen reader name of the GitHub, LinkedIn and CV links on the right
    // side of the hero.
    profileLinks: { en: "Profiles and CV", hr: "Profili i životopis" },
    homeLink: {
      en: "Dominik Marenić, home page",
      hr: "Dominik Marenić, početna stranica",
    },
    // One label per destination, used in the navigation and in the hero
    // buttons, so the same action always has the same name.
    labels: {
      projects: { en: "Projects", hr: "Projekti" },
      skills: { en: "Skills", hr: "Vještine" },
      experience: { en: "Experience", hr: "Iskustvo" },
      contact: { en: "Contact", hr: "Kontakt" },
    },
    items: ["projects", "skills", "experience", "contact"] as const,
  },
  languageSwitch: {
    // The link always shows the other language, written in that language.
    en: { label: "Hrvatski", lang: "hr" },
    hr: { label: "English", lang: "en" },
  },
  theme: {
    toLight: { en: "Switch to light theme", hr: "Uključi svijetlu temu" },
    toDark: { en: "Switch to dark theme", hr: "Uključi tamnu temu" },
    unknown: { en: "Switch theme", hr: "Promijeni temu" },
  },
  // Icon links in the header (the icon is visible, this text is for screen
  // readers and the tooltip).
  social: {
    github: { en: "GitHub profile", hr: "GitHub profil" },
    linkedin: { en: "LinkedIn profile", hr: "LinkedIn profil" },
  },
  // The round button in the bottom left corner that opens the same profile
  // links as the hero (see LinksMenu). The CV labels come from profile.cv.
  linksMenu: {
    label: { en: "Links", hr: "Poveznice" },
    email: { en: "Email", hr: "E-pošta" },
  },
  // Read by screen readers after every link that opens in a new tab (see
  // ExternalLink).
  newTab: {
    en: "(opens in a new tab)",
    hr: "(otvara se u novoj kartici)",
  },
  // Buttons of the carousel (see Carousel). Slides are named "1 of 3".
  carousel: {
    previous: { en: "Previous", hr: "Prethodna" },
    next: { en: "Next", hr: "Sljedeća" },
    of: { en: "of", hr: "od" },
  },
  diagram: {
    actors: {
      host: { en: "Host", hr: "Domaćin" },
      server: { en: "Server", hr: "Poslužitelj" },
      player: { en: "Player", hr: "Igrač" },
    },
    caption: {
      en: "One round of my bachelor's thesis project, as its real Socket.IO events. Select an event to see what it carries.",
      hr: "Jedna runda iz mog završnog rada, kao stvarni Socket.IO događaji. Odaberi događaj da vidiš što nosi.",
    },
    note: {
      en: "Points are calculated on the server only.",
      hr: "Bodove računa samo poslužitelj.",
    },
    listLabel: {
      en: "Events in one round of the quiz",
      hr: "Događaji u jednoj rundi kviza",
    },
    sentBy: { en: "From", hr: "Šalje" },
    sentTo: { en: "To", hr: "Prima" },
    payload: { en: "Payload", hr: "Sadržaj" },
    replay: { en: "Replay the round", hr: "Ponovi rundu" },
  },
};

/* -------------------------------------------------------------------------- */
/* Events in the round diagram (on the case study page)                       */
/* -------------------------------------------------------------------------- */

// One round of the Online Trivia Quiz, in the order the events happen.
// Event names and payloads are copied from the quiz backend
// (backend/src/game.gateway.ts and SOCKET_PROTOCOL.md in that repository).
export type DiagramActor = "host" | "server" | "player";

export const quizRound: {
  event: string;
  from: DiagramActor;
  to: DiagramActor[];
  payload: string;
  detail: Localized;
}[] = [
  {
    event: "create_room",
    from: "host",
    to: ["server"],
    payload: "{ nickname, questionCount?, timePerQuestion? }",
    detail: {
      en: "Creates a private room. The server makes a six-character code with a cryptographically secure random generator and leaves out look-alike characters such as 0 and O. One connection can create at most five rooms a minute.",
      hr: "Stvara privatnu sobu. Poslužitelj kriptografski sigurnim generatorom stvara kod od šest znakova i izostavlja znakove koji izgledaju slično, poput 0 i O. Jedna veza može stvoriti najviše pet soba u minuti.",
    },
  },
  {
    event: "room_created",
    from: "server",
    to: ["host"],
    payload: "PublicRoom",
    detail: {
      en: "Confirms the room to the host. Clients only ever get this public copy of the room: the questions stay on the server, because they contain the correct answers.",
      hr: "Potvrđuje sobu domaćinu. Klijenti dobivaju samo ovu javnu kopiju sobe: pitanja ostaju na poslužitelju jer sadrže točne odgovore.",
    },
  },
  {
    event: "join_room",
    from: "player",
    to: ["server"],
    payload: "{ roomCode, nickname, reconnect? }",
    detail: {
      en: "Joins a room by its code. A lost connection only marks the player as disconnected, so after a page refresh they rejoin into the same place. A room with nobody connected is deleted after 30 seconds.",
      hr: "Ulazak u sobu preko koda. Prekid veze igrača samo označi kao odspojenog, pa se nakon osvježavanja stranice vraća na isto mjesto. Soba u kojoj nitko nije spojen briše se nakon 30 sekundi.",
    },
  },
  {
    event: "player_joined",
    from: "server",
    to: ["host", "player"],
    payload: "PublicRoom",
    detail: {
      en: "Tells everyone in the room that a player joined, so every screen shows the same list of players.",
      hr: "Javlja svima u sobi da je igrač ušao, pa svaki zaslon prikazuje isti popis igrača.",
    },
  },
  {
    event: "start_game",
    from: "host",
    to: ["server"],
    payload: "{ roomCode, questionCount?, timePerQuestion? }",
    detail: {
      en: "Only the host can start, and only when everyone else is ready. The server loads the questions from PostgreSQL, shuffles them and starts the timer.",
      hr: "Igru može pokrenuti samo domaćin, i to kad su svi ostali spremni. Poslužitelj dohvaća pitanja iz PostgreSQL-a, miješa ih i pokreće odbrojavanje.",
    },
  },
  {
    event: "game_started",
    from: "server",
    to: ["host", "player"],
    payload:
      "{ question, questionNumber, totalQuestions, answeredCount, totalPlayers, timePerQuestion }",
    detail: {
      en: "Sends the first question to everyone, without the correct answer. From now on timer_updated arrives every second.",
      hr: "Svima šalje prvo pitanje, bez točnog odgovora. Od tada svake sekunde stiže timer_updated.",
    },
  },
  {
    event: "submit_answer",
    from: "player",
    to: ["server"],
    payload: "{ roomCode, answer }",
    detail: {
      en: "The player sends only the text of the chosen answer, once per question. The server checks it and calculates the points: 1000 for a correct answer plus a speed bonus of max(0, 500 − ms / 30).",
      hr: "Igrač šalje samo tekst odabranog odgovora, jednom po pitanju. Poslužitelj ga provjerava i računa bodove: 1000 za točan odgovor plus bonus za brzinu max(0, 500 − ms / 30).",
    },
  },
  {
    event: "answer_result",
    from: "server",
    to: ["player"],
    payload:
      "{ isCorrect, correctAnswer, pointsEarned, players, answeredCount, totalPlayers }",
    detail: {
      en: "Goes only to the player who answered. It is the only event with the correct answer, so nobody can read the answer from network traffic before answering.",
      hr: "Ide samo igraču koji je odgovorio. Jedini događaj s točnim odgovorom, pa ga nitko ne može pročitati iz mrežnog prometa prije nego što odgovori.",
    },
  },
  {
    event: "question_ended",
    from: "server",
    to: ["host", "player"],
    payload: "{ players, answeredCount, totalPlayers }",
    detail: {
      en: "Sent when everyone has answered or the time runs out, with the updated scores. If the host does not move on within 30 seconds, the server continues by itself.",
      hr: "Šalje se kad svi odgovore ili istekne vrijeme, s novim bodovima. Ako domaćin ne nastavi unutar 30 sekundi, poslužitelj nastavlja sam.",
    },
  },
];

/* -------------------------------------------------------------------------- */
/* About                                                                      */
/* -------------------------------------------------------------------------- */

export const about = {
  title: { en: "About", hr: "O meni" },
  paragraphs: [
    {
      en: "I build web applications in TypeScript and Python, from the database schema to the interface. I finished the professional undergraduate study of computer engineering at FERIT Osijek in 2026, and for my bachelor's thesis I built a real-time multiplayer quiz on my own.",
      hr: "Izrađujem web aplikacije u TypeScriptu i Pythonu, od sheme baze podataka do sučelja. Stručni prijediplomski studij računarstva na FERIT-u u Osijeku završio sam 2026. godine, a za završni rad samostalno sam izradio kviz za više igrača u stvarnom vremenu.",
    },
    {
      en: "During a summer internship I worked on a Flutter web app, partly on my own and partly with the team. Now I'm looking for a junior backend or full stack role, in Osijek or remote, and most of all a job where I can learn with a mentor.",
      hr: "Na ljetnoj stručnoj praksi radio sam na web aplikaciji u Flutteru, dijelom samostalno, a dijelom u timu. Sada tražim posao junior backend ili full stack programera, u Osijeku ili na daljinu, a najviše mi znači posao na kojem mogu učiti uz mentora.",
    },
  ],
  // The last part, set a little larger, like a statement. The words between
  // asterisks are highlighted.
  statement: {
    en: "When I close the laptop, I head to the *gym*, start the next episode of a *series* or watch *football with friends*. On race weekends, I don't miss *Formula 1*. I'm communicative and enjoy *working in a team*, because good ideas usually get better once they're shared.",
    hr: "Kad zatvorim laptop, odlazim u *teretanu*, puštam sljedeću epizodu *serije* ili gledam *nogomet s prijateljima*. Kad je vikend utrke, ne propuštam *Formulu 1*. Komunikativan sam i volim *raditi u timu*, jer dobre ideje obično postanu još bolje kad se podijele.",
  },
};

/* -------------------------------------------------------------------------- */
/* Projects                                                                   */
/* -------------------------------------------------------------------------- */

export type ProjectId = "trivia" | "ratemymeal" | "bluepulse";

export type Project = {
  id: ProjectId;
  name: string;
  context: Localized;
  summary: Localized;
  highlights: Localized[];
  stack: string[];
  links: {
    caseStudy?: string;
    demo?: string;
    code: string;
  };
  demoNote?: Localized;
  // A screenshot. fit "contain" shows the whole screenshot (an upright phone
  // screen) inside the landscape frame instead of filling the frame and
  // cutting it off.
  visual: {
    type: "image";
    src: string;
    width: number;
    height: number;
    alt: Localized;
    fit?: "contain";
  };
};

export const projectsSection = {
  title: { en: "Projects", hr: "Projekti" },
  links: {
    caseStudy: { en: "Read the case study", hr: "Pročitaj opis projekta" },
    demo: { en: "Open the live demo", hr: "Otvori demo" },
    code: { en: "Source code", hr: "Izvorni kod" },
  },
  stackLabel: { en: "Built with", hr: "Tehnologije" },
};

export const projects: Project[] = [
  {
    id: "trivia",
    name: "Online Trivia Quiz",
    context: {
      en: "Bachelor's thesis, built on my own, 2026",
      hr: "Završni rad, samostalni projekt, 2026.",
    },
    summary: {
      en: "A multiplayer quiz that runs in real time. Players join a private room with a code, answer against a timer and see the leaderboard update after every question.",
      hr: "Kviz za više igrača koji se odvija u stvarnom vremenu. Igrači ulaze u privatnu sobu s kodom, odgovaraju dok teče vrijeme i nakon svakog pitanja vide novu ljestvicu.",
    },
    highlights: [
      {
        en: "Socket.IO events carry the whole game; a REST API handles accounts, friends and the daily challenge.",
        hr: "Cijela partija ide preko Socket.IO događaja, a REST API pokriva račune, prijatelje i dnevni izazov.",
      },
      {
        en: "Points are calculated only on the server, and a player gets the correct answer only after answering.",
        hr: "Bodove računa samo poslužitelj, a igrač točan odgovor dobiva tek nakon što odgovori.",
      },
      {
        en: "JWT login, request validation and rate limiting. CI runs lint, type checks, the build and Jest tests.",
        hr: "Prijava s JWT-om, validacija zahtjeva i ograničenje broja zahtjeva. CI pokreće lint, provjeru tipova, build i Jest testove.",
      },
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "NestJS",
      "Socket.IO",
      "PostgreSQL",
      "Prisma",
    ],
    links: {
      caseStudy: "/projects/online-trivia-quiz",
      demo: "https://online-trivia-quiz.vercel.app/",
      code: "https://github.com/dmarenic/online-trivia-quiz",
    },
    demoNote: {
      en: "The first load can take about 30 seconds while the backend server wakes up.",
      hr: "Prvo učitavanje može potrajati oko 30 sekundi dok se poslužitelj ne pokrene.",
    },
    visual: {
      type: "image",
      src: "/images/projects/trivia-leaderboard.png",
      width: 2880,
      height: 2482,
      alt: {
        en: "A quiz room during a question: the countdown, the question with four answers, the points the player just earned and the live room leaderboard",
        hr: "Soba kviza tijekom pitanja: odbrojavanje, pitanje s četiri odgovora, upravo osvojeni bodovi i ljestvica sobe uživo",
      },
    },
  },
  {
    id: "ratemymeal",
    name: "RateMyMeal",
    context: {
      en: "Team project with a classmate, Software Engineering course, 2026",
      hr: "Timski projekt s kolegom, kolegij Programsko inženjerstvo, 2026.",
    },
    summary: {
      en: "A Django platform for posting and rating meals. Regular users, food critics, restaurant owners and admins each see different parts of the app. I built most of the backend and the frontend.",
      hr: "Django platforma za objavu i ocjenjivanje jela. Korisnici, kritičari, vlasnici restorana i administratori vide različite dijelove aplikacije. Izradio sam veći dio backenda i frontenda.",
    },
    highlights: [
      {
        en: "Four roles with their own permissions; views check both the role and who owns the content.",
        hr: "Četiri uloge s vlastitim ovlastima; pogledi provjeravaju i ulogu i vlasništvo nad sadržajem.",
      },
      {
        en: "A trending feed ranked by likes, comments and rating, and a feed of followed users.",
        hr: "Popularne objave poredane prema lajkovima, komentarima i ocjeni te objave korisnika koje pratiš.",
      },
      {
        en: "Reporting of posts and an admin dashboard for moderation.",
        hr: "Prijava neprimjerenih objava i administratorska nadzorna ploča za moderiranje.",
      },
    ],
    stack: ["Python", "Django", "SQLite", "Bootstrap"],
    links: {
      code: "https://github.com/dmarenic/ratemymeal",
    },
    visual: {
      type: "image",
      src: "/images/projects/ratemymeal-feed.png",
      width: 2880,
      height: 3064,
      alt: {
        en: "RateMyMeal feed filtered to Italian restaurant meals, with ratings, likes and comment counts",
        hr: "RateMyMeal s objavama filtriranim na talijanska jela iz restorana, s ocjenama, lajkovima i brojem komentara",
      },
    },
  },
  {
    id: "bluepulse",
    name: "Blue Pulse",
    context: {
      en: "Android app, Mobile Application Development course, 2026",
      hr: "Android aplikacija, kolegij Razvoj mobilnih aplikacija, 2026.",
    },
    summary: {
      en: "A native Android app for GNK Dinamo Zagreb fans: fixtures and results, the first-team squad, player-of-the-month voting, the league table and a fan photo gallery.",
      hr: "Nativna Android aplikacija za navijače GNK Dinamo Zagreb: raspored i rezultati utakmica, prva momčad, glasanje za igrača mjeseca, ljestvica lige i galerija navijačkih fotografija.",
    },
    highlights: [
      {
        en: "MVVM: every screen's state is a single UiState (loading, success, empty or error).",
        hr: "MVVM: stanje svakog zaslona je jedan UiState (učitavanje, uspjeh, prazno ili greška).",
      },
      {
        en: "Offline first: fixtures and players are cached in Room, so the screens are never empty.",
        hr: "Offline-first: utakmice i igrači spremaju se u Room pa zasloni nikad nisu prazni.",
      },
      {
        en: "Firebase Auth and Firestore, with security rules that allow one vote per user each month.",
        hr: "Firebase Auth i Firestore, uz sigurnosna pravila koja dopuštaju jedan glas po korisniku mjesečno.",
      },
    ],
    stack: ["Kotlin", "Jetpack Compose", "Firebase", "Room", "Retrofit"],
    links: {
      code: "https://github.com/dmarenic/blue-pulse",
    },
    visual: {
      type: "image",
      src: "/images/projects/blue-pulse.jpg",
      width: 1080,
      height: 2115,
      alt: {
        en: "Blue Pulse home screen: the next match, Dinamo Zagreb against Anderlecht in the UEFA Europa League at Stadion Maksimir, with a countdown in days, hours and minutes, a match reminder button and the bottom navigation",
        hr: "Početni zaslon aplikacije Blue Pulse: sljedeća utakmica Dinamo Zagreb – Anderlecht u UEFA Europa League na Stadionu Maksimir, s odbrojavanjem u danima, satima i minutama, gumbom za podsjetnik na utakmicu i donjom navigacijom",
      },
      fit: "contain",
    },
  },
];

/* -------------------------------------------------------------------------- */
/* Skills                                                                     */
/* -------------------------------------------------------------------------- */

export const skills = {
  title: { en: "Skills", hr: "Vještine" },
  // Every skill once, on three cards of the skills carousel.
  cards: [
    {
      name: { en: "Frontend", hr: "Frontend" },
      description: {
        en: "The parts of an app people see and use.",
        hr: "Sučelja koja korisnik vidi i koristi.",
      },
      items: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js"],
    },
    {
      name: { en: "Backend & databases", hr: "Backend i baze podataka" },
      description: {
        en: "Servers, APIs and the data behind an app.",
        hr: "Poslužitelji, API-ji i podaci iza aplikacije.",
      },
      items: [
        "Node.js",
        "NestJS",
        "Python",
        "Django",
        "SQL",
        "PostgreSQL",
        "Prisma",
      ],
    },
    {
      name: { en: "Tools & other languages", hr: "Alati i ostali jezici" },
      description: {
        en: "Version control, containers, automation and languages beyond the web.",
        hr: "Verzioniranje, kontejneri, automatizacija i jezici izvan weba.",
      },
      items: ["Git", "C", "Kotlin", "Docker", "GitHub Actions"],
    },
  ],
};

/* -------------------------------------------------------------------------- */
/* Experience and education                                                   */
/* -------------------------------------------------------------------------- */

export const experienceSection = {
  title: { en: "Experience and education", hr: "Iskustvo i obrazovanje" },
};

export const experience = {
  title: { en: "Work", hr: "Radno iskustvo" },
  items: [
    {
      role: { en: "Internship", hr: "Stručna praksa" },
      organization: "GROW d.o.o.",
      place: "Novska",
      period: { en: "July-August 2026", hr: "srpanj-kolovoz 2026." },
      description: {
        en: "Worked on a Flutter web application that has not been released yet. I implemented user login and the connection to the backend API and added new features, partly on my own and partly with the team.",
        hr: "Radio sam na web aplikaciji u Flutteru koja još nije objavljena. Implementirao sam prijavu korisnika i povezivanje s API-jem te dodavao nove funkcionalnosti, dijelom samostalno, a dijelom u timu.",
      },
      // Flutter and Dart are mentioned only here, not in the skills list.
      stack: ["Flutter", "Dart"],
    },
  ],
};

export const education = {
  title: { en: "Education", hr: "Obrazovanje" },
  // Newest first. degree is left out where no degree was given.
  items: [
    {
      school: {
        en: "Faculty of Electrical Engineering, Computer Science and Information Technology Osijek (FERIT)",
        hr: "Fakultet elektrotehnike, računarstva i informacijskih tehnologija Osijek (FERIT)",
      },
      programme: {
        en: "Professional undergraduate study of Computer Engineering",
        hr: "Stručni prijediplomski studij Računarstvo",
      },
      // VERIFY: the English wording is a description, not the official name.
      // Check it against the Diploma Supplement before publishing.
      degree: {
        en: "Professional bachelor's degree in Computer Engineering (bacc. ing. comp.)",
        hr: "Prvostupnik (baccalaureus) inženjer računarstva (bacc. ing. comp.)",
      },
      period: { en: "2023-2026", hr: "2023-2026" },
    },
    {
      school: {
        en: "Technical School Kutina",
        hr: "Tehnička škola Kutina",
      },
      // VERIFY: the English name of the programme is a suggestion.
      programme: {
        en: "Computer Technician",
        hr: "Tehničar za računalstvo",
      },
      period: { en: "2019-2023", hr: "2019-2023" },
    },
  ] as {
    school: Localized;
    programme: Localized;
    degree?: Localized;
    period: Localized;
  }[],
};

/* -------------------------------------------------------------------------- */
/* Contact                                                                    */
/* -------------------------------------------------------------------------- */

export const contact = {
  title: { en: "Contact", hr: "Kontakt" },
  // The large line at the top of the contact section, set like the name in
  // the hero. The last word is highlighted.
  heading: { en: "Get in touch", hr: "Javite se" },
  text: {
    en: "Email is the best way to reach me. You can also find me on LinkedIn and GitHub.",
    hr: "Najlakše ćete me dobiti e-poštom. Možete me pronaći i na LinkedInu i GitHubu.",
  },
};

/* -------------------------------------------------------------------------- */
/* Chatbot                                                                    */
/* -------------------------------------------------------------------------- */

// The AI assistant in the bottom right corner (see components/Chat). What the
// assistant knows comes from this file too (see lib/chatbot/knowledge.ts).
export const chatbot = {
  name: "Dominik AI",
  badge: "AI",
  subtitle: {
    en: "Answers questions about me",
    hr: "Odgovara na pitanja o meni",
  },
  // Screen reader name and tooltip of the round button.
  open: { en: "Open Dominik AI", hr: "Otvori Dominik AI" },
  close: { en: "Close", hr: "Zatvori" },
  newChat: { en: "New chat", hr: "Novi razgovor" },
  greeting: {
    en: "Hi! I'm Dominik's AI assistant. Ask me about his projects, skills or experience.",
    hr: "Bok! Ja sam Dominikov AI asistent. Pitaj me o njegovim projektima, vještinama ili iskustvu.",
  },
  tryAsking: { en: "Try asking:", hr: "Pokušaj pitati:" },
  suggestions: [
    {
      en: "What tech stack do you use?",
      hr: "Koje tehnologije koristiš?",
    },
    {
      en: "What's your most interesting project?",
      hr: "Koji ti je najzanimljiviji projekt?",
    },
    {
      en: "Are you open to work, and where?",
      hr: "Tražiš li posao i gdje možeš raditi?",
    },
  ],
  placeholder: {
    en: "Ask anything about me...",
    hr: "Pitaj nešto o meni...",
  },
  inputLabel: { en: "Your message", hr: "Tvoja poruka" },
  send: { en: "Send", hr: "Pošalji" },
  // Read by screen readers before each message.
  you: { en: "You", hr: "Ti" },
  typing: { en: "Dominik AI is typing", hr: "Dominik AI piše" },
  disclaimer: {
    en: "AI can make mistakes. Chats are saved and sent to Dominik, so please don't share personal data.",
    hr: "AI može pogriješiti. Razgovori se spremaju i šalju Dominiku, pa ne upisuj osobne podatke.",
  },
  // Answers the visitor gets instead of a reply from the model. Each one
  // ends with the email address, so the visitor can always reach Dominik.
  errors: {
    unavailable: {
      en: `Sorry, I can't answer right now. Please try again later, or write to Dominik at ${profile.email}.`,
      hr: `Nažalost, trenutno ne mogu odgovoriti. Pokušaj ponovno kasnije ili piši Dominiku na ${profile.email}.`,
    },
    invalid: {
      en: `This message can't be sent. A message can have up to 500 characters. You can also write to Dominik at ${profile.email}.`,
      hr: `Ovu poruku nije moguće poslati. Poruka može imati najviše 500 znakova. Možeš pisati i Dominiku na ${profile.email}.`,
    },
    tooFast: {
      en: `That's a lot of messages in a short time. Please wait a few minutes, or write to Dominik at ${profile.email}.`,
      hr: `Stiglo je puno poruka u kratkom vremenu. Pričekaj nekoliko minuta ili piši Dominiku na ${profile.email}.`,
    },
    daily: {
      en: `You've reached today's message limit. For more questions, write to Dominik at ${profile.email}.`,
      hr: `Dosegnuto je današnje ograničenje poruka. Za daljnja pitanja piši Dominiku na ${profile.email}.`,
    },
    conversation: {
      en: `This chat has reached its message limit. Start a new chat, or write to Dominik at ${profile.email}.`,
      hr: `Ovaj razgovor je dosegnuo najveći broj poruka. Započni novi razgovor ili piši Dominiku na ${profile.email}.`,
    },
    site: {
      en: `I've answered a lot of questions today and I'm taking a break until tomorrow. Write to Dominik at ${profile.email}.`,
      hr: `Danas sam odgovorio na puno pitanja i odmaram do sutra. Piši Dominiku na ${profile.email}.`,
    },
    verification: {
      en: `I couldn't confirm that you're not a bot. Please reload the page and try again, or write to Dominik at ${profile.email}.`,
      hr: `Nisam uspio potvrditi da nisi bot. Osvježi stranicu i pokušaj ponovno ili piši Dominiku na ${profile.email}.`,
    },
  },
};

// The 404 page cannot know the visitor's language, so it shows both.
export const notFoundPage = {
  title: "Page not found | Stranica nije pronađena",
  en: {
    heading: "This page does not exist.",
    text: "The link may be old or mistyped.",
    link: "Go to the home page",
  },
  hr: {
    heading: "Ova stranica ne postoji.",
    text: "Poveznica je možda stara ili pogrešno upisana.",
    link: "Idi na početnu stranicu",
  },
};

export const footer = {
  // "No tracking cookies": Cloudflare Turnstile in the chat window may set a
  // security cookie, so "no cookies" would no longer be true.
  builtWith: {
    en: "Built with Next.js and TypeScript. No tracking cookies.",
    hr: "Izrađeno u Next.jsu i TypeScriptu. Bez kolačića za praćenje.",
  },
};
