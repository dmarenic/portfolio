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
  intro: {
    en: "I build web applications in TypeScript and Python, from the database schema to the interface. I graduated in computer engineering from FERIT Osijek and I'm looking for my first job on a team where I can learn from experienced developers.",
    hr: "Izrađujem web aplikacije u TypeScriptu i Pythonu, od sheme baze podataka do sučelja. Završio sam studij računarstva na FERIT-u u Osijeku i tražim prvi posao u timu u kojem mogu učiti od iskusnijih programera.",
  },
  availability: {
    en: "Osijek, Croatia. Open to work in Osijek or remote.",
    hr: "Osijek, Hrvatska. Posao u Osijeku ili na daljinu.",
  },
  email: "dominik.marenic@gmail.com",
  github: "https://github.com/dmarenic",
  linkedin: "https://www.linkedin.com/in/dominik-marenic/",
  // Set to an object { src, alt } once the photo is in public/images.
  photo: null as { src: string; alt: Localized } | null,
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
    items: [
      { href: "#projects", label: { en: "Projects", hr: "Projekti" } },
      { href: "#skills", label: { en: "Skills", hr: "Vještine" } },
      { href: "#experience", label: { en: "Experience", hr: "Iskustvo" } },
      { href: "#contact", label: { en: "Contact", hr: "Kontakt" } },
    ],
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
  hero: {
    primaryAction: { en: "See my projects", hr: "Pogledaj projekte" },
    secondaryAction: { en: "Email me", hr: "Pošalji e-poštu" },
  },
  diagram: {
    actors: {
      host: { en: "Host", hr: "Domaćin" },
      server: { en: "Server", hr: "Poslužitelj" },
      player: { en: "Player", hr: "Igrač" },
    },
    note: {
      en: "points are calculated on the server only",
      hr: "bodove računa samo poslužitelj",
    },
    caption: {
      en: "One round of my bachelor's thesis project, traced as Socket.IO events.",
      hr: "Jedna runda iz mog završnog rada, prikazana kao Socket.IO događaji.",
    },
    description: {
      en: "The host creates a room and the server confirms it. A player joins and the server tells everyone. The host starts the game and the server sends the first question to everyone. The player submits an answer, the server sends back the result to that player only, and when the question ends the server sends the leaderboard to everyone.",
      hr: "Domaćin stvara sobu i poslužitelj to potvrđuje. Igrač ulazi i poslužitelj o tome obavještava sve. Domaćin pokreće igru i poslužitelj svima šalje prvo pitanje. Igrač šalje odgovor, poslužitelj rezultat vraća samo tom igraču, a kad pitanje završi, svima šalje ljestvicu.",
    },
  },
};

/* -------------------------------------------------------------------------- */
/* About                                                                      */
/* -------------------------------------------------------------------------- */

export const about = {
  title: { en: "About", hr: "O meni" },
  paragraphs: [
    {
      en: "I finished the professional undergraduate study of computer engineering at FERIT Osijek in 2026. For my bachelor's thesis I built a real-time multiplayer quiz on my own, from the PostgreSQL schema to the Next.js interface. During a summer internship I worked on a Flutter web app, partly on my own and partly with the team.",
      hr: "Završio sam stručni prijediplomski studij računarstva na FERIT-u u Osijeku 2026. godine. Za završni rad samostalno sam izradio kviz za više igrača u stvarnom vremenu, od PostgreSQL sheme do sučelja u Next.jsu. Na ljetnoj stručnoj praksi radio sam na web aplikaciji u Flutteru, dijelom samostalno, a dijelom u timu.",
    },
    {
      en: "I'm looking for a junior backend or full stack role, in Osijek or remote. Most of all I want a job where I can learn with a mentor.",
      hr: "Tražim posao junior backend ili full stack programera, u Osijeku ili na daljinu. Najviše mi znači posao na kojem mogu učiti uz mentora.",
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
      src: "/images/projects/trivia-lobby.png",
      width: 2880,
      height: 2106,
      alt: {
        en: "Room lobby of the quiz: four players marked as ready, game settings and the room chat",
        hr: "Predvorje sobe u kvizu: četiri spremna igrača, postavke partije i chat sobe",
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

export const experience = {
  title: { en: "Experience", hr: "Iskustvo" },
  items: [
    {
      role: { en: "Internship", hr: "Stručna praksa" },
      organization: "GROW d.o.o.",
      place: "Novska",
      period: { en: "July – August 2026", hr: "srpanj – kolovoz 2026." },
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
      period: { en: "2023 – 2026", hr: "2023. – 2026." },
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
