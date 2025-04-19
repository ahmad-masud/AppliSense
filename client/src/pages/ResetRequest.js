import "../styles/Form.css";
import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

function ResetRequest() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthContext();

  useEffect(() => {
    document.title = "Reset Password | AppliSense";

    if (user) {
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL || "http://localhost:4000"}/users/requestPasswordReset`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
    } else {
      setMessage("Reset link sent. Check your email.");
    }

    setIsLoading(false);
  };

  return (
    <div className="form-container">
      <div className="form-sub-container">
        <form className="form" onSubmit={handleSubmit}>
          <p className="form-title">Reset Password</p>
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
          <button className="submit-button" type="submit" disabled={isLoading}>
            Send Reset Link
          </button>
          {error && <p className="form-error">{error}</p>}
          {message && <p className="form-success">{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default ResetRequest;
