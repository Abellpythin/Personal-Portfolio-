// ---------------------------------------------------------------------------
// raycaster.js — hover + click detection over any mesh tagged `.userData.interactive`.
// Wires up tooltip text, cursor change, and hover/click sound hooks.
// ---------------------------------------------------------------------------
import * as THREE from "three";

export function setupRaycaster({ camera, scene, domElement, tooltipEl, onHover, onLeave, onClick }) {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let hovered = null;

  function getInteractiveHit(clientX, clientY) {
    const rect = domElement.getBoundingClientRect();
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(scene.children, true);
    return hits.find((h) => findInteractive(h.object));
  }

  function findInteractive(obj) {
    let o = obj;
    while (o) {
      if (o.userData && o.userData.interactive) return o;
      o = o.parent;
    }
    return null;
  }

  function onPointerMove(e) {
    const hit = getInteractiveHit(e.clientX, e.clientY);
    const target = hit ? findInteractive(hit.object) : null;

    if (target !== hovered) {
      if (hovered && onLeave) onLeave(hovered);
      hovered = target;
      domElement.classList.toggle("hoverable", !!hovered);
      if (hovered && onHover) onHover(hovered);
    }

    if (tooltipEl) {
      if (hovered) {
        tooltipEl.style.display = "block";
        tooltipEl.style.left = `${e.clientX}px`;
        tooltipEl.style.top = `${e.clientY}px`;
        tooltipEl.textContent = hovered.userData.label || "";
      } else {
        tooltipEl.style.display = "none";
      }
    }
  }

  function onPointerDown(e) {
    const hit = getInteractiveHit(e.clientX, e.clientY);
    const target = hit ? findInteractive(hit.object) : null;
    if (target && onClick) onClick(target);
  }

  domElement.addEventListener("pointermove", onPointerMove);
  domElement.addEventListener("pointerdown", onPointerDown);

  return {
    dispose() {
      domElement.removeEventListener("pointermove", onPointerMove);
      domElement.removeEventListener("pointerdown", onPointerDown);
    },
  };
}
