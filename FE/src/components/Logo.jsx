import React, { useContext } from "react";
import { IoChatboxOutline } from "react-icons/io5";
import { UserContext } from "../UserContext";

const Logo = () => {
  const { currentUsername } = useContext(UserContext);

  return (
    <a href={`/${currentUsername}/chatroom`}>
      <div className="text-blue-600 font-bold flex  items-center gap-2 p-4 border-b-8 border-purple-500 text-2xl mb-2">
        <IoChatboxOutline className="size-10" />
        ChitChatly
      </div>
    </a>
  );
};

export default Logo;
