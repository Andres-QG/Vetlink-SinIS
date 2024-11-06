import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AuthProvider from "./context/AuthContext";
import Login from "./routes/Login";
import LandingPage from "./routes/LandingPage";
import Services from "./routes/Services";
import ConsultClients from "./routes/ConsultClients";
import ConsultVets from "./routes/ConsultVets";
import ConsultPets from "./routes/ConsultPets";
import ConsultRecords from "./routes/ConsultRecords";
import ConsultServices from "./routes/ConsultServices";
import Profile from "./routes/Profile";
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
import ConsultSchedules from "./routes/ConsultSchedules";
import ConsultMyPets from "./routes/ConsultMyPets";
import DashBoardLayout from "./components/DashBoardLayout";
import Dashboard from "./routes/Dashboard";
import { NotificationProvider } from "./components/Notification";
import ConsultCitas from "./routes/ConsultCitas";

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Landing Page, Services, Login */}
            <Route
              path="/"
              element={
                <DashBoardLayout hideSidebar={true} padding="0px" margin="0px">
                  <LandingPage />
                </DashBoardLayout>
              }
            />
            <Route
              path="/services"
              element={
                <DashBoardLayout hideSidebar={true} padding="0px" margin="0px">
                  <Services />
                </DashBoardLayout>
              }
            />
            <Route
              path="/login"
              element={
                <DashBoardLayout hideSidebar={true} padding="0px" margin="0px">
                  <Login />
                </DashBoardLayout>
              }
            />
            <Route
              path="/signup"
              element={
                <DashBoardLayout hideSidebar={true} padding="0px" margin="0px">
                  <NotificationProvider>
                    <Signup />
                  </NotificationProvider>
                </DashBoardLayout>
              }
            />
            <Route
              path="/reset"
              element={
                <DashBoardLayout hideSidebar={true} padding="0px" margin="0px">
                  <PassReset />
                </DashBoardLayout>
              }
            />
            <Route
              path="/check-reset"
              element={
                <DashBoardLayout hideSidebar={true} padding="0px" margin="0px">
                  <ProtectedRoute requiredRoles={[5]}>
                    <CheckCode />
                  </ProtectedRoute>
                </DashBoardLayout>
              }
            />
            <Route
              path="/change-pass"
              element={
                <DashBoardLayout hideSidebar={true} padding="0px" margin="0px">
                  <ProtectedRoute requiredRoles={[5]}>
                    <ChangePass />
                  </ProtectedRoute>
                </DashBoardLayout>
              }
            />
            <Route
              path="/pass-success"
              element={
                <DashBoardLayout hideSidebar={true} padding="0px" margin="0px">
                  <ProtectedRoute requiredRoles={[5]}>
                    <PassSuccess />
                  </ProtectedRoute>
                </DashBoardLayout>
              }
            />

            {/* Consult Pages */}
            <Route
              path="/dashboard"
              element={
                <DashBoardLayout>
                  <ProtectedRoute requiredRoles={[1, 2, 3, 4]}>
                    <Dashboard />
                  </ProtectedRoute>
                </DashBoardLayout>
              }
            />

            {/* consult Services */}
            <Route
              path="/consultServices"
              element={
                <DashBoardLayout>
                  <NotificationProvider>
                    <ProtectedRoute requiredRoles={[1, 2]}>
                      <ConsultServices />
                    </ProtectedRoute>
                  </NotificationProvider>
                </DashBoardLayout>
              }
            />

            {/* Consult Pages */}
            <Route
              path="/consultSchedules"
              element={
                <DashBoardLayout>
                  <ProtectedRoute requiredRoles={[1, 2, 3]}>
                    <NotificationProvider>
                      <ConsultSchedules />
                    </NotificationProvider>
                  </ProtectedRoute>
                </DashBoardLayout>
              }
            />
            <Route
              path="/consultMyPets"
              element={
                <DashBoardLayout>
                  <ProtectedRoute requiredRoles={[4]}>
                    <NotificationProvider>
                      <ConsultMyPets />
                    </NotificationProvider>
                  </ProtectedRoute>
                </DashBoardLayout>
              }
            />
            <Route
              path="/consultclients"
              element={
                <DashBoardLayout>
                  <NotificationProvider>
                    <ProtectedRoute requiredRoles={[1, 2, 3]}>
                      <ConsultClients />
                    </ProtectedRoute>
                  </NotificationProvider>
                </DashBoardLayout>
              }
            />
            <Route
              path="/consultpets"
              element={
                <DashBoardLayout>
                  <ProtectedRoute requiredRoles={[1, 2, 3]}>
                    <NotificationProvider>
                      <ConsultPets />
                    </NotificationProvider>
                  </ProtectedRoute>
                </DashBoardLayout>
              }
            />
            <Route
              path="/consultrecords"
              element={
                <DashBoardLayout>
                  <ProtectedRoute requiredRoles={[1, 2, 3]}>
                    <NotificationProvider>
                      <ConsultRecords />
                    </NotificationProvider>
                  </ProtectedRoute>
                </DashBoardLayout>
              }
            />
            <Route
              path="/consultvets"
              element={
                <DashBoardLayout>
                  <NotificationProvider>
                    <ProtectedRoute requiredRoles={[1, 2]}>
                      <ConsultVets />
                    </ProtectedRoute>
                  </NotificationProvider>
                </DashBoardLayout>
              }
            />
            <Route
              path="/consultAdmins"
              element={
                <DashBoardLayout>
                  <NotificationProvider>
                    <ProtectedRoute requiredRoles={[1]}>
                      <ConsultAdmins />
                    </ProtectedRoute>
                  </NotificationProvider>
                </DashBoardLayout>
              }
            />

            {/* Owner Page */}
            <Route
              path="/clinics"
              element={
                <DashBoardLayout>
                  <ProtectedRoute requiredRoles={[1]}>
                    <NotificationProvider>
                      <Owner />
                    </NotificationProvider>
                  </ProtectedRoute>
                </DashBoardLayout>
              }
            />
            <Route
              path="/appointments"
              element={
                <DashBoardLayout>
                  <ProtectedRoute requiredRoles={[1, 2, 3, 4]}>
                    <NotificationProvider>
                      <ConsultCitas />
                    </NotificationProvider>
                  </ProtectedRoute>
                </DashBoardLayout>
              }
            />

            {/*Profile page*/}
            <Route
              path="/profile"
              element={
                <DashBoardLayout hideSidebar={true} padding="0px" margin="0px">
                  <NotificationProvider>
                    <ProtectedRoute requiredRoles={[4]}>
                      <Profile />
                    </ProtectedRoute>
                  </NotificationProvider>
                </DashBoardLayout>
              }
            />

            {/* Error Page */}
            <Route
              path="/error"
              element={
                <DashBoardLayout hideSidebar={true} padding="0px" margin="0px">
                  <Error />
                </DashBoardLayout>
              }
            />
            <Route
              path="*"
              element={
                <DashBoardLayout hideSidebar={true} padding="0px" margin="0px">
                  <Error />
                </DashBoardLayout>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
