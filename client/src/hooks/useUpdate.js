import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useUpdate = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const updateUser = async (email, newFirstName, newLastName, newEmail) => {
    setIsLoading(true);
    setError("");

    const response = await fetch(`/api/users/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, newFirstName, newLastName, newEmail }),
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
      setIsLoading(false);
      return;
    }
    if (response.ok) {
      setIsLoading(false);
      localStorage.setItem("user", JSON.stringify(data));
      dispatch({ type: "LOGIN", payload: data });
    }
  };
  return { updateUser, isLoading, error };
};
