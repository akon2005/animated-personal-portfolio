import "./styles/About.css";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">About Me</h3>
        <p className="para">
          I'm a Computer Science and Engineering student at GIET University, focused on software development and applied AI. My work spans data structures and algorithms, machine learning, retrieval-augmented generation, and modern web development. Through academic projects and internship experience, I keep building on my problem-solving, teamwork, and software engineering skills — and I enjoy turning ideas into useful applications.
        </p>
        <img src="/images/profile.jpg" alt="Vinayak Tripathy" className="profile-img" />
      </div>
    </div>
  );
};

export default About;
