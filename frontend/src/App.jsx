import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./routes/Login";
import LandingPage from "./routes/LandingPage";
import Services from "./routes/Services";
import ConsultClients from "./routes/ConsultClients";
import ConsultPets from "./routes/ConsultPets";
import Owner from "./routes/Owner";
import Error from './routes/Error';
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
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
    </>
  );
}

export default App;
