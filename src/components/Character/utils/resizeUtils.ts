import * as THREE from "three";
import {
  getCharScrollMode,
  setCharTimeline,
  setAllTimeline,
} from "../../utils/GsapScroll";

export default function handleResize(
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  canvasDiv: React.RefObject<HTMLDivElement>,
  character: THREE.Object3D
) {
  if (!canvasDiv.current) return;
  const canvas3d = canvasDiv.current.getBoundingClientRect();
  const width = canvas3d.width;
  const height = canvas3d.height;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  // The scroll timelines only differ between the desktop and the mobile layout,
  // so they are rebuilt when that breakpoint is actually crossed. Rebuilding
  // (and killing every ScrollTrigger on the page) on each resize event used to
  // create duplicate timelines, drop the split-text triggers and jump the
  // scroll position. ScrollTrigger refreshes its own measurements on resize.
  const mode = window.innerWidth > 1024 ? "desktop" : "mobile";
  if (mode !== getCharScrollMode()) {
    setCharTimeline(character, camera);
    setAllTimeline();
  }
}
