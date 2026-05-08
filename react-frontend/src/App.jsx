import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TripProvider } from "./context/TripContext";

import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import ResetPassword from "./components/ResetPassword.jsx";
import Navbar from "./components/Navbar";
import SubNav from "./components/SubNav";

import Dashboard from "./pages/Dashboard.jsx";
import Home from "./pages/Home.jsx";
import Trips from "./pages/Trips";
import Essentials from "./pages/Essentials";
import Events from "./pages/Events";

import ProtectedRoute from "./routes/ProtectedRoute.jsx";

export default function App() {
  return (
    <AuthProvider>
    <TripProvider>
    <BrowserRouter>
      <Navbar />
      <SubNav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/trips" element={<ProtectedRoute><Trips /></ProtectedRoute>} />
        <Route path="/essentials" element={<ProtectedRoute><Essentials /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
    </TripProvider>
    </AuthProvider>
  );
}
