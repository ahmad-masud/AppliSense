import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useUpdate = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const updateUser = async (email, newFirstName, newLastName, newEmail) => {
    setIsLoading(true);
    setError("");
    setSuccess(false);

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
    if (response.ok) {
      setIsLoading(false);
      setSuccess(true);

      let userData = JSON.parse(localStorage.getItem("user")) || {};

      userData.firstName = data.firstName;
      userData.lastName = data.lastName;
      userData.email = data.email;

      localStorage.setItem("user", JSON.stringify(userData));

      dispatch({ type: "LOGIN", payload: userData });
    }
  };
  return { updateUser, isLoading, error, success };
};
