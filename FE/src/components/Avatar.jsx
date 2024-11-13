import React from "react";

const Avatar = ({ userId, username, isOnline }) => {
  // Default colors array (not including green for online status)
  const colors = [
    "bg-red-200",
    "bg-green-200",
    "bg-purple-200",
    "bg-blue-200",
    "bg-yellow-200",
    "bg-teal-200",
  ];

  // Convert the userId to a base-10 integer and get the index for color
  const userIdBase10 = parseInt(userId, 16);
  const colorIndex = userIdBase10 % colors.length;
  const color = colors[colorIndex];

  return (
    <div className="relative w-10 h-10 rounded-full flex items-center justify-center">
      {/* Background circle */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${color}`}>
        <div className="text-center w-full opacity-70 font-semibold">
          {username[0].toUpperCase()}
          {username[username.length - 1].toUpperCase()}
        </div>
      </div>

      {/* Green dot indicating online status */}
      {isOnline && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
      )}
    </div>
  );
};

export default Avatar;
