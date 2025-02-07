import { useEffect } from "react";
import "../styles/Home.css";
import { Link } from "react-router-dom";
import feature1 from "../assets/1.png";
import feature2 from "../assets/2.png";
import feature3 from "../assets/3.png";
import heroImage from "../assets/hero.png";
import ClockFill from "react-bootstrap-icons/dist/icons/clock-fill";
import FilterSquareFill from "react-bootstrap-icons/dist/icons/filter-square-fill";
import EnvelopeFill from "react-bootstrap-icons/dist/icons/envelope-fill";

function Home() {
  useEffect(() => {
    document.title = "AppliSense";
  }, []);

  return (
    <div className="home">
      <div className="hero">
        <div className="hero-text-container">
          <p className="hero-title">Stay posted, don't get ghosted</p>
          <p className="hero-text">
            Stop getting ghosted! AppliSense helps you track your job
            applications, follow up with companies, and stay organized in your
            job search.
          </p>
          <Link to="/register" className="hero-button">
            Get Started
          </Link>
        </div>
        <img className="hero-image" src={heroImage} alt="hero" />
      </div>
      <div className="features-container">
        <div className="features">
          <div className="feature">
            <img className="feature-image" src={feature1} alt="form" />
            <div className="feature-text-container">
              <p className="feature-title">
                <ClockFill /> Get started in{" "}
                <span style={{ color: "#0060B9" }}>seconds</span>
              </p>
              <p className="feature-text">
                Just fill out a simple form to add a job application and track
                your current progress of the application.
              </p>
            </div>
          </div>
          <div className="feature">
            <img className="feature-image" src={feature2} alt="jobs" />
            <div className="feature-text-container">
              <p className="feature-title">
                <FilterSquareFill />{" "}
                <span style={{ color: "#0060B9" }}>Organize</span> your
                applications
              </p>
              <p className="feature-text">
                Organize your job applications so you can track your progress
                and stay on top of your job search.
              </p>
            </div>
          </div>
          <div className="feature">
            <img className="feature-image" src={feature3} alt="email" />
            <div className="feature-text-container">
              <p className="feature-title">
                <EnvelopeFill />{" "}
                <span style={{ color: "#0060B9" }}>Sort and filter</span> your
                applications
              </p>
              <p className="feature-text">
                Easily filter and sort job applications based on company,
                position, status, and more
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="anti-hero">
        <p className="anti-hero-title">Get started with AppliSense today</p>
        <p className="anti-hero-text">Never miss a opportunity again</p>
        <Link to="/register" className="anti-hero-button">
          Make an account
        </Link>
      </div>
    </div>
  );
}

export default Home;
