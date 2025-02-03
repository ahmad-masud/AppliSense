import "../styles/Navbar.css";
import { BriefcaseFill } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

function Navbar() {
  const { user } = useAuthContext();

  return (
    <div className="navbar-container">
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
