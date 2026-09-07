import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container" id="internships">
      <div className="career-container">
        <h2>
          Internship <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Intern</h4>
                <h5>National Aluminium Company Limited (NALCO)</h5>
              </div>
              <h3>Jun 2025 - Jul 2025</h3>
            </div>
            <p>
              Contributed to enterprise-level software development and assisted in optimizing database queries to improve system performance. Supported workflow automation processes and participated in testing and validation of software systems to ensure reliability and smooth operation.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Software Developer Intern</h4>
                <h5>Internshala</h5>
              </div>
              <h3>Jan 2024 - Feb 2024</h3>
            </div>
            <p>
              Worked on developing scalable software modules using Python, automated data processing tasks, and collaborated in an Agile development environment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
