// src/Signup.jsx
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase.js";
import { Link, useNavigate } from "react-router-dom";
import "../Auth.css";

export default function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async () => {
        setError("");
        if (!username.trim()) {
            setError("Please enter a username.");
            return;
        }
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, {
                displayName: username,
            });
            navigate("/dashboard");
        } catch (err) {
            setError(err.message.replace("Firebase: ", ""));
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSignup();
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-brand">Test</div>
                <h2 className="auth-title">Create an account</h2>
                <p className="auth-subtitle">Get started</p>
                <div className="auth-divider" />

                {error && <div className="auth-error">{error}</div>}

                <div className="auth-field">
                    <label className="auth-label">Username</label>
                    <input
                        className="auth-input"
                        placeholder="username123"
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>

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

                <button className="auth-btn" onClick={handleSignup} disabled={loading}>
                    {loading ? "Creating account..." : "Create Account"}
                </button>

                <div className="auth-footer">
                    <p>
                        Already have an account? <Link to="/login">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
