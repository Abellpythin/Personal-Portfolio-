// ---------------------------------------------------------------------------
// flyTo.js — tiny dependency-free tween engine used for camera fly-to and
// the day/night lighting transition and the book pull-out animation.
// ---------------------------------------------------------------------------

const activeTweens = new Set();

export function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Tween arbitrary numeric fields on an object.
 * @param {object} target object whose numeric properties will be mutated
 * @param {object} to end values, e.g. { x: 1, y: 2 }
 * @param {number} durationMs
 * @param {(t:number)=>number} easing
 * @param {() => void} [onComplete]
 * @returns {() => void} cancel function
 */
export function tween(target, to, durationMs = 800, easing = easeInOutCubic, onComplete) {
  const from = {};
  Object.keys(to).forEach((k) => (from[k] = target[k]));
  const start = performance.now();
  let cancelled = false;

  function step(now) {
    if (cancelled) return;
    const elapsed = now - start;
    const t = Math.min(1, elapsed / durationMs);
    const eased = easing(t);
    Object.keys(to).forEach((k) => {
      target[k] = from[k] + (to[k] - from[k]) * eased;
    });
    if (t < 1) {
      const id = requestAnimationFrame(step);
      activeTweens.add(id);
    } else if (onComplete) {
      onComplete();
    }
  }

  const id = requestAnimationFrame(step);
  activeTweens.add(id);

  return () => {
    cancelled = true;
  };
}

/**
 * Tween a THREE.Vector3-like object (position/rotation/etc).
 */
export function tweenVector3(vec3, to, durationMs = 800, easing = easeInOutCubic, onComplete) {
  return tween(
    { x: vec3.x, y: vec3.y, z: vec3.z },
    { x: to.x, y: to.y, z: to.z },
    durationMs,
    easing,
    onComplete
  );
  // Note: consumers should instead use tweenVector3Live below for a live-bound vector.
}

/**
 * Live-bound Vector3 tween: mutates the actual vec3 each frame.
 */
export function tweenVector3Live(vec3, to, durationMs = 800, easing = easeInOutCubic, onComplete) {
  const from = { x: vec3.x, y: vec3.y, z: vec3.z };
  const start = performance.now();
  let cancelled = false;

  function step(now) {
    if (cancelled) return;
    const elapsed = now - start;
    const t = Math.min(1, elapsed / durationMs);
    const eased = easing(t);
    vec3.x = from.x + (to.x - from.x) * eased;
    vec3.y = from.y + (to.y - from.y) * eased;
    vec3.z = from.z + (to.z - from.z) * eased;
    if (t < 1) {
      requestAnimationFrame(step);
    } else if (onComplete) {
      onComplete();
    }
  }
  requestAnimationFrame(step);
  return () => {
    cancelled = true;
  };
}
