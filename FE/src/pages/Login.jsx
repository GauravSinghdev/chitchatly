import React, { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import getBaseUrl from "../utils/baseUrl";
import axios from "axios";
import { UserContext } from "../UserContext";
import { toast } from "react-toastify";
import Chat from "./Chat";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { currentUsername, setCurrentUsername, setCurrentId } =
    useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      username,
      password,
    };
    console.log(payload);

    try {
      const response = await axios.post(`${getBaseUrl()}/login`, payload, {
        withCredentials: true,
      });
      setCurrentUsername(username);
      setCurrentId(response.data.id);
      toast.success("User Logged In Successfully!");
      console.log(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "An error occurred.");
    }
  };

  if (currentUsername) {
    return <Navigate to={`/${currentUsername}/chatroom`} />;
  }

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url('https://cdn.pixabay.com/photo/2024/07/10/15/54/ai-generated-8886225_1280.jpg')`,
      }}
    >
      {/* Background overlay for readability */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative bg-white shadow-lg rounded-lg p-8 max-w-md w-full z-10">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Log in to ChatApp
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <p className="text-red-500 text-lg">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            Log In
          </button>
        </form>

        <div className="flex justify-between items-center mt-4 text-sm">
          <Link to="/forgot-password" className="text-blue-600 hover:underline">
            Forgot Password?
          </Link>
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
