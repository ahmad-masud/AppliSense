import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useDelete = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const deleteUser = async (email) => {
    setIsLoading(true);
    setError("");

    const response = await fetch(`/api/users/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
      setIsLoading(false);
      return;
    }
    if (response.ok) {
      localStorage.removeItem("user");
      dispatch({ type: "LOGOUT" });
      setIsLoading(false);
    }
  };
  return { deleteUser, isLoading, error };
};
