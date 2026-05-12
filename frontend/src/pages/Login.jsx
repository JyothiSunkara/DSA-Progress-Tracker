import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/auth/login", formData);

      localStorage.setItem("token", response.data.access_token);

      setMessage("Login successful!");
      setIsError(false);

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error(error);
      setMessage("Invalid credentials");
      setIsError(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4">
      <div className="text-center mb-8">
        <h1 className="md:text-5xl text-3xl font-bold text-white mb-3">
          DSA Progress Tracker
        </h1>

        <p className="text-gray-400 text-small">
          Track problems, analyze performance, improve consistency.
        </p>
      </div>
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 p-8 rounded-2xl w-full max-w-md shadow-lg"
      >
        <h1 className="text-3xl text-white font-bold mb-6 text-center">
          Welcome Back
        </h1>

        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm text-center ${
              isError
                ? "bg-red-500/20 text-red-400"
                : "bg-green-500/20 text-green-400"
            }`}
          >
            {message}
          </div>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full mb-4 p-3 rounded-lg bg-gray-700 text-white outline-none"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full mb-6 p-3 rounded-lg bg-gray-700 text-white outline-none"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition"
        >
          Login
        </button>

        <p className="text-gray-400 text-center mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-400">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
