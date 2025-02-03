import { useState } from "react";

export const useChangePassword = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const updatePassword = async (
    email,
    currentPassword,
    newPassword,
    confirmNewPassword
  ) => {
    setIsLoading(true);
    setError("");

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (newPassword === currentPassword) {
      setError("New password must be different");
      setIsLoading(false);
      return;
    }

    const response = await fetch(`/api/users/changePassword`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, currentPassword, newPassword }),
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
      setIsLoading(false);
      return;
    }
    if (response.ok) {
      setIsLoading(false);
      alert("Password changed successfully!");
    }
  };
  return { updatePassword, isLoading, error };
};
