import "../styles/Form.css";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(null);
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Set New Password | AppliSense";

    if (!token) {
      setTokenValid(false);
      setError("Invalid or missing token.");
      return;
    }

    const validateToken = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_BASE_URL || "http://localhost:4000"}/users/validateResetToken/${token}`
        );
        const data = await res.json();
        setTokenValid(res.ok);
        if (!res.ok) setError(data.error || "Invalid or expired token.");
      } catch (err) {
        setTokenValid(false);
        setError("Something went wrong while validating the token.");
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL || "http://localhost:4000"}/users/resetPassword/${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
    } else {
      setMessage("Password updated successfully.");
      setTimeout(() => navigate("/login"), 2000);
    }

    setIsLoading(false);
  };

  return (
    <div className="form-container">
      <div className="form-sub-container">
        <form className="form" onSubmit={handleSubmit}>
          <p className="form-title">Set New Password</p>
          <div className="form-group">
            <label className="label required" htmlFor="newPassword">New Password</label>
            <input
              className="input"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={isLoading || !tokenValid}
              placeholder="••••••••••••••••"
            />
          </div>
          <div className="form-group">
            <label className="label required" htmlFor="confirmPassword">Confirm Password</label>
            <input
              className="input"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading || !tokenValid}
              placeholder="••••••••••••••••"
            />
          </div>
          <button className="submit-button" type="submit" disabled={isLoading || !tokenValid}>
            Reset Password
          </button>
          {error && <p className="form-error">{error}</p>}
          {message && <p className="form-success">{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
