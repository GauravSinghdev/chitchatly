import axios from "axios";
import React, { useContext, useState } from "react";
import getBaseUrl from "../utils/baseUrl";
import { toast } from "react-toastify";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import Chat from "./Chat";

const SignUp = () => {
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
      const response = await axios.post(`${getBaseUrl()}/register`, payload, {
        withCredentials: true, // Allows cookies to be sent with the request
      });
      setCurrentUsername(username);
      setCurrentId(response.data.id);
      toast.success("User Registered Successfully!");
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
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative bg-white p-8 rounded-lg shadow-md w-full max-w-md z-10">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Sign Up for ChatApp
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="Username"
              className="block text-gray-700 font-medium mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          {error && <p className="text-red-500 text-lg">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            Sign Up
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?
            <Link to="/login" className="text-blue-600 hover:underline ml-1">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
