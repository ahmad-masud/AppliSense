import "../styles/Form.css";
import { useState, useEffect } from "react";
import { useUpdate } from "../hooks/useUpdate";
import { useDelete } from "../hooks/useDelete";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAlerts } from "../hooks/useAlerts";

function Account() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [oldEmail, setOldEmail] = useState("");
  const [email, setEmail] = useState("");
  const { updateUser, isLoading, error, success } = useUpdate();
  const { deleteUser } = useDelete();
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const navigate = useNavigate();
  const { addAlert } = useAlerts();

  useEffect(() => {
    document.title = "Account | AppliSense";

    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setOldEmail(user.email);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await updateUser(oldEmail, firstName, lastName, email);

    if (!error) {
      setOldEmail(email);
    }
  };

  useEffect(() => {
    if (success) {
      addAlert("Account updated successfully", "success");
    }
  }, [success, addAlert]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your account?"))
      await deleteUser(email);
    addAlert("Account deleted successfully", "success");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    addAlert("Logged out successfully", "success");
  };

  return (
    <div className="second-form-container">
      <div className="form-sub-container">
        <form className="form" onSubmit={handleSubmit}>
          <p className="form-title">Account Management</p>
          <div className="form-group">
            <label className="label" htmlFor="firstName">
              First Name
            </label>
            <input
              className="input"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="label" htmlFor="lastName">
              Last Name
            </label>
            <input
              className="input"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <button
              className="submit-button"
              type="submit"
              disabled={isLoading}
            >
              Update Account
            </button>
          </div>
          <div className="form-buttons">
            <Link to="/changePassword" className="password-button">
              Change Password
            </Link>
            <button
              className="logout-button"
              type="button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
          <div className="form-group">
            <button
              className="delete-button"
              type="button"
              onClick={handleDelete}
            >
              Delete Account
            </button>
          </div>
          {error && <p className="form-error">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default Account;
