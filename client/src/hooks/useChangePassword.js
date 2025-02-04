import { useState } from "react";
import { useVerificationCode } from "./useVerificationCode";

export const useChangePassword = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { sendCode, verifyCode } = useVerificationCode();

  const updatePassword = async (email, newPassword, confirmNewPassword) => {
    setIsLoading(true);
    setError("");
    setSuccess(false);

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    await sendCode(email);

    const verificationCode = prompt(
      `A verification code was sent to your email (${email}). Enter the code:`
    );

    if (!verificationCode) {
      setError("Verification code is required.");
      setIsLoading(false);
      return;
    }

    const isVerified = await verifyCode(email, verificationCode);

    if (!isVerified) {
      setError("Invalid verification code. Please try again.");
      setIsLoading(false);
      return;
    }

    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL || "http://localhost:4000"}/users/changePassword`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword }),
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
  };

  return { updatePassword, isLoading, error, success };
};
