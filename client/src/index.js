import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ApplicationsContextProvider } from "./context/ApplicationsContext";
import { AuthContextProvider } from "./context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <ApplicationsContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ApplicationsContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
