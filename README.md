# Triviador-AI

![Triviador-AI Banner](./public/banner.png) <!-- dacă ai o imagine -->

---

## Descriere

**Triviador-AI** este un joc trivia multiplayer bazat pe hărți de teritorii, unde jucătorii se luptă să cucerească teritorii prin răspunsuri corecte la întrebări generate AI. Jocul integrează API-ul Google Gemini pentru generarea dinamică a întrebărilor, oferind un gameplay interactiv și educativ.

---

## Funcționalități principale

- **Multiplayer turn-based** pe o hartă cu teritorii adiacente.
- Alegerea teritoriilor inițiale și cucerirea lor prin întrebări trivia.
- Alegerea dificultății întrebărilor la începutul jocului (`easy`, `medium`, `hard`).
- La cucerirea teritoriilor adversarului, dificultatea întrebărilor crește temporar.
- Jucătorul adversar alege topicul întrebării atunci când teritoriul atacat este ocupat.
- Interfață modernă cu evidențiere clară a teritoriilor și stării jocului.
- Detectare automată a câștigătorului când un jucător rămâne fără teritorii.

---

## Tehnologii folosite

- **Next.js** (React framework) pentru frontend și API backend.
- **TypeScript** pentru un cod sigur și scalabil.
- **Google Gemini API** pentru generarea dinamică a întrebărilor trivia.
- **Tailwind CSS** pentru styling rapid și responsive.
- **React hooks** pentru gestionarea stării și efectelor.

---

## Cum rulezi proiectul local

1. Clonează repo-ul:

```bash
git clone https://github.com/username/triviador-ai.git
cd triviador-ai
Instalează dependențele:

bash
Copy
npm install
Configurează cheia API Gemini în fișierul .env.local:

env
Copy
GEMINI_API_KEY=cheia_ta_google_gemini
Rulează aplicația în mod dezvoltare:

bash
Copy
npm run dev
Deschide browserul la adresa:

bash
Copy
http://localhost:3000/game
