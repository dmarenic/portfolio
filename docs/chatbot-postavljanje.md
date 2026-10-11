# Postavljanje chatbota Dominik AI

Ove upute vode te korak po korak kroz sve ključeve koje chatbot treba: kako ih dobiti, kako ih upisati lokalno i kako ih dodati na Vercel. Popis svih varijabli s kratkim objašnjenjima nalazi se u datoteci [`.env.example`](../.env.example).

## Što chatbot treba

| Varijabla                                                | Čemu služi                                                     | Obavezna                  |
| -------------------------------------------------------- | -------------------------------------------------------------- | ------------------------- |
| `GEMINI_API_KEY`                                         | ključ za Googleov model Gemini                                 | da                        |
| `GEMINI_MODEL`                                           | drugi model umjesto `gemini-3.1-flash-lite`                    | ne                        |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`     | pohrana razgovora (48 sati) i ograničenja broja poruka         | na Vercelu da, lokalno ne |
| `IP_HASH_SALT`                                           | tajna sol za hash IP adresa                                    | na Vercelu da, lokalno ne |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile, zaštita od botova                        | preporučeno               |
| `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `CHAT_NOTIFY_EMAIL`  | slanje razgovora e-mailom                                      | za e-mailove da           |
| `CRON_SECRET`                                            | zaštita dnevnog posla koji šalje neposlane razgovore           | na Vercelu da             |
| `CHAT_ENABLED`                                           | `false` isključuje chatbot                                     | ne                        |
| `CHAT_ALLOWED_ORIGINS`                                   | dodatne adrese s kojih chat smije raditi, npr. vlastita domena | ne                        |
| `CHAT_LIMIT_*`                                           | ograničenja broja poruka (zadano 10, 40, 20 i 300)             | ne                        |

