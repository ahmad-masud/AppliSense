import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useRegister = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

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

    const response = await fetch(`/api/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
      setIsLoading(false);
      return;
    }
    if (response.ok) {
      localStorage.setItem("user", JSON.stringify(data));
      dispatch({ type: "LOGIN", payload: data });
      setIsLoading(false);
    }
  };
  return { register, isLoading, error };
};
