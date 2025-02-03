import "../styles/Form.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useRegister } from "../hooks/useRegister";

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { register, error, isLoading } = useRegister();

  useEffect(() => {
    document.title = "Register | AppliSense";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await register(firstName, lastName, email, password, confirmPassword);
  };

  return (
    <div className="form-container">
      <div className="form-sub-container">
        <form className="form" onSubmit={handleSubmit}>
          <p className="form-title">Register</p>
          <div className="form-group">
            <label className="label required" htmlFor="firstName">
              First Name
            </label>
            <input
              className="input"
              type="text"
              value={firstName}
              placeholder="Enter your first name..."
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="label required" htmlFor="lastName">
              Last Name
            </label>
            <input
              className="input"
              type="text"
              value={lastName}
              placeholder="Enter your last name..."
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="label required" htmlFor="email">
              Email
            </label>
            <input
              className="input"
              type="email"
              value={email}
              placeholder="Enter your email address..."
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="label required" htmlFor="password">
              Password
            </label>
            <input
              className="input"
              type="password"
              value={password}
              placeholder="Enter your password..."
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="label required" htmlFor="confirm-password">
              Confirm Password
            </label>
            <input
              className="input"
              type="password"
              value={confirmPassword}
              placeholder="Confirm your password..."
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button className="submit-button" type="submit" disabled={isLoading}>
            Register
          </button>
          {error && <p className="form-error">{error}</p>}
          <p className="form-link">
            Already have an account?{" "}
            <Link className="link" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
