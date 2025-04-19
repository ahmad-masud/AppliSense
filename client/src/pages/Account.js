import "../styles/Form.css";
import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useApplicationsContext } from "../hooks/useApplicationsContext";
import { useAlerts } from "../hooks/useAlerts";

function Account() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [oldEmail, setOldEmail] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { user, dispatch: authDispatch } = useAuthContext();
  const { dispatch: applicationsDispatch } = useApplicationsContext();
  const { addAlert } = useAlerts();
  const navigate = useNavigate();

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
    setIsLoading(true);
    setError("");
    setSuccess(false);

    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL || "http://localhost:4000"}/users/update`,
      {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({
          email: oldEmail,
          newFirstName: firstName,
          newLastName: lastName,
          newEmail: email,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
      setIsLoading(false);
      return;
    }

    const updatedUser = {
      ...user,
      firstName: data.firstName,
      lastName: data.lastName,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    authDispatch({ type: "LOGIN", payload: updatedUser });

    setMessage(data.message);
    setIsLoading(false);
    setSuccess(true);
    setOldEmail(email);
  };

  useEffect(() => {
    if (success) {
      addAlert("Account updated successfully", "success");
    }
  }, [success, addAlert]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account?"))
      return;

    setIsLoading(true);
    setError("");

    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL || "http://localhost:4000"}/users/delete`,
      {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({ email }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
      setIsLoading(false);
      return;
    }

    localStorage.removeItem("user");
    authDispatch({ type: "LOGOUT" });

    setIsLoading(false);
    navigate("/register");
    addAlert("Account deleted successfully", "success");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    authDispatch({ type: "LOGOUT" });
    applicationsDispatch({ type: "CLEAR" });
    navigate("/login");
    addAlert("Logged out successfully", "success");
  };

  return (
    <div className="form-container">
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
          {message && <p className="form-message">{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default Account;
