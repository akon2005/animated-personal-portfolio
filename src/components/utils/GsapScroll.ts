import * as THREE from "three";
import gsap from "gsap";

export type ScrollMode = "desktop" | "mobile";

/**
 * Timelines and repeating tweens owned by this module.
 *
 * `setCharTimeline` / `setAllTimeline` can be called again when the desktop
 * breakpoint is crossed, so every repeating resource they create is tracked here
 * and released before a rebuild. Previously the 200ms intensity interval and the
 * infinite screen-light tween were created on every call and never cleaned up,
 * so each resize left another pair of loops running.
 */
let intensityInterval: number | undefined;
let glowTimeline: gsap.core.Timeline | null = null;
let charTimelines: gsap.core.Timeline[] = [];
let careerTimeline: gsap.core.Timeline | null = null;
let charMode: ScrollMode | null = null;

const killTimeline = (timeline: gsap.core.Timeline | null) => {
  if (!timeline) return;
  timeline.scrollTrigger?.kill();
  timeline.kill();
};

/** The layout the currently built character timelines were created for. */
export function getCharScrollMode(): ScrollMode | null {
  return charMode;
}

/**
 * Releases everything the character timelines own. Also clears the inline
 * transforms/opacity the desktop timelines leave behind, so switching to the
 * mobile layout (or rebuilding) cannot inherit a stale offset.
 */
export function disposeCharTimeline() {
  charTimelines.forEach(killTimeline);
  charTimelines = [];
  if (intensityInterval !== undefined) {
    window.clearInterval(intensityInterval);
    intensityInterval = undefined;
  }
  glowTimeline?.kill();
  glowTimeline = null;
  charMode = null;
  gsap.set(
    [
      ".character-model",
      ".landing-container",
      ".about-section",
      ".about-me",
      ".whatIDO",
      ".character-rim",
      ".what-box-in",
    ],
    { clearProps: "transform,opacity,display" }
  );
}

