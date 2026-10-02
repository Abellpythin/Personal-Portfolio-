// ---------------------------------------------------------------------------
// bookshelf.js — builds a row of clickable "books" (one per project) and
// handles the pull-out animation when a book is clicked.
// ---------------------------------------------------------------------------
import * as THREE from "three";
import { tween } from "../animations/flyTo.js";

const BOOK_COLORS = [0x8a3b3b, 0x3b5f8a, 0x3b8a5f, 0x8a7a3b, 0x6a3b8a];

/**
 * @param {{id:string,title:string,description:string,link:string}[]} items
 * @param {[number,number,number]} origin
 * @param {number} spacing
 * @returns {THREE.Group} group containing all book meshes, each tagged interactive
 */
export function createBookshelfBooks(items, origin, spacing) {
  const group = new THREE.Group();
  const [ox, oy, oz] = origin;

  items.forEach((item, i) => {
    const geo = new THREE.BoxGeometry(0.12, 0.32, 0.28);
    const mat = new THREE.MeshStandardMaterial({
      color: BOOK_COLORS[i % BOOK_COLORS.length],
      roughness: 0.7,
    });
    const book = new THREE.Mesh(geo, mat);
    book.position.set(ox + i * spacing, oy, oz);
    book.userData = {
      interactive: true,
      type: "book",
      label: item.title,
      payload: item,
      restZ: oz,
    };
    group.add(book);
  });

  return group;
}

/**
 * Slide a book forward on Z (pull it out of the shelf), or back in.
 */
export function pullOutBook(book, out = true) {
  const restZ = book.userData.restZ ?? book.position.z;
  const targetZ = out ? restZ + 0.35 : restZ;
  tween(book.position, { z: targetZ }, 400);
}
