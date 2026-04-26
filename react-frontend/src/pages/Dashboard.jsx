import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Dashboard() {
    const { currentUser } = useAuth();

    return (
        <div style={{ padding: 40 }}>
            <h1>Dashboard</h1>
            <p>You are logged in as: {currentUser?.email}</p>

            <button onClick={() => signOut(auth)}>Logout</button>
        </div>
    );
}