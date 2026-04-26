import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

export default function ResetPassword() {
    const [email, setEmail] = useState("");

    const handleReset = async () => {
        try {
            await sendPasswordResetEmail(auth, email);
            alert("Password reset email sent!");
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            <input
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleReset}>Send Reset Email</button>
        </div>
    );
}