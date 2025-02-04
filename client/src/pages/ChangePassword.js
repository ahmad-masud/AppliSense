import "../styles/Form.css";
import { useState, useEffect } from "react";
import { useChangePassword } from "../hooks/useChangePassword";
import { useAuthContext } from "../hooks/useAuthContext";
import { useAlerts } from "../hooks/useAlerts";

function ChangePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const { updatePassword, isLoading, error, success } = useChangePassword();
  const { user } = useAuthContext();
  const { addAlert } = useAlerts();

  useEffect(() => {
    document.title = "Change Password | AppliSense";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await updatePassword(user.email, newPassword, confirmNewPassword);

    setNewPassword("");
    setConfirmNewPassword("");
  };

  useEffect(() => {
    if (success) {
      addAlert("Password updated successfully", "success");
    }
  }, [success, addAlert]);

  return (
    <div className="second-form-container">
      <div className="form-sub-container">
        <form className="form" onSubmit={handleSubmit}>
          <p className="form-title">Change Password</p>
          <div className="form-group">
            <label className="label required" htmlFor="newPassword">
              New Password
            </label>
            <input
              className="input"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
              required
            />
          </div>
          <button className="submit-button" type="submit" disabled={isLoading}>
            Submit
          </button>
          {error && <p className="form-error">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
