# ✦ A Little Universe for Sid
### An Interactive, Cinematic, Animated Best-Friend Apology Website

A custom-crafted, story-driven digital experience built with React, TypeScript, Vite, Framer Motion, and Web Audio API. Designed specifically for Sid to acknowledge real mistakes, show sincere reflection, bring a gentle smile, and end with warmth and total respect for her space.

---

## ✨ Features & Architecture

1. **Scene 0: The Opening** — Animated character on a floating island tripping with a letter, atmospheric starry sky, and gentle introductory humor.
2. **Scene 1: The Friendship Maintenance Department** — Retro-futuristic cloud office with typewriter case file terminal, real-time stamps, and accountability records.
3. **Scene 2: The Apology Letter** — Interactive wax-sealed envelope that unfolds with paper rustle sound, readable typography, and the sincere core letter.
4. **Scene 3: The Three Floating Islands** — 
   - *Island 1: The Clock That Kept Ticking* (Acknowledging delay)
   - *Island 2: The Fog of Assumptions* (Clearing misunderstandings)
   - *Island 3: The Bridge I Almost Left Behind* (Rebuilding plank by plank)
5. **Scene 4: The Museum of Unfortunate Communication Moments** — Interactive exhibits detailing missed cues, pride moments, and the Best-Friend Appreciation Trophy.
6. **Scene 5: The Friendship Constellation** — Interactive interactive night sky where clicking each star reveals a core lesson learned.
7. **Scene 6: Mini-Game: "Operation Un-Idiot"** — Playable character walking across an interactive floating world to collect accountability items (Listening Ears, Punctual Compass, Humility Potion, Unconditional Friendship Charm) and resolving obstacles.
8. **Scene 7: The Sunrise Promise** — Cinematic gradient shift from night to dawn with the final sincere message and a paper airplane taking flight.
9. **Scene 8: The Final Choice** — Three zero-pressure buttons ("Okay, I read it", "I need some time", "Let's talk sometime") with kind, non-demanding responses, and replay/re-read options.

---

## 🥚 7 Hidden Easter Eggs

1. **The Moon** (Scene 0) — Click the moon in the opening scene.
2. **The Office Printer** (Scene 1) — Click the printer in the department.
3. **The Clock** (Scene 1) — Click the clock tower on the desk.
4. **The Ego Monster** (Scene 6) — Overcoming the ego obstacle in the mini-game.
5. **The Chai Cup** (Scene 0) — Click the chai cup on the intro island.
6. **The Trophy** (Scene 4) — Click the trophy exhibit in the museum.
7. **The Paper Airplane** (Scene 7 & 8) — Click the paper airplane flying into the sunrise.

---

## 🎨 How to Personalize

All texts, names, letter paragraphs, lessons, and choices can be customized in a single file:
👉 **`universe/src/config.ts`**

```ts
export const config = {
  recipient: {
    name: 'Sid',
    nickname: 'Sid',
  },
  meta: {
    siteTitle: 'A Little Universe for Sid',
  },
  letter: {
    paragraphs: [ ... ],
  },
  ...
}
```

---

## 🚀 How to Run Locally

### Option 1: Direct Static File (No build needed)
Double-click `index.html` in the root folder, or use any local web server (e.g., Live Server extension in VS Code).

### Option 2: Dev Server with Hot Reload
Run in the root directory:
```bash
npm run dev
```
Or inside `universe/`:
```bash
cd universe
npm run dev
```
Then open `http://localhost:5173/` in your browser.

### Building for Production
```bash
npm run build
```
This compiles the TypeScript files and updates the production bundle in the root directory.

---

## 🌐 Deploying Online (Free)

- **Vercel**: Import the GitHub repository, set Root Directory to `universe` (or root), and click Deploy.
- **Netlify**: Drag and drop the root folder directly into Netlify Drop, or connect Git with build command `npm run build` and publish directory `universe/dist`.
- **GitHub Pages**: Push the repository to GitHub, go to Repository Settings > Pages > Source > Deploy from Branch (`main` / root).