Pravilo za sve ključeve: **nijedan tajni ključ ne smije imati prefiks `NEXT_PUBLIC_`**. Next.js varijable s tim prefiksom ugrađuje u JavaScript koji dobiva preglednik, pa bi ih svatko mogao pročitati. Jedina iznimka je `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, jer je Turnstileov ključ stranice javan po dizajnu.

## 1. Gemini

1. Otvori https://aistudio.google.com/apikey i prijavi se Google računom.
2. Napravi novi ključ (Create API key) i odaberi projekt.
3. Ograniči ključ opcijom **"Restrict to Gemini API only"**, da se ne može koristiti ni za što drugo.
4. Za projekt uključi naplatu (**"Set up billing"**). Googleovi dodatni uvjeti za Gemini API (https://ai.google.dev/gemini-api/terms) kažu da se za aplikacije dostupne korisnicima u EU, Švicarskoj i Ujedinjenom Kraljevstvu smiju koristiti samo plaćene usluge. Besplatna razina za to nije dopuštena.
5. Na stranici **Spend** postavi mjesečni limit potrošnje, npr. nekoliko eura. Ograničenje od 300 poruka dnevno za cijelu stranicu dodatno drži trošak pod kontrolom.
6. Ključ upiši kao `GEMINI_API_KEY`.

Model je zadan varijablom `GEMINI_MODEL`, a ako je prazna, koristi se `gemini-3.1-flash-lite`. Tu je oznaku Googleova dokumentacija u listopadu 2026. navodila kao stabilnu. Popis modela: https://ai.google.dev/gemini-api/docs/models.

## 2. Upstash Redis

Na Vercelu svaki zahtjev može obraditi nova kopija funkcije, pa se razgovori i brojači poruka ne mogu čuvati u memoriji. Zato se čuvaju u Upstash Redisu. Besplatni paket ima 500 000 naredbi mjesečno, a to je za ovu stranicu dovoljno.

**Preko Vercela (preporučeno):**

1. U projektu na Vercelu otvori karticu **Storage** i dodaj **Upstash for Redis** s besplatnim planom.
2. Poveži bazu s projektom. Vercel sam dodaje varijable okruženja: `UPSTASH_REDIS_REST_URL` i `UPSTASH_REDIS_REST_TOKEN` ili `KV_REST_API_URL` i `KV_REST_API_TOKEN`. Kod radi s oba para imena.
3. Provjeri u **Settings → Environment Variables** da su varijable dodane.

**Izravno na Upstashu:** na https://console.upstash.com napravi Redis bazu, a u odjeljku **REST API** kopiraj `UPSTASH_REDIS_REST_URL` i `UPSTASH_REDIS_REST_TOKEN`.

Lokalno Upstash nije potreban. Bez njega se razgovori i ograničenja čuvaju u memoriji razvojnog poslužitelja i nestaju kad ga zaustaviš. U produkciji se memorija nikad ne koristi: ako Upstash nije postavljen, chat posjetitelju odgovara porukom s tvojim e-mailom, a u zapis upisuje što nedostaje.

## 3. IP_HASH_SALT i CRON_SECRET

Obje vrijednosti su dugi slučajni nizovi. Napravi svaku posebno ovom naredbom:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

- `IP_HASH_SALT`: posjetitelj se za ograničenja prepoznaje po hashu svoje IP adrese uz ovu sol. Puna IP adresa se nigdje ne sprema. Ako sol promijeniš, brojači kreću ispočetka.
- `CRON_SECRET`: kad je postavljen, Vercel ga šalje dnevnom poslu u zaglavlju `Authorization`. Bez njega posao odbija svaki poziv.

## 4. Cloudflare Turnstile

1. Prijavi se na https://dash.cloudflare.com (besplatan račun) i otvori **Turnstile**.
2. Dodaj widget (Add widget). Upiši ime i domenu stranice (npr. `dominik-marenic.vercel.app`) i odaberi način **Managed**.
3. Kopiraj **Site Key** u `NEXT_PUBLIC_TURNSTILE_SITE_KEY` i **Secret Key** u `TURNSTILE_SECRET_KEY`.

Skripta Turnstilea učitava se tek kad posjetitelj otvori chat, a token se provjerava na poslužitelju uz prvu poruku svakog razgovora. Ako su obje varijable prazne, provjera je isključena.

Za lokalno isprobavanje Cloudflare nudi testne ključeve (https://developers.cloudflare.com/turnstile/troubleshooting/testing/):

- ključ stranice `1x00000000000000000000AA` uvijek prolazi,
- tajni ključ `1x0000000000000000000000000000000AA` uvijek prolazi.

Testne ključeve koristi samo lokalno, nikad na Vercelu.

## 5. Gmail (slanje razgovora)

Vlastitu domenu nemaš, pa se e-mailovi šalju preko tvog Gmaila s lozinkom za aplikaciju. Resend bez potvrđene domene šalje samo na adresu vlastitog računa, a takvo slanje služi samo za testiranje.

1. Na Google računu uključi prijavu u dva koraka (2-Step Verification). Bez nje lozinka za aplikaciju nije dostupna.
2. Otvori https://myaccount.google.com/apppasswords i napravi lozinku za aplikaciju, npr. pod imenom "Portfolio chatbot". Google prikaže kod od 16 znakova.
3. Upiši:
   - `GMAIL_USER`: Gmail adresa s koje se šalje,
   - `GMAIL_APP_PASSWORD`: kod od 16 znakova (ne tvoja obična lozinka),
   - `CHAT_NOTIFY_EMAIL`: adresa na koju stižu razgovori (može biti ista).

Lozinka za aplikaciju prestaje vrijediti kad promijeniš lozinku Google računa. Tada napravi novu.

**Kako stižu razgovori:** kad posjetitelj zatvori prozor, započne novi razgovor ili napusti stranicu, preglednik poslužitelju javi samo oznaku razgovora. Poslužitelj zatim pročita razgovor iz svoje pohrane i pošalje ti e-mail s naslovom „Novi razgovor s Dominik AI”. Svaka poruka šalje se samo jednom. Dnevni posao (`vercel.json`, svaki dan oko 6:00 UTC) šalje razgovore za koje preglednik nije stigao javiti. Vercelov besplatni plan dopušta posao najviše jednom dnevno, a vrijeme pokretanja može odstupati do 59 minuta.

## 6. Lokalno isprobavanje

1. Kopiraj predložak:

   ```bash
   cp .env.example .env.local
   ```

2. U `.env.local` upiši barem `GEMINI_API_KEY`. Ostalo može ostati prazno:
   - bez Upstasha razgovori i ograničenja ostaju u memoriji,
   - bez Gmaila e-mail se ispisuje u terminal u kojem radi `npm run dev`,
   - bez Turnstile ključeva provjera je isključena.
3. Pokreni stranicu:

   ```bash
   npm run dev
   ```

4. Otvori http://localhost:3000, pomakni stranicu ispod naslovnog dijela i klikni okrugli gumb DM u donjem desnom kutu.

Nakon izmjene `.env.local` ponovno pokreni `npm run dev`.

Testovi (provjera ulaza, ograničenja, skriveno polje, provjera izvora, Turnstile i e-mail, s lažnim Geminijem) ne trebaju nijedan ključ:

```bash
npm test
```

## 7. Vercel

1. U projektu otvori **Settings → Environment Variables**.
2. Dodaj sve varijable iz tablice na vrhu, za okruženje **Production** (i **Preview**, ako želiš chat i na probnim adresama).
3. Ponovno objavi stranicu (**Deployments → Redeploy**). Varijable vrijede tek za nova izdanja.

Napomene:

- `CHAT_ENABLED=false` odmah isključuje rutu `/api/chat`, a gumb nestaje nakon sljedeće objave, jer se stranice grade unaprijed.
- Chat prihvaća zahtjeve samo sa stranice: s adrese iz `siteUrl` u `src/content/site.ts` i s adresa koje Vercel daje izdanju. Ako dodaš vlastitu domenu, dodaj je i u `CHAT_ALLOWED_ORIGINS` ili promijeni `siteUrl`.
- Dnevni posao iz `vercel.json` Vercel prepozna sam pri objavi. Vidi se pod **Settings → Cron Jobs**.
- Zapisi (Logs) nikad ne sadrže ključeve ni IP adrese. Greške Geminija, Upstasha i Gmaila vide se ondje s oznakom `[chat]`.

## 8. Dodatno znanje

Asistent zna ono što piše na stranici, jer se njegovo znanje gradi iz `src/content/site.ts`. Ako želiš da zna još nešto, upiši to u `src/content/chatbot/dodatno.md` (upute su u samoj datoteci) i ponovno objavi stranicu.

## 9. Avatar

Asistent zasad koristi monogram DM. Kad spremiš crtanu sliku kao `public/chatbot/avatar.png` (ili `.webp` ili `.svg`), ona se automatski koristi od sljedeće objave. Najbolja je kvadratna slika od barem 192 × 192 piksela.
