import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AuthProvider from "./context/AuthContext";
import Login from "./routes/Login";
import LandingPage from "./routes/LandingPage";
import Services from "./routes/Services";
import ConsultClients from "./routes/ConsultClients";
import ConsultVets from "./routes/ConsultVets";
import ConsultPets from "./routes/ConsultPets";
import {
  PassReset,
  CheckCode,
  ChangePass,
  PassSuccess,
} from "./routes/PassReset";
import Owner from "./routes/Owner";
import Error from "./routes/Error";
import ProtectedRoute from "./components/ProtectedRoute";
import Signup from "./routes/Signup";
import ConsultAdmins from "./routes/ConsultAdmins";
import { NotificationProvider } from "./components/Notification";

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/services" element={<Services />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/reset" element={<PassReset />} />
            <Route
              path="/check-reset"
              element={
                <ProtectedRoute requiredRoles={[5]}>
                  <CheckCode />
                </ProtectedRoute>
              }
            />
            <Route
              path="/change-pass"
              element={
                <ProtectedRoute requiredRoles={[5]}>
                  <ChangePass />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pass-success"
              element={
                <ProtectedRoute requiredRoles={[5]}>
                  <PassSuccess />
                </ProtectedRoute>
              }
            />

            <Route
              path="/consultclients"
              element={
                <ProtectedRoute requiredRoles={[1, 2, 3]}>
                  <ConsultClients />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner"
              element={
                <ProtectedRoute requiredRoles={[1]}>
                  <Owner />
                </ProtectedRoute>
              }
            />
            <Route
              path="/consultpets"
              element={
                <ProtectedRoute requiredRoles={[1, 2, 3]}>
                  <NotificationProvider>
                    <ConsultPets />
                  </NotificationProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/consultvets"
              element={
                <ProtectedRoute requiredRoles={[1, 2]}>
                  <ConsultVets />
                </ProtectedRoute>
              }
            />
            <Route
              path="/consultAdmins"
              element={
                <ProtectedRoute requiredRoles={[1]}>
                  <ConsultAdmins />
                </ProtectedRoute>
              }
            />
            <Route path="/error" element={<Error />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
