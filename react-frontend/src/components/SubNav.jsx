import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./SubNav.css";

const TABS = [
  { label: "Trips", path: "/trips" },
  { label: "Essentials", path: "/essentials" },
  { label: "Events", path: "/events" },
];

export default function SubNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser: user } = useAuth();

  // Only show when logged in
  if (!user) return null;

  return (
    <div className="subnav">
      {TABS.map((tab) => (
        <button
          key={tab.path}
          className={`subnav-tab ${location.pathname === tab.path ? "active" : ""}`}
          onClick={() => navigate(tab.path)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
