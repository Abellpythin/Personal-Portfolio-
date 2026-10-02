// ---------------------------------------------------------------------------
// dayNight.js — animated toggle between a bright "day" lighting rig and a
// moody "night" rig. Edit the DAY / NIGHT objects to change the palette.
// ---------------------------------------------------------------------------
import * as THREE from "three";
import { tween } from "../animations/flyTo.js";

export const DAY = {
  background: new THREE.Color(0xcfe3f7),
  ambientIntensity: 0.9,
  ambientColor: new THREE.Color(0xffffff),
  dirIntensity: 1.1,
  dirColor: new THREE.Color(0xffffff),
  fillIntensity: 0.4,
};

export const NIGHT = {
  background: new THREE.Color(0x05060b),
  ambientIntensity: 0.18,
  ambientColor: new THREE.Color(0x5a6cff),
  dirIntensity: 0.25,
  dirColor: new THREE.Color(0x8ea2ff),
  fillIntensity: 0.9,
};

/**
 * @param {THREE.Scene} scene
 * @param {THREE.AmbientLight} ambientLight
 * @param {THREE.DirectionalLight} dirLight
 * @param {THREE.PointLight} fillLight  (e.g. a warm desk lamp used to sell "night")
 */
export function createDayNightController(scene, ambientLight, dirLight, fillLight) {
  let isNight = false;

  function apply(state, duration = 1200) {
    const startColor = scene.background.clone();
    const targetColor = state.background;
    const start = performance.now();
    function step(now) {
      const t = Math.min(1, (now - start) / duration);
      scene.background.copy(startColor).lerp(targetColor, t);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);

    tween(ambientLight, { intensity: state.ambientIntensity }, duration);
    tween(dirLight, { intensity: state.dirIntensity }, duration);
    if (fillLight) tween(fillLight, { intensity: state.fillIntensity }, duration);

    ambientLight.color.copy(state.ambientColor);
    dirLight.color.copy(state.dirColor);
  }

  apply(DAY, 0);

  return {
    toggle() {
      isNight = !isNight;
      apply(isNight ? NIGHT : DAY);
      return isNight;
    },
    get isNight() {
      return isNight;
    },
  };
}
