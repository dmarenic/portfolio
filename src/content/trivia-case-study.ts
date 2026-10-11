/**
 * Text of the Online Trivia Quiz case study page
 * (/projects/online-trivia-quiz and /hr/projects/online-trivia-quiz).
 *
 * Copied from drafts/online-trivia-quiz-case-study.md. Every claim comes from
 * the code and documentation of the dmarenic/online-trivia-quiz repository.
 * Text between backticks (`answer_result`) is shown as code.
 */
import type { Localized } from "@/lib/i18n";

export const triviaCaseStudy = {
  path: "/projects/online-trivia-quiz",

  intro: {
    en: "A multiplayer quiz that runs in real time. My bachelor's thesis at FERIT Osijek, built on my own in 2026: frontend, backend, database and deployment.",
    hr: "Kviz za više igrača koji se odvija u stvarnom vremenu. Moj završni rad na FERIT-u u Osijeku, koji sam 2026. izradio samostalno: frontend, backend, bazu podataka i objavu.",
  },

  // The GIF of one round from the repository, converted to MP4. It does not
  // play by itself.
  video: {
    src: "/videos/trivia-round.mp4",
    poster: "/videos/trivia-round-poster.jpg",
    width: 900,
    height: 562,
    label: { en: "Video of one round", hr: "Video jedne runde" },
  },

  whatItDoes: {
    title: { en: "What it does", hr: "Što radi" },
    paragraphs: [
      {
        en: "Players create a private room, invite friends and answer questions from a chosen category together. Every player sees the same question at the same time and has the same amount of time to answer. Points depend on whether the answer is correct and how fast it was, and the leaderboard updates after every question. A room can have a chat, and the host chooses the category, difficulty, number of questions and time per question.",
        hr: "Igrači stvaraju privatnu sobu, pozivaju prijatelje i zajedno odgovaraju na pitanja iz odabrane kategorije. Svi vide isto pitanje u istom trenutku i imaju jednako vremena za odgovor. Bodovi ovise o točnosti i brzini odgovora, a ljestvica se mijenja nakon svakog pitanja. Soba ima chat, a domaćin bira kategoriju, težinu, broj pitanja i vrijeme po pitanju.",
      },
      {
        en: "Logged-in players also get a profile with statistics and game history, friends and room invites, and a daily challenge: the same set of questions for everyone, one attempt per day. Guests can play with just a nickname. Admins manage the question bank and can generate new questions with the Google Gemini API.",
        hr: "Prijavljeni igrači imaju i profil sa statistikom i poviješću partija, prijatelje i pozivnice u sobu te dnevni izazov: isti skup pitanja za sve, jedan pokušaj dnevno. Gost može igrati samo s nadimkom. Administratori upravljaju bazom pitanja i mogu generirati nova pitanja pomoću Google Gemini API-ja.",
      },
    ],
  },

  // Screenshots from the repository.
  screenshots: [
    {
      src: "/images/projects/trivia-lobby.png",
      width: 2880,
      height: 2106,
      caption: { en: "Lobby", hr: "Predvorje" },
      alt: {
        en: "Room lobby: four ready players, the game settings and the room chat",
        hr: "Predvorje sobe: četiri spremna igrača, postavke igre i chat sobe",
      },
    },
    {
      src: "/images/projects/trivia-leaderboard.png",
      width: 2880,
      height: 2482,
      caption: { en: "Live leaderboard", hr: "Ljestvica uživo" },
      alt: {
        en: "A quiz room during a question: the countdown, the question with four answers, the points the player just earned and the live room leaderboard",
        hr: "Soba kviza tijekom pitanja: odbrojavanje, pitanje s četiri odgovora, upravo osvojeni bodovi i ljestvica sobe uživo",
      },
    },
    {
      src: "/images/projects/trivia-final-results.png",
      width: 2880,
      height: 1800,
      caption: { en: "Final results", hr: "Konačni poredak" },
      alt: {
        en: "Final results: the room ranking with the points of each player",
        hr: "Konačni poredak sobe s bodovima svakog igrača",
      },
    },
    {
      src: "/images/projects/trivia-admin-questions.png",
      width: 2880,
      height: 2160,
      caption: { en: "Admin", hr: "Administracija" },
      alt: {
        en: "Admin console: the AI question generator, the form for a new question and the question bank",
        hr: "Administracija: generiranje pitanja pomoću AI-ja, obrazac za novo pitanje i baza pitanja",
      },
    },
  ] satisfies {
    src: string;
    width: number;
    height: number;
    caption: Localized;
    alt: Localized;
  }[],

  hardPart: {
    title: { en: "The hard part", hr: "Najteži dio" },
    text: {
      en: "A quiz for several people only works if three things hold: everyone sees the same state of the game, the timer is the same for everyone, and nobody can win by cheating. A browser cannot be trusted with any of that, so the server has to run the game.",
      hr: "Kviz za više igrača radi samo ako vrijede tri stvari: svi vide isto stanje igre, odbrojavanje je jednako za sve i nitko ne može pobijediti varanjem. Ništa od toga ne može se prepustiti pregledniku, pa igru mora voditi poslužitelj.",
    },
  },

  architecture: {
    title: { en: "Architecture", hr: "Arhitektura" },
    intro: [
      {
        en: "The frontend is a Next.js app on Vercel. The backend is a NestJS app on Render with a PostgreSQL database, accessed through Prisma.",
        hr: "Frontend je Next.js aplikacija na Vercelu. Backend je NestJS aplikacija na Renderu s PostgreSQL bazom, kojoj pristupa preko Prisme.",
      },
      {
        en: "The browser talks to the backend in two ways:",
        hr: "Preglednik s backendom komunicira na dva načina:",
      },
    ],
    channels: [
      {
        name: "REST",
        text: {
          en: "for everything that is not time-critical: registration and login, profiles, friends, the daily challenge and question management.",
          hr: "za sve što ne mora biti u stvarnom vremenu: registraciju i prijavu, profile, prijatelje, dnevni izazov i upravljanje pitanjima.",
        },
      },
      {
        name: "Socket.IO",
        text: {
          en: "for everything that happens inside a room: joining, chat, settings, questions, answers and scores.",
          hr: "za sve što se događa unutar sobe: ulazak, chat, postavke, pitanja, odgovore i bodove.",
        },
      },
    ],
    state: {
      en: "The state of running games (rooms, players, current question, points) lives in the server's memory, in `Map` objects. Only the final result is saved to the database, and only for logged-in players. This keeps every move in the game fast, with one known trade-off: restarting the server ends the games that are in progress.",
      hr: "Stanje aktivnih partija (sobe, igrači, trenutno pitanje, bodovi) drži se u memoriji poslužitelja, u `Map` strukturama. U bazu se sprema samo konačni rezultat, i to samo za prijavljene igrače. Zato je svaki potez u igri brz, uz jedan poznati kompromis: ponovno pokretanje poslužitelja prekida partije koje su u tijeku.",
    },
    // The boxes of the diagram, from the browser down to the database.
    diagram: {
      label: {
        en: "Architecture of Online Trivia Quiz",
        hr: "Arhitektura aplikacije Online Trivia Quiz",
      },
      browser: { en: "Browser", hr: "Preglednik" },
      frontend: { name: "Next.js", host: "Vercel" },
      transport: "REST + Socket.IO",
      backend: { name: "NestJS", host: "Render" },
      orm: "Prisma",
      database: "PostgreSQL",
      ai: {
        name: "Google Gemini API",
        role: { en: "question generation", hr: "generiranje pitanja" },
      },
    },
  },

  challenges: {
    title: { en: "Technical challenges", hr: "Tehnički izazovi" },
    items: [
      {
        title: {
          en: "The server is the only judge.",
          hr: "Poslužitelj je jedini sudac.",
        },
        text: {
          en: "The client sends only the text of the chosen answer. The server checks it and calculates the points: 1000 for a correct answer plus a speed bonus of `max(0, 500 − ms / 30)`, so the bonus is gone after 15 seconds. Clients only ever receive a public copy of the room without the questions, because they contain the correct answers. The correct answer leaves the server in exactly one event, `answer_result`, and only after that player has answered, so it cannot be read from network traffic. A test checks that the public room object never gains new fields by accident.",
          hr: "Klijent šalje samo tekst odabranog odgovora. Poslužitelj ga provjerava i računa bodove: 1000 za točan odgovor plus bonus za brzinu `max(0, 500 − ms / 30)`, pa bonus nestaje nakon 15 sekundi. Klijenti dobivaju samo javnu kopiju sobe bez pitanja, jer pitanja sadrže točne odgovore. Točan odgovor izlazi s poslužitelja u samo jednom događaju, `answer_result`, i to tek nakon što je igrač odgovorio, pa ga se ne može pročitati iz mrežnog prometa. Test provjerava da javna kopija sobe slučajno ne dobije nova polja.",
        },
      },
      {
        title: {
          en: "A refresh is not leaving.",
          hr: "Osvježavanje nije izlazak.",
        },
        text: {
          en: "Refreshing the page closes the WebSocket connection, which looks exactly like a player leaving. So a lost connection only marks the player as disconnected. When they come back, a logged-in player is recognised by their user id and a guest by their nickname, but only if that slot is disconnected, so another guest with the same nickname cannot take someone's place. A player who returns during a question gets the remaining time, calculated from when the question started. If the host disconnects, the role passes to another player after 10 seconds, so a refresh does not cost the host their role. A room with nobody connected is deleted after 30 seconds.",
          hr: "Osvježavanje stranice zatvara WebSocket vezu, što izgleda isto kao odlazak igrača. Zato prekid veze igrača samo označi kao odspojenog. Kad se vrati, prijavljeni igrač prepoznaje se po korisničkom ID-u, a gost po nadimku, ali samo ako je to mjesto odspojeno, pa drugi gost s istim nadimkom ne može preuzeti tuđe mjesto. Igrač koji se vrati usred pitanja dobiva preostalo vrijeme, izračunato od početka pitanja. Ako domaćin izgubi vezu, uloga prelazi na drugog igrača tek nakon 10 sekundi, pa ga osvježavanje stranice ne košta uloge. Soba u kojoj nitko nije spojen briše se nakon 30 sekundi.",
        },
      },
      {
        title: { en: "The game keeps moving.", hr: "Igra ne stoji." },
        text: {
          en: "The server runs the timer and sends `timer_updated` every second. A question ends when everyone has answered or the time runs out. If the host does not start the next question within 30 seconds, the server continues by itself, so one inactive player cannot stop the game for everyone.",
          hr: "Odbrojavanje vodi poslužitelj i svake sekunde šalje `timer_updated`. Pitanje završava kad svi odgovore ili istekne vrijeme. Ako domaćin ne pokrene sljedeće pitanje unutar 30 sekundi, poslužitelj nastavlja sam, pa jedan neaktivan igrač ne može zaustaviti igru svima.",
        },
      },
      {
        title: {
          en: "WebSocket input needs its own checks.",
          hr: "Ulaz preko WebSocketa treba vlastite provjere.",
        },
        text: {
          en: "NestJS guards and DTO validation protect the REST API, but they do not apply to WebSocket events. So the socket layer verifies the JWT from the handshake by hand, validates every payload with its own functions (room code, nickname, message length, number of questions, time per question) and limits how often a client can create rooms, join, chat or send invites. The player's identity always comes from the token, never from the payload.",
          hr: "NestJS guardovi i DTO validacija štite REST API, ali ne vrijede za WebSocket događaje. Zato socket sloj ručno provjerava JWT iz handshakea, svaki payload validira vlastitim funkcijama (kod sobe, nadimak, duljina poruke, broj pitanja, vrijeme po pitanju) i ograničava koliko često klijent smije stvarati sobe, ulaziti u njih, pisati u chat ili slati pozivnice. Identitet igrača uvijek dolazi iz tokena, nikad iz payloada.",
        },
      },
      {
        title: {
          en: "One daily attempt, enforced twice.",
          hr: "Jedan dnevni pokušaj, osiguran dvaput.",
        },
        text: {
          en: 'Checking "already played today" and saving the result happen in one database transaction, so two requests sent at the same time cannot both pass. A unique constraint on (user, challenge) in the Prisma schema is the final guarantee.',
          hr: "Provjera „već igrano danas” i upis rezultata izvode se u jednoj transakciji baze, pa dva istovremena zahtjeva ne mogu oba proći. Konačnu garanciju daje jedinstveno ograničenje na (korisnik, izazov) u Prisma shemi.",
        },
      },
      {
        title: { en: "Tests and CI.", hr: "Testovi i CI." },
        text: {
          en: "Jest tests cover the scoring, the answer flow (a second answer to the same question and answers after the time is up are ignored), host-only actions, the room code generator and a check that answers never leak into the public room object. On every push, GitHub Actions runs a dependency audit, lint, type checks and the build for both the frontend and the backend, and the tests for the backend.",
          hr: "Jest testovi pokrivaju bodovanje, tijek odgovaranja (drugi odgovor na isto pitanje i odgovor nakon isteka vremena se ignoriraju), akcije koje smije samo domaćin, generator koda sobe i provjeru da odgovori ne cure u javnu kopiju sobe. GitHub Actions na svaki push pokreće provjeru ranjivosti paketa, lint, provjeru tipova i build za frontend i za backend, a testove za backend.",
        },
      },
    ],
  },

  learned: {
    title: { en: "What I learned", hr: "Što sam naučio" },
    text: {
      en: "The most important thing I learned on this project is how to use WebSockets for real-time communication: keeping several browsers in sync through events and deciding what the server sends, to whom and when.",
      hr: "Najvažnije što sam naučio na ovom projektu je korištenje WebSocketa za komunikaciju u stvarnom vremenu: kako događajima držati više preglednika usklađenima i kako odlučiti što poslužitelj šalje, kome i kada.",
    },
  },

  builtWith: {
    title: { en: "Built with", hr: "Tehnologije" },
    rows: [
      {
        label: { en: "Frontend", hr: "Frontend" },
        value: "Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS",
      },
      {
        label: { en: "Backend", hr: "Backend" },
        value: "NestJS 11, Socket.IO 4.8, Passport (JWT), bcrypt",
      },
      {
        label: { en: "Database", hr: "Baza" },
        value: "PostgreSQL, Prisma ORM",
      },
      {
        label: { en: "Other", hr: "Ostalo" },
        value: "Google Gemini API, Docker Compose, GitHub Actions, Jest",
      },
      {
        label: { en: "Hosting", hr: "Objava" },
        value: "Vercel (frontend), Render (backend)",
      },
    ] satisfies { label: Localized; value: string }[],
  },
};
