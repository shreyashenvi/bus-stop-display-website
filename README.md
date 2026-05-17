# 🚌 Smart Bus Tracking & Passenger Information System
### RNSIT Engineering Project Expo · RR Nagar, Bengaluru

> A full-stack-styled frontend prototype simulating real-time BMTC bus GPS tracking,  
> smart bus stop display boards, and AI-powered delay prediction for RR Nagar.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🗺️ **Live GPS Map** | Leaflet.js map centred on RNSIT, animated bus markers moving along real routes |
| 📺 **Smart Stop Display** | LED-style electronic bus arrival board, updates every 5s |
| 🤖 **AI Prediction** | Simulated ML model predicting delays based on traffic/crowd/weather |
| 📺 **Expo Mode** | Fullscreen projector-ready display for demo presentations |
| 🌙 **Dark/Light Toggle** | Full theme switching |
| ⚠️ **Alert Banner** | Rotating emergency and info alerts |
| 📱 **Responsive** | Works on mobile, tablet, and desktop |
| ⚡ **Loading Screen** | Animated splash screen with boot sequence |

---

## 🗂️ Folder Structure

```
smart-bus-tracker/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          ← Top nav with clock & dark mode
│   │   ├── HeroSection.jsx     ← Landing with particle animation
│   │   ├── AlertBanner.jsx     ← Rotating alert strip
│   │   ├── LiveMap.jsx         ← Leaflet map + GPS simulation
│   │   ├── BusDisplayPanel.jsx ← LED bus stop display board
│   │   ├── AIPredictionPanel.jsx ← AI analytics dashboard
│   │   ├── ExpoMode.jsx        ← Fullscreen projector display
│   │   ├── LoadingScreen.jsx   ← Boot animation
│   │   └── Footer.jsx          ← Credits & tech stack
│   ├── data/
│   │   └── busData.js          ← All simulated BMTC bus data
│   ├── App.jsx                 ← Root component
│   ├── main.jsx                ← React entry point
│   └── index.css               ← Tailwind + custom styles
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

---

## 🚀 Installation & Running Locally

### Prerequisites
- Node.js v18+ ([download](https://nodejs.org))
- npm v9+ (comes with Node)

### Steps

```bash
# 1. Navigate into the project folder
cd smart-bus-tracker

# 2. Install all dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open in browser
# → http://localhost:5173
```

---

## 🏗️ Build for Production

```bash
# Create optimised production build
npm run build

# Preview the production build locally
npm run preview
```

The built files will be in the `dist/` folder.

---

## 🌐 Deploying to GitHub Pages

```bash
# 1. Install gh-pages package
npm install --save-dev gh-pages

# 2. Add to package.json "scripts":
#    "deploy": "gh-pages -d dist"
# 3. Also add: "homepage": "https://YOUR_USERNAME.github.io/smart-bus-tracker"

# 4. Build and deploy
npm run build
npm run deploy
```

---

## ▲ Deploying to Vercel (Recommended — Easiest)

### Option A: Vercel CLI
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy (run from project root)
vercel

# 3. Follow the prompts — it auto-detects Vite!
# Your live URL will be shown at the end.
```

### Option B: Vercel Dashboard (No CLI needed)
1. Push your project to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your GitHub repo
4. Framework preset: **Vite** (auto-detected)
5. Click **Deploy** — done in ~30 seconds! ✅

---

## 🔧 Customisation

### Add more buses
Edit `src/data/busData.js` → `BUSES` array:
```js
{
  id: 'b6',
  number: '500C',
  name: 'RR Nagar – Electronic City',
  color: '#ec4899',
  route: ['rrnagar', 'banashank', 'jayanagar'],
  status: 'On Time',
  ...
}
```

### Add more stops
Edit `BUS_STOPS` in `busData.js`:
```js
{ id: 'mysite', name: 'My New Stop', lat: 12.92, lng: 77.51, isMain: false }
```

### Change map centre
In `LiveMap.jsx`, find:
```js
center: [12.9240, 77.5149],  // ← change these coordinates
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI components and state management |
| **Vite** | Fast build tool and dev server |
| **Tailwind CSS** | Utility-first styling |
| **Leaflet.js** | Interactive maps |
| **JavaScript ES6+** | Simulation logic, timers, animations |

---

## 📝 Notes

- This is a **simulation prototype** — no real GPS or backend required
- All bus positions are mathematically interpolated between real coordinates
- BMTC bus numbers and routes are realistic but data is not live
- Built specifically for RNSIT Engineering Expo presentation

---

## 👨‍💻 Credits

Built for **RNSIT Engineering Project Expo**  
Department of Computer Science / Information Science  
RNS Institute of Technology, RR Nagar, Bengaluru – 560098

---

*"Smart cities begin with smart transit."*
