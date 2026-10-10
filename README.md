# Vinayak Tripathy — Animated Portfolio 🚀

Animated personal portfolio of **Vinayak Tripathy**, a Computer Science and Engineering
student working on software development and applied AI. Built with React, TypeScript,
GSAP and Three.js, it features an animated 3D character, WebGL visuals, scroll-triggered
transitions and a physics-based tech stack.

## ✨ Features

- 3D animated character (Three.js, encrypted GLTF model, DRACO compression)
- Physics tech-stack playground (React Three Fiber + Rapier)
- GSAP scroll-triggered text reveal and section transitions
- Custom cursor, loading screen and marquee effects
- Sections for about, skills, education, internships, certifications, projects and contact
- Responsive layout that keeps the character composition on desktop and mobile

## 🛠️ Tech Stack

React • TypeScript • Vite • GSAP • Three.js • React Three Fiber • Rapier • WebGL • CSS

## 📂 Project Structure

```
src/
├── components/          # Page sections (Landing, About, WhatIDo, Education, Career,
│                        # Training, Work, TechStack, Contact, Navbar, …)
│   └── Character/       # Three.js character scene, model loading and animation utils
├── context/             # Loading state provider
└── data/                # Bone groups used to filter the character animations
public/
├── images/              # Profile, project and tech-stack artwork
└── models/              # Encrypted character model + environment map
```

## 🚀 Getting Started

```bash
npm install
npm run dev      # local dev server
npm run build    # production build
npm run lint     # eslint
npm run preview  # preview production build
```

## 🔗 Links

- Portfolio: https://animated-personal-portfolio-smoky.vercel.app/
- GitHub: https://github.com/akon2005
- LinkedIn: https://www.linkedin.com/in/vinayaktripathy

## 📄 License

MIT — see [LICENSE](LICENSE).

---

*Design inspired by [Moncy Yohannan](https://www.moncy.dev)'s open-source portfolio template, heavily customized for personal use.*
