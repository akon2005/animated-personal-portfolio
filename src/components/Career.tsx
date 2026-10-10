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
                <h4>Intern, System Department</h4>
                <h5>National Aluminium Company Limited (NALCO) — Angul, Odisha</h5>
              </div>
              <h3>Jun 2025 - Jul 2025</h3>
            </div>
            <p>
              Gained exposure to enterprise software and database operations supporting plant workflows. Observed workflow automation and testing practices, and visited the server room to understand the IT infrastructure behind day-to-day operations.
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
              Developed software modules in Python, automated data-processing tasks, and collaborated with a team in an Agile development environment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
