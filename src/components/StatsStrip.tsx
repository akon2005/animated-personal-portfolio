import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./styles/StatsStrip.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Every figure below is taken from the content already on the page (Education,
 * Career, Training and Work), so nothing here is asserted that the rest of the
 * portfolio does not already say.
 */
const STATS = [
  { value: 7.6, decimals: 1, label: "CGPA", hint: "B.Tech CSE" },
  { value: 2, decimals: 0, label: "Internships", hint: "NALCO & Internshala" },
  { value: 2, decimals: 0, label: "Major projects", hint: "Legal RAG & interview AI" },
  { value: 7, decimals: 0, label: "Certifications", hint: "EduSkills · NPTEL · Anthropic" },
];

/**
 * "By the numbers" strip.
 *
 * The counters play once, the first time the strip is reached, and the final
 * figure is always present for assistive tech (the animated number itself is
 * aria-hidden) so a screen reader never reads a part-finished count.
 */
const StatsStrip = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const values = gsap.utils.toArray<HTMLElement>(".stat-value", section);
    const tweens: gsap.core.Tween[] = [];

    values.forEach((element) => {
      const target = Number(element.dataset.value ?? 0);
      const decimals = Number(element.dataset.decimals ?? 0);
      const finalText = target.toFixed(decimals);

      if (reduced) {
        element.textContent = finalText;
        return;
      }

      const counter = { value: 0 };
      const tween = gsap.to(counter, {
        value: target,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: { trigger: element, start: "top 88%", once: true },
        onUpdate: () => {
          element.textContent = counter.value.toFixed(decimals);
        },
      });
      tweens.push(tween);
    });

    return () => {
      tweens.forEach((tween) => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
    };
  }, []);

  return (
    <section className="stats-strip" ref={sectionRef} id="stats">
      <div className="stats-strip-inner section-container">
        <h2 className="stats-heading" id="stats-heading">
          By the <span>numbers</span>
        </h2>
        <ul className="stats-grid" aria-labelledby="stats-heading">
          {STATS.map((stat) => {
            const finalText = stat.value.toFixed(stat.decimals);
            return (
              <li className="stat-card" key={stat.label}>
                <span
                  className="stat-value"
                  aria-hidden="true"
                  data-value={stat.value}
                  data-decimals={stat.decimals}
                >
                  0
                </span>
                <span className="sr-only">{finalText}</span>
                <span className="stat-label">{stat.label}</span>
                <span className="stat-hint">{stat.hint}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default StatsStrip;
