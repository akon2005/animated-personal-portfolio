import { useEffect, useRef } from "react";
import "./styles/Cursor.css";
import gsap from "gsap";

const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let hover = false;
    let frame = 0;
    const mousePos = { x: 0, y: 0 };
    const cursorPos = { x: 0, y: 0 };

    const onMouseMove = (e: MouseEvent) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    };
    document.addEventListener("mousemove", onMouseMove);

    const loop = () => {
      frame = requestAnimationFrame(loop);
      if (hover) return;
      const delay = 6;
      cursorPos.x += (mousePos.x - cursorPos.x) / delay;
      cursorPos.y += (mousePos.y - cursorPos.y) / delay;
      gsap.to(cursor, { x: cursorPos.x, y: cursorPos.y, duration: 0.1 });
    };
    frame = requestAnimationFrame(loop);

    const cursorTarget = (event: MouseEvent) =>
      ((event.target as HTMLElement | null)?.closest?.(
        "[data-cursor]"
      ) as HTMLElement | null) ?? null;

    // Delegated instead of one listener per element: the listeners cannot leak
    // on remount, and elements rendered later are covered too.
    const onMouseOver = (event: MouseEvent) => {
      const target = cursorTarget(event);
      if (!target) return;
      const from = event.relatedTarget as Node | null;
      if (from && target.contains(from)) return;

      if (target.dataset.cursor === "icons") {
        const rect = target.getBoundingClientRect();
        cursor.classList.add("cursor-icons");
        gsap.to(cursor, { x: rect.left, y: rect.top, duration: 0.1 });
        cursor.style.setProperty("--cursorH", `${rect.height}px`);
        hover = true;
      }
      if (target.dataset.cursor === "disable") {
        cursor.classList.add("cursor-disable");
      }
    };

    const onMouseOut = (event: MouseEvent) => {
      const target = cursorTarget(event);
      if (!target) return;
      const to = event.relatedTarget as Node | null;
      if (to && target.contains(to)) return;

      cursor.classList.remove("cursor-disable", "cursor-icons");
      hover = false;
    };

    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, []);

  return <div className="cursor-main" ref={cursorRef}></div>;
};

export default Cursor;
