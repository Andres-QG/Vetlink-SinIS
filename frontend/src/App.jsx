import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AuthProvider from "./context/AuthContext";
import Login from "./routes/Login";
import LandingPage from "./routes/LandingPage";
import Services from "./routes/Services";
import ConsultClients from "./routes/ConsultClients";
import ConsultVets from "./routes/ConsultVets";
import ConsultPets from "./routes/ConsultPets";
import ConsultClinics from "./routes/ConsultClinics";
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

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/reset" element={<PassReset />} />
            <Route
              path="/check-reset"
              element={
                <ProtectedRoute requiredRole="reset">
                  <CheckCode />
                </ProtectedRoute>
              }
            />
            <Route
              path="/change-pass"
              element={
                <ProtectedRoute requiredRole="reset">
                  <ChangePass />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pass-success"
              element={
                <ProtectedRoute requiredRole="reset">
                  <PassSuccess />
                </ProtectedRoute>
              }
            />
            <Route path="/services" element={<Services />} />
            <Route path="/consultclients" element={<ConsultClients />} />
            <Route path="/consultAdmins" element={<ConsultAdmins />} />
            <Route path="/error" element={<Error />} />
            <Route path="*" element={<Error />} />
            <Route path="/consultpets" element={<ConsultPets />} />
            <Route path="/consultvets" element={<ConsultVets />} />
            <Route path="/consultclinics" element={<ConsultClinics />} />

            <Route
              path="/owner"
              element={
                <ProtectedRoute requiredRole="owner">
                  <Owner />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
