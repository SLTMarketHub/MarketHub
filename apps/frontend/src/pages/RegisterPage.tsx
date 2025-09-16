import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

type Role = "Admin" | "Customer" | "Partner" ;

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword:"",
        role: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordStrengthLabel, setPasswordStrengthLabel] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const updatedForm = { ...formData, [name]: value };

        setFormData(updatedForm);

        let errorMsg = "";

        // Validate password rules if changing password
        if (name === "password") {
            errorMsg = validatePassword(value);
        }

        // Character-by-character check for confirm password
        if (updatedForm.confirmPassword) {
            for (let i = 0; i < updatedForm.confirmPassword.length; i++) {
                if (updatedForm.password[i] !== updatedForm.confirmPassword[i]) {
                    errorMsg = "Passwords do not match";
                    break; // Stop at first mismatch
                } else {
                    errorMsg = ""; // Clear error if characters match so far
                }
            }
        }

        setPasswordError(errorMsg);

        // Enable submit only if passwords exist and no error
        if (updatedForm.password && updatedForm.confirmPassword && errorMsg === "") {
            setIsSubmitDisabled(false);
        } else {
            setIsSubmitDisabled(true);
        }
    };




    const validatePassword = (password: string) => {
        let score = 0;

        if (/.{6,}/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

        setPasswordStrength(score);

        if (score <= 1) {
            setPasswordStrengthLabel("Weak");
            return "Password is too weak";
        } else if (score === 2 || score === 3) {
            setPasswordStrengthLabel("Medium");
            return "";
        } else if (score === 4) {
            setPasswordStrengthLabel("Strong");
            return "";
        }

        return "";
    };



    // Step 1: Send OTP → redirect to CompleteSignupPage
    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            if (!formData.role) {
                formData.role = "Customer"
                return;
            }

            navigate(
                `/complete-signup?email=${encodeURIComponent(formData.email)}&username=${encodeURIComponent(
                    formData.username
                )}&password=${encodeURIComponent(formData.password)}&role=${formData.role}&from=manual`
            );

        } catch (err) {
            setMessage("Server error while sending OTP");
        } finally {
            setLoading(false);
        }
    };

    // Google signup handler
    const handleGoogleSignUp = () => {
        if (!formData.role) {
            formData.role = "Customer"
            return;
        }
        window.location.href = `http://localhost:3050/api/auth/google?role=${formData.role}`;
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-center mb-4">Create an Account</h2>

                {message && (
                    <div className="mb-3 text-sm text-red-600 text-center">{message}</div>
                )}

                <form onSubmit={handleSignup}>
                    {/* Username */}
                    <input
                        type="text"
                        name="username"
                        placeholder="Your Name"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full p-2 border rounded mb-3"
                        required
                    />

                    {/* Email */}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 border rounded mb-3"
                        required
                    />

                    {/* Password */}
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-2 border rounded mb-1"
                    />

                    {/* Password Strength Meter */}
                    <div className="w-full h-2 rounded mb-2">
                        <div
                            className={`h-2 rounded ${
                                passwordStrength <= 1
                                    ? "bg-red-500 w-1/4"
                                    : passwordStrength === 2
                                        ? "bg-yellow-500 w-2/4"
                                        : passwordStrength === 3
                                            ? "bg-blue-500 w-3/4"
                                            : "bg-green-500 w-full"
                            }`}
                        ></div>
                    </div>
                    <p
                        className={`text-sm mb-3 ${
                            passwordStrength <= 1
                                ? "text-red-500"
                                : passwordStrength === 2
                                    ? "text-yellow-600"
                                    : passwordStrength === 3
                                        ? "text-blue-600"
                                        : "text-green-600"
                        }`}
                    >
                        {passwordStrengthLabel && `Strength: ${passwordStrengthLabel}`}
                    </p>

                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded mb-1 ${
                            passwordError ? "border-red-500" : ""
                        }`}
                    />

                    {passwordError && (
                        <p className="text-red-500 text-sm mb-3">{passwordError}</p>
                    )}


                    {/* Role */}
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full p-2 border rounded mb-3"
                    >
                        <option value="Customer">Customer</option>
                        <option value="Partner">Partner</option>
                        <option value="Admin">Admin</option>

                    </select>

                    <button
                        type="submit"
                        disabled={loading || isSubmitDisabled}
                        className={`w-full text-white py-2 rounded ${
                            loading || isSubmitDisabled
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {loading ? "Requesting OTP..." : "Sign Up"}
                    </button>

                </form>

                <div className="flex items-center justify-center my-4">
                    <span className="text-gray-400 text-sm">OR</span>
                </div>

                <button
                    onClick={handleGoogleSignUp}
                    className="w-full flex items-center justify-center gap-2 border py-2 rounded hover:bg-gray-100"
                >
                    <FcGoogle size={20} />
                    <span>Sign up with Google</span>
                </button>

                <p className="text-sm text-center mt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
