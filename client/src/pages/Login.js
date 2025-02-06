import "../styles/Form.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { useAlerts } from "../hooks/useAlerts";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loginWithOTP, error, isLoading } = useLogin();
  const { addAlert } = useAlerts();

  useEffect(() => {
    document.title = "Login | AppliSense";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await login(email, password);

    addAlert("Logged in successfully", "success");
  };

  const handleReset = async (e) => {
    e.preventDefault();

    await loginWithOTP(email);

    addAlert("Logged in successfully", "success");
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
            <button className="link" onClick={handleReset}>
              Login with OTP
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
