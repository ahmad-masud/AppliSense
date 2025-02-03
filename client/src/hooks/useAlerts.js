import { AlertsContext } from "../context/AlertsContext";
import { useContext } from "react";

export const useAlerts = () => {
  const context = useContext(AlertsContext);

  if (!context) {
    throw new Error("useAlerts must be used within an AuthProvider");
  }

  return context;
};
