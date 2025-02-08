import "../styles/Footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="footer-container">
      <div className="footer">
        <p className="footer-text">
          Copyright © {new Date().getFullYear()} AppliSense. All Rights
          Reserved.
        </p>
        <p className="footer-text">
          <Link to="/terms" className="footer-link">
            Terms of Service
          </Link>
          <Link to="/privacy" className="footer-link">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Footer;
