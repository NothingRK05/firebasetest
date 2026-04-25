// src/pages/Home.jsx
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div style={{ padding: 40 }}>
            <h1>Welcome</h1>
            <p>This is the public home page.</p>

            <Link to="/login">Login</Link>
            <br />
            <Link to="/signup">Create Account</Link>
        </div>
    );
}
