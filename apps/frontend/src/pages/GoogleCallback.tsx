import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.tsx";
import {jwtDecode} from "jwt-decode";

const GoogleCallback: React.FC = () => {
    const navigate = useNavigate();
    const { setAuthUser } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const role = params.get("role");
        const username = params.get("username");

        if (token && role && username) {
                // Decode JWT
                const decoded: any = jwtDecode(token);

                setAuthUser({
                    id: decoded.id,
                    name: decoded.username || "",   // username from token
                    email: decoded.email || "",     // email from token
                    role: (decoded.role || "customer").toLowerCase() as 'customer' | 'partner',
                    authProvider: 'google',
                    token,
                });
            navigate("/dashboard");
        }
    }, [setAuthUser, navigate]);

    return <div>Logging you in with Google...</div>;
};

export default GoogleCallback;
