import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import BrowseProfiles from "./pages/BrowseProfiles";
import Matches from "./pages/Matches";
import Consultants from "./pages/Consultants";
import Notifications from "./pages/Notifications";
import Chat from "./pages/Chat";

import AdminDashboard from "./pages/AdminDashboard";
import ConsultantDashboard from "./pages/ConsultantDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* USER ROUTES */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/browse"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <BrowseProfiles />
            </ProtectedRoute>
          }
        />

        <Route
          path="/matches"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Matches />
            </ProtectedRoute>
          }
        />

        <Route
          path="/consultants"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Consultants />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Notifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Chat />
            </ProtectedRoute>
          }
        />

        {/* ADMIN ROUTE */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* CONSULTANT / SERVICE PROVIDER ROUTE */}

        <Route
          path="/consultant-dashboard"
          element={
            <ProtectedRoute
              allowedRoles={[
                "consultant",
                "service_provider",
              ]}
            >
              <ConsultantDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;