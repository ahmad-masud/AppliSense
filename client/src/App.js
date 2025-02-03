import "./styles/App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import ApplicationForm from "./pages/ApplicationForm";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import ChangePassword from "./pages/ChangePassword";
import NotFound from "./pages/NotFound";
import { useAuthContext } from "./hooks/useAuthContext";
import { AlertsProvider } from "./context/AlertsContext";
import Alerts from "./components/Alerts";

function App() {
  const { user } = useAuthContext();

  return (
    <div className="app">
      <AlertsProvider>
        <Alerts />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/application/create"
            element={user ? <ApplicationForm /> : <Navigate to="/login" />}
          />
          <Route
            path="/application/update/:id"
            element={user ? <ApplicationForm /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/dashboard" /> : <Register />}
          />
          <Route
            path="/account"
            element={user ? <Account /> : <Navigate to="/login" />}
          />
          <Route
            path="/changePassword"
            element={user ? <ChangePassword /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </AlertsProvider>
    </div>
  );
}

export default App;
