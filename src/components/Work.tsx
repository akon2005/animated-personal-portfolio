import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const projects = [
  {
    title:
      "Retrieval-Augmented Generation Framework for Legal Research and Judicial Knowledge Discovery",
    category: "Major Project — AI/ML & Legal Technology",
    tools:
      "Python, FastAPI, Sentence-Transformers, ChromaDB, FAISS, React, Tailwind CSS",
    description:
      "An AI-assisted legal research system that retrieves relevant Indian case precedents and predicts case outcomes from given case facts and applicable IPC/BNS sections. Retrieval, outcome classification and LLM explanations are grounded in the fetched judgments, with citation verification and low-confidence flags to reduce unsupported references.",
    image: "/images/placeholder.webp",
  },
  {
    title: "Quantifying Interview Presence with Multimodal AI",
    category: "AI / Computer Vision / Machine Learning",
    tools: "Python, OpenCV, PyTorch, Machine Learning",
    description:
      "A computer-vision system that analyses interview video and estimates interview presence from visual signals such as facial expressions, eye contact and posture. Frame-level signals are extracted with OpenCV and combined by a PyTorch model into a single presence score.",
    image: "/images/project_ai_interview_1780234237819.png",
  },
];

const Work = () => {
  useGSAP(() => {
    const boxes = document.getElementsByClassName("work-box");
    const container = document.querySelector(".work-container");
    if (!boxes.length || !container) return;

    let translateX: number = 0;

    function setTranslateX() {
      const rectLeft = container!.getBoundingClientRect().left;
      const rect = boxes[0].getBoundingClientRect();
      const parentWidth = boxes[0].parentElement!.getBoundingClientRect().width;
      const padding: number =
        parseInt(window.getComputedStyle(boxes[0]).padding) / 2;
      translateX = rect.width * boxes.length - (rectLeft + parentWidth) + padding;
    }

    setTranslateX();

    // Only pin and scroll horizontally when the cards actually overflow the
    // viewport, otherwise (few projects) leave the row in place.
    if (translateX <= 0) return;

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top top",
        end: `+=${translateX}`, // Use actual scroll width
        scrub: true,
        pin: true,
        id: "work",
      },
    });

    timeline.to(".work-flex", {
      x: -translateX,
      ease: "none",
    });

    // Clean up (optional, good practice)
    return () => {
      timeline.kill();
      ScrollTrigger.getById("work")?.kill();
    };
  }, []);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex">
          {projects.map((project, index) => (
            <div className="work-box" key={index}>
              <div className="work-info">
                <div className="work-title">
                  <h3>0{index + 1}</h3>

                  <div>
                    <h4>{project.title}</h4>
                    <p>{project.category}</p>
                  </div>
                </div>
                <h4>Tools and features</h4>
                <p>{project.tools}</p>
                <h4>Overview</h4>
                <p>{project.description}</p>
              </div>
              <WorkImage image={project.image} alt={project.title} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
