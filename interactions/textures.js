// ---------------------------------------------------------------------------
// textures.js — builds wall-mounted "frame" meshes.
//  - createTexturedFrame(): loads an image (degree.jpg, awards.jpg, ...) onto
//    the frame face. Falls back to a generated placeholder canvas texture if
//    the image is missing, so the scene never shows a broken/blank frame.
//  - createIconFrame(): draws an icon + label onto a canvas texture, used for
//    the Resume / LinkedIn / GitHub / Website profile frames.
// ---------------------------------------------------------------------------
import * as THREE from "three";

const textureLoader = new THREE.TextureLoader();

function placeholderTexture(label) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 384;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#22273a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#5b8cff";
  ctx.lineWidth = 6;
  ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
  ctx.fillStyle = "#c6cddc";
  ctx.font = "bold 28px Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  wrapText(ctx, label, canvas.width / 2, canvas.height / 2, canvas.width - 80, 34);
  return new THREE.CanvasTexture(canvas);
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  const lines = [];
  for (const word of words) {
    const test = line + word + " ";
    if (ctx.measureText(test).width > maxWidth && line !== "") {
      lines.push(line);
      line = word + " ";
    } else {
      line = test;
    }
  }
  lines.push(line);
  const startY = y - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((l, i) => ctx.fillText(l.trim(), x, startY + i * lineHeight));
}

function iconTexture(icon, label) {
  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 400;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#181c28";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#7ee7d1";
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);
  ctx.font = "160px Segoe UI Emoji, Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(icon, canvas.width / 2, canvas.height / 2 - 30);
  ctx.font = "bold 34px Segoe UI, sans-serif";
  ctx.fillStyle = "#eef1f7";
  ctx.fillText(label, canvas.width / 2, canvas.height - 55);
  return new THREE.CanvasTexture(canvas);
}

/**
 * A framed picture on the wall (Degree / Diploma / Research / Events / Honors / Leadership / Awards).
 * Tries to load `imagePath`; falls back to a labeled placeholder texture on error.
 */
export function createTexturedFrame({ imagePath, label, width = 0.9, height = 1.15 }) {
  const group = new THREE.Group();

  const frameGeo = new THREE.BoxGeometry(width + 0.08, height + 0.08, 0.05);
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x2b2418, roughness: 0.6 });
  const frameMesh = new THREE.Mesh(frameGeo, frameMat);
  group.add(frameMesh);

  const artGeo = new THREE.PlaneGeometry(width, height);
  const artMat = new THREE.MeshStandardMaterial({
    map: placeholderTexture(label),
    roughness: 0.9,
  });
  const artMesh = new THREE.Mesh(artGeo, artMat);
  artMesh.position.z = 0.03;
  group.add(artMesh);

  if (imagePath) {
    textureLoader.load(
      imagePath,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        artMat.map = tex;
        artMat.needsUpdate = true;
      },
      undefined,
      () => {
        console.warn(`[textures] "${imagePath}" not found — showing placeholder for "${label}".`);
      }
    );
  }

  return group;
}

/**
 * A small icon frame used for the profile-links row (Resume / LinkedIn / GitHub / Website).
 */
export function createIconFrame({ icon, label, size = 0.55 }) {
  const group = new THREE.Group();

  const frameGeo = new THREE.BoxGeometry(size + 0.06, size + 0.06, 0.05);
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x1c2130, roughness: 0.5, metalness: 0.2 });
  group.add(new THREE.Mesh(frameGeo, frameMat));

  const faceGeo = new THREE.PlaneGeometry(size, size);
  const faceMat = new THREE.MeshStandardMaterial({ map: iconTexture(icon, label), roughness: 0.8 });
  const face = new THREE.Mesh(faceGeo, faceMat);
  face.position.z = 0.03;
  group.add(face);

  return group;
}
