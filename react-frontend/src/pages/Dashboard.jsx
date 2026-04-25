// src/pages/Dashboard.jsx
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
    const { user, logout } = useContext(AuthContext);

    return (
        <div style={{ padding: 40 }}>
            <h1>Dashboard</h1>
            <p>You are logged in as: {user?.email}</p>

            <button onClick={logout}>Logout</button>
        </div>
    );
}
