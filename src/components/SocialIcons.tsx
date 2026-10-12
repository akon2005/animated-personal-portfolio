import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import "./styles/SocialIcons.css";
import { TbMail, TbNotes } from "react-icons/tb";
import { useEffect } from "react";
import HoverLinks from "./HoverLinks";

const SocialIcons = () => {
  useEffect(() => {
    const social = document.getElementById("social");
    if (!social) return;

    const cleanups: Array<() => void> = [];

    social.querySelectorAll("span").forEach((item) => {
      const elem = item as HTMLElement;
      const link = elem.querySelector("a") as HTMLElement | null;
      if (!link) return;

      const rect = elem.getBoundingClientRect();
      let mouseX = rect.width / 2;
      let mouseY = rect.height / 2;
      let currentX = 0;
      let currentY = 0;
      let frame = 0;
      let running = true;

      const updatePosition = () => {
        if (!running) return;
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;

        link.style.setProperty("--siLeft", `${currentX}px`);
        link.style.setProperty("--siTop", `${currentY}px`);

        frame = requestAnimationFrame(updatePosition);
      };

      const onMouseMove = (e: MouseEvent) => {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x < 40 && x > 10 && y < 40 && y > 5) {
          mouseX = x;
          mouseY = y;
        } else {
          mouseX = rect.width / 2;
          mouseY = rect.height / 2;
        }
      };

      document.addEventListener("mousemove", onMouseMove);

      updatePosition();

      cleanups.push(() => {
        running = false;
        cancelAnimationFrame(frame);
        document.removeEventListener("mousemove", onMouseMove);
      });
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="icons" id="social">
        <span>
          <a
            href="https://github.com/akon2005"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Vinayak Tripathy on GitHub"
          >
            <FaGithub />
          </a>
        </span>
        <span>
          <a
            href="https://www.linkedin.com/in/vinayaktripathy"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Vinayak Tripathy on LinkedIn"
          >
            <FaLinkedinIn />
          </a>
        </span>
        <span>
          <a
            href="mailto:vinayaktripathy2005@gmail.com"
            aria-label="Email Vinayak Tripathy"
          >
            <TbMail />
          </a>
        </span>
      </div>
      <a className="resume-button" href="/resume" data-cursor="disable">
        <HoverLinks text="RESUME" />
        <span aria-hidden="true">
          <TbNotes />
        </span>
      </a>
    </div>
  );
};

export default SocialIcons;
