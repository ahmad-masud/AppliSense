import { createContext, useReducer, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

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

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.token) {
      const { exp } = jwtDecode(user.token);
      if (Date.now() >= exp * 1000) {
        localStorage.removeItem("user");
        dispatch({ type: "LOGOUT" });
      } else {
        dispatch({ type: "LOGIN", payload: user });

        const timeout = setTimeout(() => {
          localStorage.removeItem("user");
          dispatch({ type: "LOGOUT" });
        }, exp * 1000 - Date.now());

        return () => clearTimeout(timeout);
      }
    }

    setLoading(false);
  }, []);

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
