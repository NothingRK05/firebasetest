// src/App.jsx
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import Signup from "./Signup";
import Login from "./Login";

export default function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        return onAuthStateChanged(auth, (u) => setUser(u));
    }, []);

    return (
        <div>
            {user ? (
                <>
                    <h2>Welcome {user.email}</h2>
                    <button onClick={() => signOut(auth)}>Logout</button>
                </>
            ) : (
                <>
                    <Signup />
                    <Login />
                </>
            )}
        </div>
    );
}
