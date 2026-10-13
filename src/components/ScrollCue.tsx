import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./styles/ScrollCue.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * The little "scroll to explore" nudge in the hero.
 *
 * It exists to be discovered, so it fades out of the way once the visitor takes
 * the hint instead of hanging around on every section.
 */
const ScrollCue = () => {
  const cueRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cue = cueRef.current;
    if (!cue) return;

    const tween = gsap.to(cue, {
      opacity: 0,
      y: 26,
      ease: "none",
      scrollTrigger: {
        trigger: ".landing-section",
        start: "top top",
        end: "+=320",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div className="landing-cue" ref={cueRef} aria-hidden="true">
      <span className="landing-cue-label">Scroll to explore</span>
      <span className="landing-cue-arrow" />
    </div>
  );
};

export default ScrollCue;
