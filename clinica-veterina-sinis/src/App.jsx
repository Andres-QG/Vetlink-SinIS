import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './routes/Login'
import LandingPage from './routes/LandingPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
