import "../styles/Navbar.css";
import { BriefcaseFill } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import useScrollDirection from "../hooks/useScrollDirection";

function Navbar() {
  const { user } = useAuthContext();
  const scrollDirection = useScrollDirection();

  return (
    <div
      className={`navbar-container ${scrollDirection === "down" ? "hide" : "show"}`}
    >
      <div className="navbar">
        <Link className="nav-title" to="/">
          <BriefcaseFill /> AppliSense
        </Link>
        <div className="nav-links">
          {!user && (
            <Link className="nav-link" to="/login">
              Login
            </Link>
          )}
          {!user && (
            <Link className="nav-link" to="/register">
              Register FREE
            </Link>
          )}
          {user && (
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>
          )}
          {user && (
            <Link to="/account" className="nav-link">
              Account
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
