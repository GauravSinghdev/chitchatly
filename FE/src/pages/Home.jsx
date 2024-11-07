import React, { useContext } from "react";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
import heroImage from "../assets/ChatImg.jpg";
import { UserContext } from "../UserContext";
import Chat from "./Chat";
import { Navigate } from "react-router-dom";

const App = () => {
  const { currentUsername } = useContext(UserContext);

  if (currentUsername) {
    return <Navigate to={`/${currentUsername}/chatroom`} />;
  }
  return (
    <div>
      {/* hero section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 to-blue-900 text-white px-4">
        <div className="flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-8">
          {/* Text Section */}
          <div className="text-center md:text-left max-w-md">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Welcome to ChitChatly
            </h1>
            <p className="text-lg md:text-2xl mb-8">
              Real-time messaging with your friends and family.
            </p>
            <a
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-lg"
            >
              Get Started
            </a>
          </div>

          {/* Image Section */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src={heroImage}
              alt="ChatApp preview"
              className="rounded-lg shadow-lg max-h-80"
            />
          </div>
        </div>
      </section>
      {/* feature section */}
      <section id="features" className="py-16 bg-gray-100 text-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Instant Messaging"
              description="Send and receive messages instantly."
            />
            <FeatureCard
              title="Media Sharing"
              description="Share images, videos, and voice messages."
            />
            <FeatureCard
              title="Group Chats"
              description="Stay connected with groups of friends."
            />
          </div>
        </div>
      </section>
      <Testimonials />
      <Footer />
    </div>
  );
};

const FeatureCard = ({ title, description }) => (
  <div className="bg-white shadow-md rounded-lg p-6 text-center">
    <h3 className="text-2xl font-semibold mb-4">{title}</h3>
    <p>{description}</p>
  </div>
);

export default App;
