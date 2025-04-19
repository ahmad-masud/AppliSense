import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAlerts } from "../hooks/useAlerts";
import { useAuthContext } from "../hooks/useAuthContext";

function VerifyNewEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { addAlert } = useAlerts();
  const { dispatch } = useAuthContext();
  const [status, setStatus] = useState("Verifying new email...");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_BASE_URL || "http://localhost:4000"}/users/verifyNewEmail/${token}`,
          { 
            method: "POST", 
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            }
          }
        );

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Verification failed.");

        // Update localStorage + context with new token + user info
        localStorage.setItem("user", JSON.stringify(data));
        dispatch({ type: "LOGIN", payload: data });

        setStatus("Email updated successfully! Redirecting...");
        addAlert("Email updated successfully.", "success");
        setTimeout(() => navigate("/account"), 2000);
      } catch (err) {
        setStatus(err.message);
        addAlert(err.message, "error");
      }
    };

    if (token) verify();
    else {
      const msg = "Missing verification token.";
      setStatus(msg);
      addAlert(msg, "error");
    }
  }, [token, addAlert, dispatch, navigate]);

  return (
    <div className="form-container">
      <div className="form-sub-container">
        <p className="form-message">{status}</p>
      </div>
    </div>
  );
}

export default VerifyNewEmail;
