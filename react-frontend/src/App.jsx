import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import ResetPassword from "./components/ResetPassword.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import Home from "./pages/Home.jsx";

import ProtectedRoute from "./routes/ProtectedRoute.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset" element={<ResetPassword />} />

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
  );
}