export function setCharTimeline(
  character: THREE.Object3D<THREE.Object3DEventMap> | null,
  camera: THREE.PerspectiveCamera
) {
  disposeCharTimeline();

  const isDesktop = window.innerWidth > 1024;
  charMode = isDesktop ? "desktop" : "mobile";

  let intensity: number = 0;
  intensityInterval = window.setInterval(() => {
    intensity = Math.random();
  }, 200);

  const tl1 = gsap.timeline({
    scrollTrigger: {
      trigger: ".landing-section",
      start: "top top",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  const tl2 = gsap.timeline({
    scrollTrigger: {
      trigger: ".about-section",
      start: "center 55%",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  const tl3 = gsap.timeline({
    scrollTrigger: {
      trigger: ".whatIDO",
      start: "top top",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  charTimelines.push(tl1, tl2, tl3);

  let screenLight: THREE.Mesh | null = null;
  let monitor: THREE.Mesh | null = null;
  character?.children.forEach((object) => {
    if (object.name === "Plane004") {
      object.children.forEach((child) => {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshStandardMaterial;
        material.transparent = true;
        material.opacity = 0;
        if (material.name === "Material.027") {
          monitor = mesh;
          material.color.set("#FFFFFF");
        }
      });
    }
    if (object.name === "screenlight") {
      const mesh = object as THREE.Mesh;
      const material = mesh.material as THREE.MeshStandardMaterial;
      material.transparent = true;
      material.opacity = 0;
      material.emissive.set("#C8BFFF");
      glowTimeline = gsap
        .timeline({ repeat: -1, repeatRefresh: true })
        .to(material, {
          emissiveIntensity: () => intensity * 8,
          duration: () => Math.random() * 0.6,
          delay: () => Math.random() * 0.1,
        });
      screenLight = mesh;
    }
  });
  const neckBone = character?.getObjectByName("spine005");
  if (isDesktop) {
    if (character) {
      tl1
        .fromTo(character.rotation, { y: 0 }, { y: 0.7, duration: 1 }, 0)
        .to(camera.position, { z: 22 }, 0)
        // The character now starts 28% further left (see Landing.css), so the
        // scroll offsets are compensated to keep the rest of the page's framing.
        .fromTo(".character-model", { x: 0 }, { x: "3%", duration: 1 }, 0)
        .to(".landing-container", { opacity: 0, duration: 0.4 }, 0)
        .to(".landing-container", { y: "40%", duration: 0.8 }, 0)
        .fromTo(".about-me", { y: "-50%" }, { y: "0%" }, 0);

      tl2
        .to(
          camera.position,
          { z: 75, y: 8.4, duration: 6, delay: 2, ease: "power3.inOut" },
          0
        )
        .to(".about-section", { y: "30%", duration: 6 }, 0)
        .to(".about-section", { opacity: 0, delay: 3, duration: 2 }, 0)
        .fromTo(
          ".character-model",
          { pointerEvents: "inherit" },
          { pointerEvents: "none", x: "16%", delay: 2, duration: 5 },
          0
        )
        .to(character.rotation, { y: 0.92, x: 0.12, delay: 3, duration: 3 }, 0)
        .to(neckBone!.rotation, { x: 0.6, delay: 2, duration: 3 }, 0)
        .fromTo(
          ".what-box-in",
          { display: "none" },
          { display: "flex", duration: 0.1, delay: 6 },
          0
        )
        .fromTo(
          ".character-rim",
          { opacity: 1, scaleX: 1.4 },
          { opacity: 0, scale: 0, y: "-70%", duration: 5, delay: 2 },
          0.3
        );

      // The monitor and its glow are looked up from the loaded model above.
      const monitorMesh = monitor as THREE.Mesh | null;
      const glowMesh = screenLight as THREE.Mesh | null;
      if (monitorMesh) {
        tl2
          .to(monitorMesh.material, { opacity: 1, duration: 0.8, delay: 3.2 }, 0)
          .fromTo(
            monitorMesh.position,
            { y: -10, z: 2 },
            { y: 0, z: 0, delay: 1.5, duration: 3 },
            0
          );
      }
      if (glowMesh) {
        tl2.to(
          glowMesh.material,
          { opacity: 1, duration: 0.8, delay: 4.5 },
          0
        );
      }

      tl3
        .fromTo(
          ".character-model",
          { y: "0%" },
          { y: "-100%", duration: 4, ease: "none", delay: 1 },
          0
        )
        .fromTo(".whatIDO", { y: 0 }, { y: "15%", duration: 2 }, 0)
        .to(character.rotation, { x: -0.04, duration: 2, delay: 1 }, 0);
    }
  } else {
    if (character) {
      const tM2 = gsap.timeline({
        scrollTrigger: {
          trigger: ".what-box-in",
          start: "top 70%",
          end: "bottom top",
        },
      });
      charTimelines.push(tM2);
      tM2.to(".what-box-in", { display: "flex", duration: 0.1, delay: 0 }, 0);
    }
  }
}

export function setAllTimeline() {
  killTimeline(careerTimeline);

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".career-section",
      start: "top 30%",
      end: "100% center",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  careerTimeline = timeline;

  timeline
    .fromTo(
      ".career-timeline",
      { maxHeight: "10%" },
      { maxHeight: "100%", duration: 0.5 },
      0
    )

    .fromTo(
      ".career-timeline",
      { opacity: 0 },
      { opacity: 1, duration: 0.1 },
      0
    )
    .fromTo(
      ".career-info-box",
      { opacity: 0 },
      { opacity: 1, stagger: 0.1, duration: 0.5 },
      0
    )
    .fromTo(
      ".career-dot",
      { animationIterationCount: "infinite" },
      {
        animationIterationCount: "1",
        delay: 0.3,
        duration: 0.1,
      },
      0
    );

  if (window.innerWidth > 1024) {
    timeline.fromTo(
      ".career-section",
      { y: 0 },
      { y: "20%", duration: 0.5, delay: 0.2 },
      0
    );
  } else {
    timeline.fromTo(
      ".career-section",
      { y: 0 },
      { y: 0, duration: 0.5, delay: 0.2 },
      0
    );
  }
}
