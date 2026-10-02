// ---------------------------------------------------------------------------
// cameraFocus.js — fly-to and reset-view helpers for the camera + controls.
// ---------------------------------------------------------------------------
import * as THREE from "three";
import { tweenVector3Live } from "../animations/flyTo.js";

// Edit this to change the default / "home" camera view.
export const DEFAULT_VIEW = {
  position: new THREE.Vector3(0, 1.6, 4.2),
  target: new THREE.Vector3(0, 1.2, -1),
};

/**
 * Fly the camera to look at `object`, offset back along `viewOffset`.
 * @param {THREE.PerspectiveCamera} camera
 * @param {import('three/addons/controls/OrbitControls.js').OrbitControls} controls
 * @param {THREE.Object3D} object
 * @param {THREE.Vector3} [viewOffset] offset from the object to place the camera
 * @param {number} [duration]
 */
export function flyToObject(camera, controls, object, viewOffset = new THREE.Vector3(0, 0.15, 1.4), duration = 900) {
  const targetPos = new THREE.Vector3();
  object.getWorldPosition(targetPos);

  const camDest = targetPos.clone().add(viewOffset);

  controls.enabled = false;
  tweenVector3Live(camera.position, camDest, duration);
  tweenVector3Live(controls.target, targetPos, duration, undefined, () => {
    controls.enabled = true;
  });
}

/**
 * Return the camera + controls target to the default room-overview position.
 */
export function resetView(camera, controls, duration = 900) {
  controls.enabled = false;
  tweenVector3Live(camera.position, DEFAULT_VIEW.position, duration);
  tweenVector3Live(controls.target, DEFAULT_VIEW.target, duration, undefined, () => {
    controls.enabled = true;
  });
}
