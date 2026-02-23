# 🗺️ TravelBuddy: Interactive DIY Spatial Map

![Vue.js](https://img.shields.io/badge/Vue.js-3.X-4FC08D?style=flat&logo=vuedotjs&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?style=flat&logo=leaflet&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.X-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

TravelBuddy is an interactive, UGC-driven spatial mapping tool. It goes beyond traditional text-based travel notes by allowing users to create, edit, and share personalized micro-maps (e.g., Campus tours, hidden food trails) with full data ownership.
![demo-封面](https://github.com/user-attachments/assets/90dbbdd0-0114-43e0-8a3c-90d7e23e8e86)
This is the video link
https://github.com/user-attachments/assets/842f2e82-ba63-4663-8bf9-2a0d2db0eb8f
And you can also try it online by the under link
https://diy-travelbuddy-map.vercel.app/
## ✨ Key Features

* **🖱️ Drag & Drop Spatial Editing**: Right-click to clone markers, drag them to new locations, and seamlessly update their data in real-time.
* **💾 Full Data Ownership (Import/Export)**: Completely local-first architecture. Export your personalized map as a lightweight JSON file and share it with friends, or import a map to instantly recreate a journey.
* **⚡ Zero-Drift Rendering Engine**: Built with a custom instance-caching mechanism to ensure 100% stable marker rendering during extreme zooming and filtering.
* **🛡️ Defensive UX Design**: Integrated safeguards against event bubbling, false clicks during map panning, and intelligent URL formatting for image inputs.

## 🛠️ Technical Highlights (For Developers)
During development, several deep architectural challenges were solved:
1.  **Vue 3 Proxy vs Leaflet Collision**: Bypassed Vue's reactivity proxy on Leaflet instances using `shallowRef/markRaw` to prevent CSS transform drift during map zooms.
2.  **DOM Teleportation for Event Freedom**: Escaped Leaflet's aggressive event hijacking (which blocks `Ctrl+V` and right-click menus) by using Vue 3 `<Teleport>` to mount the Editor Modal directly to the `<body>`.
3.  **Instance Caching (Mount/Unmount)**: Replaced destructive `clearLayers()` with an intelligent diffing and caching system, ensuring markers retain their physical anchor points when toggling categories.

## 🚀 How to Run Locally

1. Clone the repository:
   ```bash
   git clone [https://github.com/dong-runze/DIY-travelbuddy-map.git](https://github.com/dong-runze/DIY-travelbuddy-map.git)
2. Install dependencies (No need to download heavy node_modules directly!):
   ```bash
   npm install
3. Run the development server:
   ```bash
   npm run dev
4. Try the Demo: Click "Import" in the app and select the 🚀 my-ntu-map.json 🚀file included in this repo to see a working example of Nanyang Technological University!
<img width="2146" height="144" alt="屏幕截图 2026-02-23 191313" src="https://github.com/user-attachments/assets/52584686-bf83-4a39-a0b2-884ce5c74baa" />

