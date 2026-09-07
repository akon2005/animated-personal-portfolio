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
            <li>AI-ML Virtual Internship – EduSkills (Supported by Google for Developers)</li>
            <li>Python Programming Certification</li>
            <li>Database Management and Backend Development</li>
            <li>Full Stack Web Development Training</li>
            <li>Machine Learning and Computer Vision using Python</li>
            <li>Adobe Design Fundamentals with AI Certification</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Training;
