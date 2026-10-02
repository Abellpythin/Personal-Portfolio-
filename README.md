# 3D Office Portfolio

An interactive 3D portfolio rendered as a professional office room. Every wall frame, trophy, and book is clickable and reveals content — your resume, degree, GitHub, awards, and projects.

Built with **Three.js** (loaded via CDN import map). No build step required.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🖼️ **Clickable wall decor** | Frames for Resume, LinkedIn, GitHub, Website, Degree, Diploma, Research, Events, Honors, Leadership, Awards |
| 🎥 **Camera fly-to animation** | Clicking any object smoothly animates the camera to focus on it |
| 📚 **Interactive bookshelf** | Each book on the shelf is a project; click one to see details |
| 📖 **Book pull-out animation** | Selected books slide forward on the Z axis with easing |
| 🖼️ **Real image textures** | Degree scans, award certificates, etc. render on 3D frames (falls back to a placeholder graphic if the image file isn't there yet) |
| 🔊 **Hover & click sounds** | Subtle UI audio feedback (mutable) |
| 📊 **Per-model preloader** | Real progress bar showing each GLTF file's loading state |
| 🌙 **Day/Night toggle** | Smooth animated transition between bright day and moody night lighting |
| 🗜️ **Draco compression** | Optimized .glb loading via Google's Draco decoder |

**No 3D models or images yet?** The site still works out of the box — furniture falls back to simple boxes and frames show a generated placeholder graphic until you add your own assets.

---

## 🚀 Quick Start (VS Code)

### 1. Prerequisites
- **VS Code**
- **Live Server** extension (install from the Extensions panel — search "Live Server" by Ritwick Dey)
- A modern browser (Chrome / Edge / Firefox)

### 2. Open the project
Open the `3d-office-portfolio` folder in VS Code (`File > Open Folder…`).

### 3. Run it
1. Right-click `index.html` in the file explorer
2. Select **"Open with Live Server"**
3. Your browser opens at `http://127.0.0.1:5500` and the scene loads

> Opening `index.html` directly with `file://` will NOT work — the ES module imports and texture loading require a real HTTP server. Always use Live Server (or `npx serve`, `python -m http.server`, etc).

---

## ✏️ Add Your Real Content

Everything personal is a clearly marked placeholder. Nothing is auto-filled — search for `TODO:` in `main.js` to find every spot to edit:

1. **Profile links** — edit the `PROFILE_LINKS` array in `main.js`:
   - `resume` → point `href` at your resume file in `assets/documents/`
   - `linkedin`, `github`, `website` → put your real URLs
2. **Degree / Diploma / Research / Events / Honors / Leadership / Awards** — edit the `DISPLAY_FRAMES` array in `main.js`:
   - `image` → path to a real image in `assets/textures/` (e.g. `degree.jpg`)
   - `bodyHtml` → the text shown in the modal when that frame is clicked
3. **Bookshelf projects** — edit `BOOKSHELF_ITEMS` in `loaders/modelConfig.js`.
4. **(Optional) 3D furniture models** — drop `.glb` files into `assets/models/` matching the paths in `loaders/modelConfig.js` (`desk.glb`, `chair.glb`, `bookshelf.glb`, `trophy.glb`). Free sources: [Poly Pizza](https://poly.pizza), [Sketchfab](https://sketchfab.com) (CC-licensed), [Kenney](https://kenney.nl).
5. **(Optional) UI sounds** — add `hover.mp3` and `click.mp3` to `assets/audio/`. Free sources: [freesound.org](https://freesound.org), [mixkit.co](https://mixkit.co/free-sound-effects/click/).

---

## 🎮 Controls

| Action | Result |
|---|---|
| **Drag mouse** | Orbit camera |
| **Scroll wheel** | Zoom in/out |
| **Hover over object** | Tooltip + hover sound + cursor change |
| **Click object** | Camera flies in, info panel opens, click sound |
| **🌙 / ☀️ button (top right)** | Toggle day/night mode |
| **🔊 / 🔇 button (top right)** | Mute / unmute sounds |
| **⤾ button (top right)** | Reset camera to the default room view |

---

## 📁 File Reference

| File | Purpose |
|---|---|
| `index.html` | Page shell + import map (CDN Three.js, no build step) |
| `style.css` | UI styling (preloader, HUD, tooltip, modal) |
| `main.js` | Scene assembly, lighting, wall-frame layout, bootstrap — **edit this for your content** |
| `loaders/gltfLoader.js` | GLTF + Draco loader with per-file progress, graceful fallback on missing files |
| `loaders/modelConfig.js` | Model paths, furniture placement, bookshelf project list |
| `interactions/cameraFocus.js` | Fly-to and reset-view helpers |
| `interactions/raycaster.js` | Hover/click detection with sound + tooltip hooks |
| `interactions/bookshelf.js` | Book meshes + pull-out animation |
| `interactions/textures.js` | Wall frame builders (icon frames + image frames with placeholder fallback) |
| `interactions/dayNight.js` | Animated lighting/background toggle |
| `animations/flyTo.js` | Dependency-free tween engine used everywhere above |
| `audio/soundManager.js` | Audio pool with mute, fails silently if files are missing |

---

## 🗜️ Draco Compression (optional, for large `.glb` files)

```bash
npm install -g @gltf-transform/cli
gltf-transform optimize input.glb output.glb --compress draco --texture-compress webp
```

The code already points `DRACOLoader` at Google's CDN decoder, so any Draco-compressed `.glb` decodes automatically — no extra setup needed.

---

## 🐛 Troubleshooting

| Problem | Fix |
|---|---|
| Blank page / import errors | Make sure you're using Live Server, not opening the file directly (`file://`) |
| Models don't load | Check paths in `loaders/modelConfig.js` and the browser console — missing models fall back to boxes automatically, this is expected until you add real `.glb` files |
| Sounds don't play | Browsers block audio until the first user interaction — move the mouse/click once first |
| Frame shows placeholder graphic instead of your image | Confirm the image path in `DISPLAY_FRAMES` (`main.js`) matches a real file under `assets/textures/` |
| Black screen | Check WebGL support in your browser; try Chrome |

---

## 📜 License

Free to use for your own personal portfolio.

## 🙏 Credits

- **Three.js** — https://threejs.org
- **Draco** — Google
- Model sources: Poly Pizza, Sketchfab, Kenney
