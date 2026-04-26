import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export default function Dashboard() {
    const handleLogout = () => {
        signOut(auth);
    };

    return (
        <div>
            <h2>Dashboard</h2>
            <p>Welcome, {auth.currentUser?.email}</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}