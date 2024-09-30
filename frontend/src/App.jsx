import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./routes/Login";
import LandingPage from "./routes/LandingPage";
import Services from "./routes/Services";
import ConsultClients from "./routes/ConsultClients";
import ConsultPets from "./routes/ConsultPets";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/services" element={<Services />} />
          <Route path="/consultclients" element={<ConsultClients />} />
          <Route path="/consultclients/pets" element={<ConsultPets />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
