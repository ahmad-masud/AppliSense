import { createContext, useReducer, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useApplicationsContext } from "../hooks/useApplicationsContext";

export const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: null });
  const [loading, setLoading] = useState(true);
  const { applicationsDispatch } = useApplicationsContext();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.token) {
      const { exp } = jwtDecode(user.token);
      if (Date.now() >= exp * 1000) {
        localStorage.removeItem("user");
        dispatch({ type: "LOGOUT" });
        applicationsDispatch({ type: "CLEAR" });
      } else {
        dispatch({ type: "LOGIN", payload: user });
      }
    }

    setLoading(false);
  }, [applicationsDispatch]);

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
