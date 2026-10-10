import "./styles/Career.css";

const Education = () => {
  return (
    <div className="career-section section-container" id="education">
      <div className="career-container">
        <h2>
          Educational <span>&</span>
          <br /> Qualifications
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>B.Tech — Computer Science &amp; Engineering</h4>
                <h5>GIET University, Gunupur — Odisha</h5>
              </div>
              <h3>2023 - 2027</h3>
            </div>
            <p>
              Pursuing Bachelor of Technology at Gandhi Institute of Engineering and Technology (GIET) University, Gunupur, Odisha, with a focus on core computer science subjects, programming, and software engineering. Current CGPA: 7.6.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Intermediate — Class XII, CBSE</h4>
                <h5>Vikash Residential School, Bargarh</h5>
              </div>
              <h3>2023</h3>
            </div>
            <p>
              Completed higher secondary education under the CBSE board, building a strong foundation in sciences and mathematics.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Matriculation — Class X, CBSE</h4>
                <h5>Kendriya Vidyalaya, Badmal</h5>
              </div>
              <h3>2021</h3>
            </div>
            <p>
              Completed secondary education under the CBSE board with a focus on overall academic excellence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Education;
