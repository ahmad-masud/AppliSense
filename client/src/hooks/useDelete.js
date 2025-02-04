import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useVerificationCode } from "./useVerificationCode";

export const useDelete = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();
  const { sendCode, verifyCode } = useVerificationCode();

  const deleteUser = async (email) => {
    setIsLoading(true);
    setError("");

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
      `${process.env.REACT_APP_API_BASE_URL || "http://localhost:4000"}/users/delete`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
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
    dispatch({ type: "LOGOUT" });

    setIsLoading(false);
  };

  return { deleteUser, isLoading, error };
};
