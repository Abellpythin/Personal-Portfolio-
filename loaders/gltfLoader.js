// ---------------------------------------------------------------------------
// gltfLoader.js — GLTF + Draco loader with per-model progress reporting.
// If a model file is missing/404s, the returned promise resolves to `null`
// instead of rejecting, so the rest of the scene keeps loading.
// ---------------------------------------------------------------------------
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

/**
 * Load a single GLB with progress callback.
 * @param {string} url
 * @param {(fraction:number)=>void} onProgress fraction 0..1 for THIS file
 * @returns {Promise<import('three').Group|null>}
 */
export function loadModel(url, onProgress = () => {}) {
  return new Promise((resolve) => {
    gltfLoader.load(
      url,
      (gltf) => {
        onProgress(1);
        resolve(gltf.scene);
      },
      (xhr) => {
        if (xhr.total) onProgress(xhr.loaded / xhr.total);
      },
      (err) => {
        console.warn(`[gltfLoader] Could not load "${url}" — using fallback box. (${err?.message || err})`);
        onProgress(1);
        resolve(null);
      }
    );
  });
}

/**
 * Load many models, reporting aggregate progress across all of them.
 * @param {{id:string,url:string}[]} entries
 * @param {(overallFraction:number, label:string)=>void} onOverallProgress
 * @returns {Promise<Record<string, import('three').Group|null>>}
 */
export async function loadModels(entries, onOverallProgress = () => {}) {
  const results = {};
  const perFile = new Array(entries.length).fill(0);

  const report = () => {
    const total = perFile.reduce((a, b) => a + b, 0) / entries.length;
    onOverallProgress(total);
  };

  await Promise.all(
    entries.map(
      (entry, i) =>
        new Promise((res) => {
          loadModel(entry.url, (f) => {
            perFile[i] = f;
            report();
          }).then((scene) => {
            results[entry.id] = scene;
            res();
          });
        })
    )
  );

  return results;
}
