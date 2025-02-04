import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useVerificationCode } from "./useVerificationCode";

export const useRegister = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();
  const {
    sendCode,
    verifyCode,
    isCodeSent,
    isLoading: isVerifying,
    error: verificationError,
  } = useVerificationCode();

  const register = async (
    firstName,
    lastName,
    email,
    password,
    confirmPassword
  ) => {
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    await sendCode(email);

    if (!isCodeSent) {
      setError("Failed to send verification code. Try again.");
      setIsLoading(false);
      return;
    }

    const verificationCode = prompt(
      "Enter the 6-digit verification code sent to your email"
    );

    if (!verificationCode) {
      setError("Verification code is required to complete registration.");
      setIsLoading(false);
      return;
    }

    const isVerified = await verifyCode(email, verificationCode);

    if (!isVerified) {
      setError("Invalid verification code. Please try again.");
      setIsLoading(false);
      return;
    }

    const response = await fetch("http://localhost:4000/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
      setIsLoading(false);
      return;
    }

    localStorage.setItem("user", JSON.stringify(data));
    dispatch({ type: "LOGIN", payload: data });

    setIsLoading(false);
  };

  return {
    register,
    isLoading: isLoading || isVerifying,
    error: error || verificationError,
  };
};
