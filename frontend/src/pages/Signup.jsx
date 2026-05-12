import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

function Signup() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard" />;
  }

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/signup", formData);

      toast.success("Account created successfully!");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
          DSA Progress Tracker
        </h1>

        <p className="text-gray-400 text-small">
          Track problems, analyze performance, improve consistency.
        </p>
      </div>
      <form
        onSubmit={handleSignup}
        className="bg-gray-800 p-8 rounded-2xl w-full max-w-md shadow-lg"
      >
        <h1 className="text-3xl text-white font-bold mb-6 text-center">
          Create Account
        </h1>

        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full mb-4 p-3 rounded-lg bg-gray-700 text-white outline-none"
        />

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
          Sign Up
        </button>

        <p className="text-gray-400 text-center mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-blue-400">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
