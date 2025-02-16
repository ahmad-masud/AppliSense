import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ApplicationsContextProvider } from "./context/ApplicationsContext";
import { AuthContextProvider } from "./context/AuthContext";
import { AlertsProvider } from "./context/AlertsContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ApplicationsContextProvider>
      <AuthContextProvider>
        <BrowserRouter>
          <AlertsProvider>
            <App />
          </AlertsProvider>
        </BrowserRouter>
      </AuthContextProvider>
    </ApplicationsContextProvider>
  </React.StrictMode>
);
