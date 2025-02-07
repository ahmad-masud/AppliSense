import { createContext, useReducer } from "react";

export const ApplicationsContext = createContext();

export const applicationsReducer = (state, action) => {
  switch (action.type) {
    case "GET_APPLICATIONS":
      return {
        ...state,
        applications: action.payload.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        ),
      };
    case "CREATE_APPLICATION":
      return {
        ...state,
        applications: [...state.applications, action.payload].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        ),
      };
    case "DELETE_APPLICATION":
      return {
        ...state,
        applications: state.applications.filter(
          (application) => application._id !== action.payload
        ),
      };
    case "DELETE_APPLICATIONS":
      return {
        ...state,
        applications: state.applications.filter(
          (application) => !action.payload.includes(application._id)
        ),
      };
    case "UPDATE_APPLICATION":
      return {
        ...state,
        applications: state.applications
          .map((application) =>
            application._id === action.payload._id
              ? action.payload
              : application
          )
          .sort((a, b) => new Date(a.date) - new Date(b.date)),
      };
    case "CLEAR":
      return {
        ...state,
        applications: [],
      };
    default:
      return state;
  }
};

export const ApplicationsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(applicationsReducer, {
    applications: [],
  });

  return (
    <ApplicationsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ApplicationsContext.Provider>
  );
};
