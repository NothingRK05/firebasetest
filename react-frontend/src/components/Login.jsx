// src/Login.jsx
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.js";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../Auth.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    if (currentUser) {
        navigate("/dashboard");
    }

    const handleLogin = async () => {
        setError("");
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/dashboard");
        } catch (err) {
            setError("Invalid email or password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleLogin();
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-brand">Test</div>
                <h2 className="auth-title">Welcome back</h2>
                <p className="auth-subtitle">Sign in to your account to continue</p>
                <div className="auth-divider" />

                {error && <div className="auth-error">{error}</div>}

                <div className="auth-field">
                    <label className="auth-label">Email</label>
                    <input
                        className="auth-input"
                        placeholder="you@example.com"
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>

                <div className="auth-field">
                    <label className="auth-label">Password</label>
                    <input
                        className="auth-input"
                        placeholder="••••••••"
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>

                <button className="auth-btn" onClick={handleLogin} disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                </button>

                <div className="auth-footer">
                    <p>
                        Don't have an account? <Link to="/signup">Sign up</Link>
                    </p>
                    <Link to="/reset" className="auth-forgot">Forgot password?</Link>
                </div>
            </div>
        </div>
    );
}
