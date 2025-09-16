import React, {useEffect, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import {useAuth} from "../contexts/AuthContext.tsx";

const LoginPage: React.FC = () => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { setAuthUser } = useAuth();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Normal login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:3050/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // Save token in localStorage/sessionStorage
        localStorage.setItem("token", data.token);

        const mappedRole = (data?.user?.role || "customer").toString().toLowerCase();
        setAuthUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: mappedRole as 'customer' | 'partner' | 'admin',
          authProvider: 'email',
          token: data.token
        });

        if (mappedRole.toLowerCase() === "partner") {
          navigate("/partner");
        } else if (mappedRole.toLowerCase() === "customer") {
          navigate("/dashboard");
        } else if (mappedRole.toLowerCase() === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }

      } else {
        setMessage(data.message || "Invalid credentials");
      }
    } catch (err) {
      setMessage("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };


  const handleGoogleLogin = () => {
    window.location.href = `http://localhost:3050/api/auth/google`;
  };


  return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-center mb-4">Sign In</h2>

          {message && (
              <div className="mb-3 text-sm text-red-600 text-center">{message}</div>
          )}

          <form onSubmit={handleLogin}>
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
                className="w-full p-2 border rounded mb-3"
                required
            />

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="flex items-center justify-center my-4">
            <span className="text-gray-400 text-sm">OR</span>
          </div>

          {/* Google Login */}
          <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 border py-2 rounded hover:bg-gray-100"
          >
            <FcGoogle size={20} />
            <span>Sign in with Google</span>
          </button>

          <p className="text-sm text-center mt-4">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
  );
};

export default LoginPage;
