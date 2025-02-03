import { ApplicationsContext } from "../context/ApplicationsContext";
import { useContext } from "react";

export const useApplicationsContext = () => {
  const context = useContext(ApplicationsContext);

  if (!context) {
    throw new Error(
      "useApplicationsContext must be used within a ApplicationsProvider"
    );
  }

  return context;
};
