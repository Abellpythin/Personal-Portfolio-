// ---------------------------------------------------------------------------
// modelConfig.js
// Central place to edit: GLB model paths, where furniture sits in the room,
// and how the bookshelf grid is laid out. Everything here is a PLACEHOLDER —
// swap paths/positions for your own assets and layout.
// ---------------------------------------------------------------------------

// Optional furniture models. If a file is missing, main.js silently falls
// back to a simple placeholder box, so the scene still works with zero assets.
export const MODEL_PLACEMENTS = [
  {
    id: "desk",
    url: "assets/models/desk.glb",
    position: [0, 0, -1.2],
    rotation: [0, 0, 0],
    scale: 1,
    fallbackSize: [1.6, 0.9, 0.8],
    fallbackColor: 0x6b4a34,
  },
  {
    id: "chair",
    url: "assets/models/chair.glb",
    position: [0, 0, -0.2],
    rotation: [0, Math.PI, 0],
    scale: 1,
    fallbackSize: [0.6, 0.9, 0.6],
    fallbackColor: 0x2e2e35,
  },
  {
    id: "bookshelf",
    url: "assets/models/bookshelf.glb",
    position: [-3.6, 0, -3.6],
    rotation: [0, Math.PI / 2, 0],
    scale: 1,
    fallbackSize: [1.8, 2.2, 0.4],
    fallbackColor: 0x4a3626,
  },
  {
    id: "trophy",
    url: "assets/models/trophy.glb",
    position: [3.5, 1.05, -3.75],
    rotation: [0, 0, 0],
    scale: 0.5,
    fallbackSize: [0.25, 0.4, 0.25],
    fallbackColor: 0xd4af37,
  },
];

// Bookshelf grid: each "book" represents a project. Click a book -> pulls
// out and opens the info modal. Edit freely.
export const BOOKSHELF_ITEMS = [
  { id: "book-project-1", title: "Project One", description: "Placeholder project description. Replace with real project details.", link: "#" },
  { id: "book-project-2", title: "Project Two", description: "Placeholder project description. Replace with real project details.", link: "#" },
  { id: "book-project-3", title: "Project Three", description: "Placeholder project description. Replace with real project details.", link: "#" },
  { id: "book-project-4", title: "Project Four", description: "Placeholder project description. Replace with real project details.", link: "#" },
  { id: "book-project-5", title: "Project Five", description: "Placeholder project description. Replace with real project details.", link: "#" },
];

export const BOOKSHELF_ORIGIN = [-3.6, 0.9, -3.55];
export const BOOKSHELF_SPACING = 0.16;
