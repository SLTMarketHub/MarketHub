import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext.tsx";

interface GoogleUser {
    email: string;
    name: string;
}

const GoogleSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { setAuthUser } = useAuth();

    const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const needRole = params.get("needRole");
        const email = params.get("email");
        const name = params.get("name");
        const token = params.get("token");
        const role = params.get("role");

        if (token && role) {
            // Existing user → login success
            const payload = JSON.parse(atob(token.split(".")[1]));
            const user = {
                _id: payload.id,
                email: payload.email,
                role,
                username: payload.username || "",
            };

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            setAuthUser(user);

            if (role.toLowerCase() === "partner") {
                navigate("/partner");
            } else if (role.toLowerCase() === "customer") {
                navigate("/dashboard");
            } else if (role.toLowerCase() === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }

        } else if (needRole && email) {
            setGoogleUser({ email, name: name || "" });
        } else {
            navigate("/login");
        }
    }, [location, navigate, setAuthUser]);

    // complete signup with selected role
    const completeGoogleSignup = async (role: string) => {
        if (!googleUser) return;
        try {
            setLoading(true);
            const res = await axios.post("http://localhost:3050/api/auth/google/complete-signup", {
                email: googleUser.email,
                name: googleUser.name,
                role,
            });

            navigate('/login')
        } catch (err) {
            console.error("Google signup failed", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            {googleUser ? (
                <div className="bg-white p-6 rounded-2xl shadow-md text-center w-96">
                    <h2 className="text-xl font-semibold mb-4">Welcome, {googleUser.name} 👋</h2>
                    <p className="mb-4">Choose your role to complete signup:</p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => completeGoogleSignup("Admin")}
                            disabled={loading}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                        >
                            Admin
                        </button>
                        <button
                            onClick={() => completeGoogleSignup("Partner")}
                            disabled={loading}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                        >
                            Partner
                        </button>
                        <button
                            onClick={() => completeGoogleSignup("Customer")}
                            disabled={loading}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                        >
                            Customer
                        </button>
                    </div>
                </div>
            ) : (
                <p className="text-gray-600">Processing Google login...</p>
            )}
        </div>
    );
};

export default GoogleSuccess;

