import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

type Role = "Customer" | "Partner" | "Admin";

const CompleteSignupPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const initialEmail = searchParams.get("email") || "";
    const initialUsername = searchParams.get("username") || "";
    const initialpw = searchParams.get("password") || "";
    const initialRole = searchParams.get("role") || "";
    const googleToken = searchParams.get("token") || "";
    const fromGoogle = !!googleToken;
    const [countdown, setCountdown] = useState<number>(0);

    const [step, setStep] = useState<"FORM" | "OTP">("FORM");
    const [formData, setFormData] = useState({
        username: initialUsername,
        email: initialEmail,
        password: initialpw,
        role: initialRole,
        otp: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Auto-fill role for Google
    useEffect(() => {
        if (fromGoogle) {
            setFormData((prev) => ({ ...prev, role: initialRole }));
        }
    }, [fromGoogle]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Send OTP
    const sendOtp = async () => {
        if (!formData.email) {
            setMessage("Email is required");
            return;
        }

        setLoading(true);
        try {
            console.log("VITE_URI : ",import.meta.env.VITE_API_URL)
            const res = await fetch("http://localhost:3050/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email }),
            });
            const data = await res.json();
            if (res.ok) {
                setMessage("OTP sent to your email");
                setStep("OTP");
                setCountdown(60);
            } else {
                setMessage(data.message || "Failed to send OTP");
            }
        } catch (err) {
            setMessage("Server error while sending OTP");
        } finally {
            setLoading(false);
        }
    };

    // Complete signup
    const handleCompleteSignup = async () => {
        const { username, email, password, role, otp } = formData;
        if (!otp || !username || !email || !password || !role) {
            setMessage("All fields and OTP are required");
            return;
        }

        setLoading(true);
        try {
            console.log("Credentials Send : ",username, email, password, role, otp)
            const res = await fetch("http://localhost:3050/api/auth/complete-signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    role,
                    otp,
                    google: fromGoogle
                }),
            });
            const data = await res.json();

            if (res.ok) {
                // Save token
                const token = fromGoogle ? googleToken : data.token;
                if (token) localStorage.setItem("token", token);

                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user || { username, email, role })
                );

                navigate("/login");
            } else {
                setMessage(data.message || "Signup failed");
            }
        } catch (err) {
            setMessage("Server error during signup");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-center mb-4">
                    {fromGoogle ? "Complete Google Signup" : "Complete Signup"}
                </h2>

                {message && <div className="mb-3 text-sm text-red-600">{message}</div>}

                {step === "FORM" && (
                    <>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full p-2 border rounded mb-3"
                            disabled={fromGoogle && !!initialUsername}
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 border rounded mb-3"
                            disabled={fromGoogle && !!initialEmail}
                        />

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-2 border rounded mb-3"
                        />

                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full p-2 border rounded mb-3"
                            disabled={fromGoogle}
                        >
                            <option value="Customer">Customer</option>
                            <option value="Partner">Partner</option>
                            <option value="Admin">Admin</option>
                        </select>

                        <button
                            onClick={sendOtp}
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                        >
                            {loading ? "Sending OTP..." : "Request OTP"}
                        </button>
                    </>
                )}

                {step === "OTP" && (
                    <>
                        <input
                            type="text"
                            name="otp"
                            placeholder="Enter OTP"
                            value={formData.otp}
                            onChange={handleChange}
                            className="w-full p-2 border rounded mb-3"
                        />

                        <button
                            onClick={handleCompleteSignup}
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mb-2"
                        >
                            {loading ? "Completing Signup..." : "Complete Signup"}
                        </button>

                        <button
                            onClick={sendOtp}
                            disabled={loading || countdown > 0}
                            className="w-full border py-2 rounded hover:bg-gray-100"
                        >
                            {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default CompleteSignupPage;
