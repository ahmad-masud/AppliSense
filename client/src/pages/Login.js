import "../styles/Form.css";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login | AppliSense";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL || "http://localhost:4000"}/users/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );
    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
      setIsLoading(false);
      return;
    }

    localStorage.setItem("user", JSON.stringify(data));
    dispatch({ type: "LOGIN", payload: data });
    setIsLoading(false);
  };

  return (
    <div className="form-container">
      <div className="form-sub-container">
        <form className="form" onSubmit={handleSubmit}>
          <p className="form-title">Login</p>
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
          <button className="submit-button" type="submit" disabled={isLoading}>
            Login
          </button>
          {error && <p className="form-error">{error}</p>}
          <p>
            Need an account?{" "}
            <Link className="link" to="/register">
              Register
            </Link>
          </p>
          <p>
            Forgot your password?{" "}
            <button className="link" onClick={() => navigate("/resetRequest")}>
              Reset Password
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
