import gsap from "gsap";
import { splitText } from "./textSplit";

export function initialFX() {
  document.body.style.overflowY = "auto";
  document.getElementsByTagName("main")[0].classList.add("main-active");
  // Resolve the themed page colour instead of a hardcoded dark value, so the
  // loader hands over to the right background in either mode.
  const themeBackground =
    getComputedStyle(document.documentElement)
      .getPropertyValue("--color-bg")
      .trim() || "#0b080c";
  gsap.to("body", {
    backgroundColor: themeBackground,
    duration: 0.5,
    delay: 1,
    // Hand the background straight back to the theme tokens. A lingering inline
    // colour wins over `body { background-color: var(--color-bg) }`, which left
    // the page dark after switching to light mode - with dark-on-dark text.
    clearProps: "backgroundColor",
  });

  const landingText = splitText(".landing-info h3, .landing-intro h2, .landing-intro h1");
  gsap.fromTo(
    landingText.chars,
    { opacity: 0, y: 80, filter: "blur(5px)" },
    {
      opacity: 1,
      duration: 1.2,
      filter: "blur(0px)",
      ease: "power3.inOut",
      y: 0,
      stagger: 0.025,
      delay: 0.3,
    }
  );

  const landingText2 = splitText(".landing-h2-info");
  gsap.fromTo(
    landingText2.chars,
    { opacity: 0, y: 80, filter: "blur(5px)" },
    {
      opacity: 1,
      duration: 1.2,
      filter: "blur(0px)",
      ease: "power3.inOut",
      y: 0,
      stagger: 0.025,
      delay: 0.3,
    }
  );

  gsap.fromTo(
    ".landing-info-h2",
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power1.inOut",
      y: 0,
      delay: 0.8,
    }
  );
  gsap.fromTo(
    [".header", ".icons-section", ".nav-fade"],
    { opacity: 0 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power1.inOut",
      delay: 0.1,
    }
  );

  const landingText3 = splitText(".landing-h2-info-1");
  const landingText4 = splitText(".landing-h2-1");
  const landingText5 = splitText(".landing-h2-2");

  LoopText(landingText2.chars, landingText3.chars);
  LoopText(landingText4.chars, landingText5.chars);
}

function LoopText(chars1: HTMLElement[], chars2: HTMLElement[]) {
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
  const delay = 4;
  const delay2 = delay * 2 + 1;

  tl.fromTo(
    chars2,
    { opacity: 0, y: 80 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power3.inOut",
      y: 0,
      stagger: 0.1,
      delay: delay,
    },
    0
  )
    .fromTo(
      chars1,
      { y: 80 },
      {
        duration: 1.2,
        ease: "power3.inOut",
        y: 0,
        stagger: 0.1,
        delay: delay2,
      },
      1
    )
    .fromTo(
      chars1,
      { y: 0 },
      {
        y: -80,
        duration: 1.2,
        ease: "power3.inOut",
        stagger: 0.1,
        delay: delay,
      },
      0
    )
    .to(
      chars2,
      {
        y: -80,
        duration: 1.2,
        ease: "power3.inOut",
        stagger: 0.1,
        delay: delay2,
      },
      1
    );
}