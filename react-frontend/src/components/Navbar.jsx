import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const profileRef = useRef(null);
  const { currentUser: user } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSignOut() {
    setDropdownOpen(false);
    try {
      await signOut(auth);
      navigate("/"); // redirect after sign out
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  }

  function handleSettings() {
    setDropdownOpen(false);
    // TODO: navigate to settings page
  }

  return (
    <nav className="navbar">
      {/* Logo */}
      <span className="navbar-logo" onClick={() => navigate("/dashboard")}>
        Test
      </span>

      {/* Profile - only shows when logged in */}
      {user && (
        <div className="navbar-profile" ref={profileRef}>
          <button
            className="profile-icon"
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-label="Profile menu"
          >
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="profile-avatar"
              />
            ) : (
              user.displayName
                ? user.displayName[0].toUpperCase()
                : user.email[0].toUpperCase() // ← use email initial as fallback
            )}
          </button>

          {dropdownOpen && (
            <div className="profile-dropdown">
              <div className="profile-dropdown-header">
                <span className="profile-username">
                  {user.displayName || user.email}
                </span>
              </div>
              <button onClick={handleSettings}>
                <span className="dropdown-icon">⚙️</span> Settings
              </button>
              <button onClick={handleSignOut}>
                <span className="dropdown-icon">🚪</span> Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}