import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./styles/MarqueeBand.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ITEMS = [
  "Open to internships",
  "AI / ML",
  "Full-stack",
  "RAG & LLMs",
  "Computer vision",
  "Always building",
];

/**
 * Full-bleed word band that reacts to how fast the visitor is scrolling.
 *
 * The track holds the phrases twice and loops by exactly -50%, so it is
 * seamless at any speed. Scroll velocity scales the playback rate and flips the
 * direction when the visitor scrolls back up, which is what makes the page feel
 * like it is responding rather than playing a fixed animation.
 *
 * The band is decorative (the same information appears in the Work cards and
 * the skills list), so it is hidden from assistive tech rather than being read
 * out twice as a repeated list.
 */
const MarqueeBand = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    // Reduced motion: the band renders as a still strip the visitor can read.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const loop = gsap.to(track, {
      xPercent: -50,
      duration: 30,
      ease: "none",
      repeat: -1,
    });

    let settle: gsap.core.Tween | null = null;
    // Held across updates so a near-zero velocity reading cannot flip the band
    // back and forth while the visitor is drifting to a stop.
    let direction = 1;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const velocity = self.getVelocity();
        if (velocity < -60) direction = -1;
        else if (velocity > 60) direction = 1;

        const boost = 1 + Math.min(6, Math.abs(velocity) / 160);
        loop.timeScale(direction * boost);

        settle?.kill();
        // Ease back to the resting speed instead of snapping when scrolling stops.
        settle = gsap.to(loop, {
          timeScale: direction,
          duration: 1.1,
          ease: "power2.out",
          overwrite: true,
        });
      },
    });

    return () => {
      trigger.kill();
      settle?.kill();
      loop.kill();
    };
  }, []);

  return (
    <section
      className="marquee-band"
      ref={sectionRef}
      aria-hidden="true"
      data-cursor="disable"
    >
      <div className="marquee-track" ref={trackRef}>
        {[...ITEMS, ...ITEMS].map((item, index) => (
          <span
            className={`marquee-item${index % 2 ? " marquee-item-alt" : ""}`}
            key={`${item}-${index}`}
          >
            {item}
            <span className="marquee-dot" />
          </span>
        ))}
      </div>
    </section>
  );
};

export default MarqueeBand;
