import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const projects = [
  {
    title:
      "Retrieval-Augmented Generation Framework for Legal Research and Judicial Knowledge Discovery",
    category: "Major Project · AI/ML & Legal Technology",
    stack: [
      "Python",
      "FastAPI",
      "Sentence-Transformers",
      "ChromaDB",
      "FAISS",
      "React",
      "Tailwind CSS",
    ],
    overview:
      "An AI-assisted legal research assistant that retrieves comparable Indian case precedents and predicts the likely outcome from the supplied case facts and applicable IPC/BNS sections — returning a confidence score alongside the judgments it relied on.",
    highlights: [
      "Indexes the case-law corpus with Sentence-Transformers and ChromaDB/FAISS for semantic retrieval across legal domains.",
      "Grounds every explanation in retrieved precedents, with citation verification and low-confidence flags to reduce unsupported references.",
      "Pairs a FastAPI pipeline with a React and Tailwind research interface built for reading judgments alongside the result.",
    ],
    image: "/images/project_legal_rag.webp",
    alt: "Cover illustration for the legal research RAG project: a retrieval graph connecting case-law documents",
  },
  {
    title: "Quantifying Interview Presence with Multimodal AI",
    category: "AI · Computer Vision · Machine Learning",
    stack: ["Python", "OpenCV", "PyTorch", "Machine Learning"],
    overview:
      "A computer-vision system that estimates a candidate's interview presence from visual cues — facial expression, eye contact and posture — measured directly from interview video.",
    highlights: [
      "Tracks expression, gaze and posture frame by frame with OpenCV.",
      "Trains a PyTorch model that fuses the frame-level signals into a single, usable presence score.",
      "Covers the whole pipeline, from raw video input to the score used for feedback.",
    ],
    image: "/images/project_interview_presence.webp",
    alt: "Cover illustration for the interview presence project: pose landmarks inside a tracking frame beside a presence score",
  },
];

const Work = () => {
  useGSAP(() => {
    const boxes = document.getElementsByClassName("work-box");
    const container = document.querySelector(".work-container");
    if (!boxes.length || !container) return;

    let timeline: gsap.core.Timeline | null = null;

    function setTranslateX() {
      const rectLeft = container!.getBoundingClientRect().left;
      const rect = boxes[0].getBoundingClientRect();
      const parentWidth = boxes[0].parentElement!.getBoundingClientRect().width;
      const padding: number =
        parseInt(window.getComputedStyle(boxes[0]).padding) / 2;
      return rect.width * boxes.length - (rectLeft + parentWidth) + padding;
    }

    const section = document.querySelector(".work-section");

    const setup = () => {
      if (timeline) {
        ScrollTrigger.getById("work")?.kill();
        timeline.kill();
        timeline = null;
      }
      section?.classList.remove("work-pinned");
      gsap.set(".work-flex", { clearProps: "transform" });

      const translateX = setTranslateX();

      // Below the desktop breakpoint the cards are stacked vertically, so the
      // section must not pin - pinning there trapped the second project behind
      // the horizontal overflow that the page hides. Above it, the row only
      // pins when the cards actually overflow the viewport, and only then is
      // the section locked to one viewport height (see Work.css).
      if (window.innerWidth <= 1024 || translateX <= 0) return;

      section?.classList.add("work-pinned");

      timeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".work-section",
          start: "top top",
          end: `+=${translateX}`, // Use actual scroll width
          scrub: true,
          pin: true,
          invalidateOnRefresh: true,
          id: "work",
        },
      });

      timeline.to(".work-flex", {
        x: -translateX,
        ease: "none",
      });
    };

    setup();

    // Card widths change at the CSS breakpoints, which makes the old pin
    // distance stale, so the timeline is measured again after a resize.
    let resizeTimer: number | undefined;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(setup, 250);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      ScrollTrigger.getById("work")?.kill();
      timeline?.kill();
      timeline = null;
      section?.classList.remove("work-pinned");
    };
  }, []);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <p className="work-lede">
          Selected projects in applied AI — legal research and computer vision.
        </p>
        <div className="work-flex">
          {projects.map((project, index) => (
            <article className="work-box" key={project.title}>
              <div className="work-info">
                <div className="work-title">
                  <span className="work-index">0{index + 1}</span>
                  <div>
                    <h3>{project.title}</h3>
                    <p className="work-category">{project.category}</p>
                  </div>
                </div>

                <div className="work-meta">
                  <h4>Stack</h4>
                  <ul className="work-tags">
                    {project.stack.map((tool) => (
                      <li key={tool}>{tool}</li>
                    ))}
                  </ul>
                </div>

                <div className="work-meta">
                  <h4>Overview</h4>
                  <p>{project.overview}</p>
                </div>

                <div className="work-meta">
                  <h4>Highlights</h4>
                  <ul className="work-highlights">
                    {project.highlights.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <WorkImage image={project.image} alt={project.alt} />
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
