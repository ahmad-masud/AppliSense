import "../styles/Navbar.css";
import {
  BriefcaseFill,
  PersonFill,
  PieChartFill,
  GridFill,
  Table,
} from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

function Navbar() {
  const { user } = useAuthContext();

  return (
    <div className="navbar-container">
      <div className="navbar">
        <Link className="nav-title" to="/">
          <BriefcaseFill size={30} /> AppliSense
        </Link>
        <div className="nav-links">
          {!user && (
            <Link className="nav-link" to="/login">
              Login
            </Link>
          )}
          {!user && (
            <Link className="nav-link" to="/register">
              Register
            </Link>
          )}
          {user && (
            <Link to="/table" className="nav-button">
              <Table size={20} />
            </Link>
          )}
          {user && (
            <Link to="/" className="nav-button">
              <GridFill size={20} />
            </Link>
          )}
          {user && (
            <Link to="/statistics" className="nav-button">
              <PieChartFill size={20} />
            </Link>
          )}
          {user && (
            <Link to="/account" className="nav-button">
              <PersonFill size={20} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
