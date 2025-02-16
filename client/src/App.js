import "./styles/App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import Table from "./pages/Table";
import Statistics from "./pages/Statistics";
import ApplicationForm from "./pages/ApplicationForm";
import ApplicationPage from "./pages/ApplicationPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import ChangePassword from "./pages/ChangePassword";
import TermsOfService from "./pages/TermsOfServices";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import { useAuthContext } from "./hooks/useAuthContext";
import Alerts from "./components/Alerts";

function App() {
  const { user } = useAuthContext();

  if (user === undefined) return null;

  return (
    <div className="app">
      <Alerts />
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Home />} />
        <Route
          path="/table"
          element={user ? <Table /> : <Navigate to="/login" />}
        />
        <Route
          path="/statistics"
          element={user ? <Statistics /> : <Navigate to="/login" />}
        />
        <Route
          path="/application/:id"
          element={user ? <ApplicationPage /> : <Navigate to="/login" />}
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
          element={user ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <Register />}
        />
        <Route
          path="/account"
          element={user ? <Account /> : <Navigate to="/login" />}
        />
        <Route
          path="/changePassword"
          element={user ? <ChangePassword /> : <Navigate to="/login" />}
        />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
