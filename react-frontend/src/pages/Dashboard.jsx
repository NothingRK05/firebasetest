import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { updateProfile } from "firebase/auth";

export default function Dashboard() {
    const { currentUser } = useAuth();

    const handleSetUsername = async () => {
        const name = prompt("Enter a username:");
        if (name) {
            try {
                await updateProfile(auth.currentUser, { displayName: name });
                window.location.reload();
            } catch (err) {
                console.error(err);
                alert(err.message);
            }
        }
    };

    return (
        <div style={{ padding: 40 }}>
            <h1>Dashboard</h1>
            <p>Welcome, {currentUser?.displayName || currentUser?.email}!</p>
            <p>Welcome to the dashboard! This is a protected route that only authenticated users can access.</p>   

            <p>Change username:</p> 
            <button onClick={handleSetUsername}>Set Username</button>
            
        </div>
    );
}