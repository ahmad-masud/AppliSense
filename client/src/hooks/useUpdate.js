import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useVerificationCode } from "./useVerificationCode";

export const useUpdate = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();
  const { sendCode, verifyCode } = useVerificationCode();

  const updateUser = async (email, newFirstName, newLastName, newEmail) => {
    setIsLoading(true);
    setError("");
    setSuccess(false);

    let oldEmailVerified = true;
    let newEmailVerified = true;

    if (newEmail && newEmail !== email) {
      oldEmailVerified = false;
      newEmailVerified = false;

      await sendCode(email);
      await sendCode(newEmail);

      const oldEmailCode = prompt(
        `A verification code was sent to your old email (${email}). Enter the code`
      );
      const newEmailCode = prompt(
        `A verification code was sent to your new email (${newEmail}). Enter the code`
      );

      oldEmailVerified = await verifyCode(email, oldEmailCode);
      newEmailVerified = await verifyCode(newEmail, newEmailCode);

      if (!oldEmailVerified || !newEmailVerified) {
        setError(
          "One or both email verification codes are incorrect. Please try again."
        );
        setIsLoading(false);
        return;
      }
    }

    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL || "http://localhost:4000"}/users/update`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newFirstName, newLastName, newEmail }),
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

    let userData = JSON.parse(localStorage.getItem("user")) || {};
    userData.firstName = data.firstName;
    userData.lastName = data.lastName;
    userData.email = data.email;

    localStorage.setItem("user", JSON.stringify(userData));
    dispatch({ type: "LOGIN", payload: userData });
  };

  return { updateUser, isLoading, error, success };
};
