import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./SubNav.css";

const TABS = [
  { label: "Blank 1", path: "/blank1" },
  { label: "Blank 2", path: "/blank2" },
  { label: "Blank 3", path: "/blank3" },
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
