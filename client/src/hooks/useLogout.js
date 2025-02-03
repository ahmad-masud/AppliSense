import { useAuthContext } from "./useAuthContext";
import { useApplicationsContext } from "./useApplicationsContext";

export const useLogout = () => {
  const { dispatch: authDispatch } = useAuthContext();
  const { dispatch: applicationsDispatch } = useApplicationsContext();

  const logout = () => {
    localStorage.removeItem("user");
    authDispatch({ type: "LOGOUT" });
    applicationsDispatch({ type: "CLEAR" });
  };

  return { logout };
};
