import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAlerts } from "../hooks/useAlerts";

function VerifyEmail() {
  const { token } = useParams();
  const { addAlert } = useAlerts();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_BASE_URL || "http://localhost:4000"}/users/verifyEmail/${token}`,
          { method: "POST" }
        );

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Invalid verification link.");
        }

        setStatus("Verification successful! Redirecting...");
        addAlert("Email verified successfully.", "success");
        setTimeout(() => navigate("/login"), 2000);
      } catch (err) {
        setStatus(err.message);
        addAlert(err.message, "error");
      }
    };

    if (token) verify();
    else {
      setStatus("Missing token.");
      addAlert("Missing verification token.", "error");
    }
  }, [token, addAlert, navigate]);

  return (
    <div className="form-container">
      <div className="form-sub-container">
        <p className="form-message">{status}</p>
      </div>
    </div>
  );
}

export default VerifyEmail;
