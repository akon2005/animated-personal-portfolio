import { useEffect } from "react";
import { TbPalette } from "react-icons/tb";
import HoverLinks from "./HoverLinks";
import { useTheme } from "../theme/themeContext";
import "./styles/Navbar.css";

const Navbar = () => {
  const { panelOpen, setPanelOpen, resolvedMode } = useTheme();

  useEffect(() => {
    const links = document.querySelectorAll(".header ul a");
    const handlers: Array<[HTMLAnchorElement, (e: Event) => void]> = [];

    links.forEach((elem) => {
      const element = elem as HTMLAnchorElement;
      const onClick = (e: Event) => {
        const section = element.getAttribute("data-href");
        // Only intercept links that point at an in-page section; links such as
        // RESUME must keep their normal navigation (this used to be swallowed by
        // an unconditional preventDefault on desktop).
        if (section && window.innerWidth > 1024) {
          e.preventDefault();
          document.querySelector(section)?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      };
      element.addEventListener("click", onClick);
      handlers.push([element, onClick]);
    });

    return () => {
      handlers.forEach(([element, handler]) => {
        element.removeEventListener("click", handler);
      });
    };
  }, []);
  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title" data-cursor="disable">
          <img src="/images/logo.webp" alt="Logo" className="navbar-logo" />
        </a>
        <a
          href="mailto:vinayaktripathy2005@gmail.com"
          className="navbar-connect"
          data-cursor="disable"
        >
          vinayaktripathy2005@gmail.com
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="CONTACT" />
            </a>
          </li>
          <li>
            <a href="/resume" data-cursor="disable">
              <HoverLinks text="RESUME" />
            </a>
          </li>
          <li>
            <button
              type="button"
              className="theme-trigger"
              aria-label="Theme settings"
              aria-haspopup="dialog"
              aria-expanded={panelOpen}
              title={`Theme settings (${resolvedMode} mode)`}
              onClick={() => setPanelOpen(!panelOpen)}
            >
              <TbPalette aria-hidden="true" />
            </button>
          </li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;