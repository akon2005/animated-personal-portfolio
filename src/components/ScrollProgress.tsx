import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./styles/ScrollProgress.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Thin accent bar that fills as the page is scrolled.
 *
 * Driven by ScrollTrigger's scrub rather than a scroll listener, so it shares
 * the single scroll pipeline the rest of the page already runs on and cannot
 * drift out of step with the pinned Work section.
 */
const ScrollProgress = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const bar = barRef.current;
    if (!bar) return;

    gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });
    const tween = gsap.to(bar, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        start: 0,
        end: "max",
        scrub: 0.4,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div className="scroll-progress-bar" ref={barRef} />
    </div>
  );
};

export default ScrollProgress;
