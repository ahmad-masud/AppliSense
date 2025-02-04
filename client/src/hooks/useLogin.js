import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useVerificationCode } from "./useVerificationCode";

export const useLogin = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();
  const { sendCode, verifyCode } = useVerificationCode();

  const login = async (email, password) => {
    setIsLoading(true);
    setError("");

    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL || "http://localhost:4000"}/users/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );
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

  const loginWithOTP = async (email) => {
    setIsLoading(true);
    setError("");

    if (!email) {
      setError("Email is required to log in");
      setIsLoading(false);
      return;
    }

    const sent = await sendCode(email);

    if (!sent) {
      setError("Failed to send OTP. Please try again.");
      setIsLoading(false);
      return;
    }

    const otpCode = prompt(
      `A verification code was sent to ${email}. Enter the code`
    );

    if (!otpCode) {
      setError("OTP is required to log in.");
      setIsLoading(false);
      return;
    }

    const isVerified = await verifyCode(email, otpCode);

    if (!isVerified) {
      setError("Invalid OTP. Please try again.");
      setIsLoading(false);
      return;
    }

    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL || "http://localhost:4000"}/users/loginWithOTP`,
      {
        method: "POST",
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

    localStorage.setItem("user", JSON.stringify(data));
    dispatch({ type: "LOGIN", payload: data });

    setIsLoading(false);
  };

  return { login, loginWithOTP, isLoading, error };
};
