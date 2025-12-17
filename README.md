# wanderly

## Description
Wanderly is a travel planning web app that generates trip itineraries and destination guides using Google Gemini, stores data in Firebase, and renders a responsive UI with Tailwind CSS. The app supports images for destinations/attractions and uses caching and streaming for better performance.

## Technologies & Tools
- Frontend: Next.js, React, TypeScript  
- Styling & UI: Tailwind CSS, Lucide React (icons), clsx  
- AI / Generative: Google Gemini (via @google/genai / @google/generative-ai)  
- Backend / Data: Firebase (Firestore, Auth, Storage)  
- State & Forms: zustand, react-hook-form  
- Utilities: date-fns, dotenv  
- Images (optional): Unsplash API or Google Places API  
- Dev & Build: Node.js, npm, ESLint, PostCSS / Tailwind PostCSS plugin

## Project layout
- wanderly/ — Next.js app (run commands from this folder)
  - components/  — React components
  - lib/         — utilities (Firebase, Gemini helpers)
  - pages/       — Next.js pages
  - public/      — static assets
  - package.json — project scripts & dependencies