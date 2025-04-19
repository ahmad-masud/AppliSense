import "../styles/Form.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "Register | AppliSense";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    const response = await fetch("http://localhost:4000/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
      setIsLoading(false);
      return;
    }

    setMessage("Verification email sent. Please check your inbox.");
    setIsLoading(false);
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
              placeholder="First Name"
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
              placeholder="Last Name"
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
              placeholder="Email Address"
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
              placeholder="Password"
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
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button className="submit-button" type="submit" disabled={isLoading}>
            Register
          </button>
          {error && <p className="form-error">{error}</p>}
          {message && <p className="form-success">{message}</p>}
          <p className="form-link">
            Already have an account?{" "}
            <Link className="link" to="/login">
              Login
            </Link>
          </p>
          <p className="form-link">
            By making an account you agree to our{" "}
            <Link className="link" to="/terms">
              Terms of Service
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
