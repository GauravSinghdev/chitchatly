import React from "react";

const Avatar = ({ userId, username }) => {
  const colors = [
    "bg-red-200",
    "bg-green-200",
    "bg-purple-200",
    "bg-blue-200",
    "bg-yellow-200",
    "bg-teal-200",
  ];

  const userIdBase10 = parseInt(userId, 16);
  const colorIndex = userIdBase10 % colors.length;
  const color = colors[colorIndex];

  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center ${color}`}
    >
      <div className="text-center w-full opacity-70 font-semibold">
        {username[0].toUpperCase()}
        {username[username.length - 1].toUpperCase()}
      </div>
    </div>
  );
};

export default Avatar;
