import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AuthProvider from './context/AuthContext';
import Login from "./routes/Login";
import LandingPage from "./routes/LandingPage";
import Services from "./routes/Services";
import ConsultClients from "./routes/ConsultClients";
import ConsultPets from "./routes/ConsultPets";
import { PassReset, CheckCode, ChangePass, PassSuccess } from "./routes/PassReset";
import Owner from "./routes/Owner";
import Error from './routes/Error';
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset" element={<PassReset />} />
            <Route
              path="/check-reset"
              element={
                <ProtectedRoute requiredRole="reset">
                  <CheckCode/>
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
            <Route path="/error" element={<Error />} />
            <Route path="*" element={<Error />} />
            <Route path="/consultpets" element={<ConsultPets />} />
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