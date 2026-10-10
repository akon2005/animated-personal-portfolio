import "./styles/Career.css";

const Training = () => {
  return (
    <div className="career-section section-container" id="training">
      <div className="career-container">
        <h2>
          Training <span>&</span>
          <br /> Certification
        </h2>
        <div className="career-info" style={{ width: "100%", alignItems: "center" }}>
          <ul className="training-list">
            <li>AI-ML Internship — EduSkills</li>
            <li>GenAI &amp; LLMs Internship — EduSkills</li>
            <li>Anthropic Courses — Claude and MCP</li>
            <li>Spring Boot — Infosys Springboard</li>
            <li>The Joy of Computing using Python — NPTEL</li>
            <li>Programming in Java — NPTEL</li>
            <li>Adobe Design Fundamentals</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Training;
