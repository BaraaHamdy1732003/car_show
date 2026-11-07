# ELITE AUTO — Interactive Luxury Car Showroom

> **Explore the Art of Automotive Engineering.**

ELITE AUTO is a premium, cinematic automotive showroom for the browser. Visitors walk into a virtual international car exhibition, browse 32 iconic vehicles from 20 marques, and inspect them in real-time 3D. The whole experience runs on the frontend: no backend, no database, no login.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Data](#data)
- [Design System](#design-system)
- [Customization](#customization)
- [Browser Support](#browser-support)
- [Author](#author)

---

## Features

**Showroom experience**
- Full-screen cinematic hero with an animated supercar that drives in when the site loads
- Virtual **Exhibition Hall** view for walking through the collection
- Featured "Podium" vehicle with a one-click launch into the 3D explorer
- Ambient lighting effects, smooth transitions and a dark, racing-inspired atmosphere

**Discovery**
- **Collection** view with all vehicles
- **Brands** view covering 20 manufacturers
- **Categories** view with 12 vehicle classifications (supercars, hypercars, sports cars, luxury sedans and SUVs, electric vehicles, muscle cars, classics, racing cars, off-road vehicles, grand tourers, concept cars)
- **Instant search** modal with live filtering

**Inspection**
- **Interactive 3D Car Explorer** built with Three.js
- Detailed vehicle specification modal (engine, performance, dimensions, design and equipment)
- **Engine rev** experience with synthesized sound

**Personalization**
- **Compare** vehicles side by side in a modal
- **Favorites** saved in the browser with `localStorage`, no account needed

**General**
- Responsive layout for desktop, tablet and mobile
- Sound effects generated in the browser with the Web Audio API
- No backend, database, authentication or payments

---

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | [React 19](https://react.dev/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Build tool | [Vite 7](https://vitejs.dev/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| 3D | [Three.js](https://threejs.org/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Utilities | `clsx`, `tailwind-merge` |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- npm (included with Node.js)

### Installation

Open a terminal in the project folder and run:

```bash
npm install
```

### Run in development

```bash
npm run dev
```

Vite prints a local address, usually `http://localhost:5173`. Open it in your browser.

### Build for production

```bash
npm run build
```

The optimized site is written to the `dist/` folder. You can preview it locally with:

```bash
npm run preview
```

The `dist/` folder is static, so you can host it on any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages and similar).

---

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the development server with hot reload |
| `npm run build` | Creates an optimized production build in `dist/` |
| `npm run preview` | Serves the production build locally |

---

## Project Structure

```text
.
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── public/
│   └── images/
│       ├── exhibition-hall-main.jpg
│       ├── red-ferrari-podium.jpg
│       ├── supercar-engine.jpg
│       ├── supercar-interior.jpg
│       └── yellow-testarossa-showroom.jpg
└── src/
    ├── App.tsx                  # App shell, view routing and global state
    ├── main.tsx                 # Entry point
    ├── index.css                # Tailwind import, theme styles and animations
    ├── components/
    │   ├── Navbar.tsx
    │   ├── HeroSection.tsx
    │   ├── HeroCar.tsx          # Animated drive-in car for the hero
    │   ├── ExhibitionHall.tsx
    │   ├── CollectionView.tsx
    │   ├── BrandsView.tsx
    │   ├── CategoriesView.tsx
    │   ├── CarCard.tsx
    │   ├── CarDetailsModal.tsx
    │   ├── CarExplorer3D.tsx    # Three.js 3D explorer
    │   ├── EngineRevModal.tsx
    │   ├── CompareModal.tsx
    │   ├── FavoritesView.tsx
    │   ├── SearchModal.tsx
    │   └── Footer.tsx
    ├── data/
    │   ├── cars.ts              # Vehicle database
    │   ├── brands.ts            # Manufacturer data
    │   └── categories.ts        # Category definitions
    ├── types/
    │   └── car.ts               # TypeScript interfaces
    └── utils/
        ├── audio.ts             # Web Audio sound engine
        └── cn.ts                # Class name helper
```

---

## Data

All content is stored locally in `src/data/` as typed TypeScript objects, so the site works with no network requests for data.

- `cars.ts` holds the vehicle collection and their specifications
- `brands.ts` holds the manufacturers
- `categories.ts` holds the classifications

Vehicle specifications are provided for showcase purposes. Figures such as power, top speed, acceleration and price can differ by market, model year and trim, so treat them as approximate unless confirmed with the manufacturer.

### Adding a vehicle

1. Open `src/data/cars.ts`.
2. Add a new object that follows the `Car` interface in `src/types/car.ts`.
3. Make sure its manufacturer exists in `brands.ts` and its category exists in `categories.ts`.
4. Put any new images in `public/images/` and reference them by path, for example `/images/my-car.jpg`.

---

## Design System

| Token | Value | Usage |
| --- | --- | --- |
| Deep black | `#080808` | Page background |
| Dark charcoal | `#151515` | Panels and cards |
| Racing red | `#D50000` | Primary accent and buttons |
| Bright red | `#FF2020` | Highlights and glow |
| Luxury yellow | `#FFD600` | Interactive emphasis |
| White | `#FFFFFF` | Primary text |
| Secondary text | `#A0A0A0` | Supporting text |

Typography uses **Rajdhani** for headings, **Outfit** for body text and **JetBrains Mono** for technical labels. Make sure these fonts are loaded in `index.html`.

---

## Customization

- **Hero car animation:** edit `src/components/HeroCar.tsx` for the artwork and the `.hero-car-*` rules in `src/index.css` for timing and effects.
- **Hero background:** replace `public/images/exhibition-hall-main.jpg` with your own image.
- **Colors and glow effects:** adjust the utility classes in `src/index.css` and the color values used in the components.
- **Reduced motion:** the hero car animation is disabled automatically for visitors who prefer reduced motion.

---

## Browser Support

Works in current versions of Chrome, Edge, Firefox and Safari on desktop and mobile. The 3D explorer needs a browser with WebGL support.

---

## Author

**Baraa Hamdy (Bebo)** — Developer working across mobile, ML/AI, robotics/IoT and web.

---

## Notes on Assets

Vehicle names, manufacturer names and logos belong to their respective owners. This project is an educational and portfolio showcase and is not affiliated with or endorsed by any automotive manufacturer. Make sure you have the rights to any photos you use in `public/images/` before publishing the site.
