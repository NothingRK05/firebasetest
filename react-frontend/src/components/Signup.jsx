// src/Signup.jsx
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.js";
import { Link } from "react-router-dom";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert("Account created!");
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input
                placeholder="Password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleSignup}>Create Account</button>
            <p>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
}
