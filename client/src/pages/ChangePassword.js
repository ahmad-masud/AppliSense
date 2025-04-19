import "../styles/Form.css";
import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useAlerts } from "../hooks/useAlerts";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user } = useAuthContext();
  const { addAlert } = useAlerts();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Change Password | AppliSense";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL || "http://localhost:4000"}/users/changePassword`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ email: user.email, oldPassword, newPassword }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setSuccess(true);
    setNewPassword("");
    setConfirmNewPassword("");
  };

  useEffect(() => {
    if (success) {
      addAlert("Password updated successfully", "success");
    }
  }, [success, addAlert]);

  return (
    <div className="form-container">
      <div className="form-sub-container">
        <form className="form" onSubmit={handleSubmit}>
          <p className="form-title">Change Password</p>
          <div className="form-group">
            <label className="label required" htmlFor="oldPassword">
              Old Password
            </label>
            <input
              className="input"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="••••••••••••••••"
              required
            />
          </div>
          <div className="form-group">
            <label className="label required" htmlFor="newPassword">
              New Password
            </label>
            <input
              className="input"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••••••••••"
              required
            />
          </div>
          <div className="form-group">
            <label className="label required" htmlFor="confirmNewPassword">
              Confirm New Password
            </label>
            <input
              className="input"
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="••••••••••••••••"
              required
            />
          </div>
          <button className="submit-button" type="submit" disabled={isLoading}>
            Submit
          </button>
          <p>
            Forgot your password?{" "}
            <button className="link" onClick={() => navigate("/resetRequest")}>
              Reset Password
            </button>
          </p>
          {error && <p className="form-error">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
