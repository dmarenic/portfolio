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
/* Events in the hero diagram                                                 */
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
    {
      en: "Outside of programming I train at the gym, watch TV series and watch football with friends.",
      hr: "Izvan programiranja treniram u teretani, gledam serije i nogomet s ekipom.",
    },
  ],
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
  // A screenshot, or a diagram drawn by a component when there is no screenshot.
  visual:
    | {
        type: "image";
        src: string;
        width: number;
        height: number;
        alt: Localized;
      }
    | { type: "diagram" };
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
    visual: { type: "diagram" },
  },
];

// Drawn instead of a screenshot for Blue Pulse (the app shows club crests,
// which must not appear on this site). Layers are taken from the app's README.
export const bluePulseArchitecture = {
  layers: [
    { name: "Jetpack Compose", role: { en: "screens", hr: "zasloni" } },
    {
      name: "ViewModel",
      role: { en: "StateFlow of UiState", hr: "StateFlow s UiState" },
    },
    {
      name: "Repository",
      role: { en: "picks the data source", hr: "bira izvor podataka" },
    },
  ],
  sources: [
    {
      name: "Retrofit",
      role: { en: "TheSportsDB API", hr: "TheSportsDB API" },
    },
    {
      name: "Firebase",
      role: { en: "Auth, Firestore", hr: "Auth, Firestore" },
    },
    { name: "Room", role: { en: "offline cache", hr: "offline predmemorija" } },
  ],
  caption: {
    en: "How data moves through Blue Pulse. Fixtures and players come from the API, then from the Room cache, then from built-in data, so the screens are never empty.",
    hr: "Kako podaci putuju kroz Blue Pulse. Utakmice i igrači dolaze s API-ja, zatim iz Room predmemorije, pa iz ugrađenih podataka, zato zasloni nikad nisu prazni.",
  },
};

/* -------------------------------------------------------------------------- */
/* Skills                                                                     */
/* -------------------------------------------------------------------------- */

export const skills = {
  title: { en: "Skills", hr: "Vještine" },
  comfortable: {
    label: { en: "Comfortable with", hr: "Dobro poznajem" },
    items: [
      "TypeScript",
      "JavaScript",
      "Python",
      "C",
      "HTML",
      "CSS",
      "React",
      "Next.js",
      "NestJS",
      "Node.js",
      "Django",
      "SQL",
      "PostgreSQL",
      "Prisma",
      "Git",
    ],
  },
  basics: {
    label: { en: "Basics", hr: "Osnove" },
    items: ["Kotlin", "Docker", "GitHub Actions"],
  },
  matrix: {
    title: {
      en: "Where you can see it in my code",
      hr: "Gdje se to vidi u mom kodu",
    },
    note: {
      en: "Each filled cell names how the technology is used in that project.",
      hr: "Svaka popunjena ćelija pokazuje kako je tehnologija korištena u tom projektu.",
    },
    technology: { en: "Technology", hr: "Tehnologija" },
    notUsed: { en: "Not used", hr: "Nije korišteno" },
    // Every row is a technology; a cell names what the project uses it for.
    // Cell text is a technical name, so it reads the same in both languages.
    rows: [
      { skill: "TypeScript", cells: { trivia: "Next.js, NestJS" } },
      { skill: "Python", cells: { ratemymeal: "Django" } },
      { skill: "Kotlin", cells: { bluepulse: "Jetpack Compose" } },
      {
        skill: "HTML & CSS",
        cells: { trivia: "Tailwind CSS", ratemymeal: "Bootstrap" },
      },
      { skill: "React & Next.js", cells: { trivia: "App Router" } },
      { skill: "NestJS & Node.js", cells: { trivia: "REST, Socket.IO" } },
      { skill: "Django", cells: { ratemymeal: "ORM, Admin" } },
      {
        skill: "SQL",
        cells: {
          trivia: "PostgreSQL",
          ratemymeal: "SQLite",
          bluepulse: "Room",
        },
      },
      { skill: "Prisma", cells: { trivia: "Prisma Migrate" } },
      { skill: "Docker", cells: { trivia: "Docker Compose" } },
      { skill: "GitHub Actions", cells: { trivia: "CI" } },
      {
        skill: "Git",
        cells: { trivia: "GitHub", ratemymeal: "GitHub", bluepulse: "GitHub" },
      },
    ] satisfies { skill: string; cells: Partial<Record<ProjectId, string>> }[],
  },
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
  ],
};

/* -------------------------------------------------------------------------- */
/* Contact                                                                    */
/* -------------------------------------------------------------------------- */

export const contact = {
  title: { en: "Contact", hr: "Kontakt" },
  text: {
    en: "Email is the best way to reach me. You can also find me on LinkedIn and GitHub.",
    hr: "Najlakše ćete me dobiti e-poštom. Možete me pronaći i na LinkedInu i GitHubu.",
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
  builtWith: {
    en: "Built with Next.js and TypeScript. No cookies, no tracking.",
    hr: "Izrađeno u Next.jsu i TypeScriptu. Bez kolačića i praćenja.",
  },
};
