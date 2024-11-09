import React, { useContext, useEffect, useRef, useState } from "react";
import { LuSend } from "react-icons/lu";
import Avatar from "../components/Avatar";
import Logo from "../components/Logo";
import { UserContext } from "../UserContext";
import { uniqBy } from "lodash";
import { Navigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import axios from "axios";
import getBaseUrl from "../utils/baseUrl";
import { CgLogOff } from "react-icons/cg";
import { toast } from "react-toastify";


const Chat = () => {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [allUsers, setAllUsers] = useState([]); // State to store all users
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { currentUsername, currentId, setCurrentUsername, setCurrentId } =
    useContext(UserContext);
  const [newMsgTexted, setNewMsgTexted] = useState("");
  const [messages, setMessages] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const divUnderMsg = useRef();

  // Redirect if user is not logged in
  useEffect(() => {
    if (!currentUsername) {
      const timer = setTimeout(() => setRedirect(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [currentUsername]);

  // Set up WebSocket connection
  useEffect(() => {
    connectWs();
  }, []);

  const connectWs = () => {
    const ws = new WebSocket("wss://cchat-server.codewithkara.com");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("close", () => {
      setTimeout(() => {
        console.log("Disconnected! Trying to reconnect.");
        connectWs();
      }, 1000);
    });
  };

  // Update online users' list
  const showOnlinePeople = (peopleArray) => {
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    setOnlinePeople(people);
  };

  // Handle messages from WebSocket
  const handleMessage = (e) => {
    const messageData = JSON.parse(e.data);
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    } else if ("text" in messageData) {
      if (!messageData.createdAt || isNaN(new Date(messageData.createdAt))) {
        messageData.createdAt = new Date().toISOString();
      }
      setMessages((prevMessages) => [...prevMessages, { ...messageData }]);
    }
  };

  // Send a new message via WebSocket
  const sendMsg = (e) => {
    e.preventDefault();
    if (!newMsgTexted.trim()) return;

    const newMessage = {
      sender: currentId,
      recipient: selectedUserId,
      text: newMsgTexted,
      createdAt: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    ws.send(
      JSON.stringify({
        recipient: selectedUserId,
        text: newMsgTexted,
      })
    );

    setNewMsgTexted("");
    const div = divUnderMsg.current;
    if (div) {
      div.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  // Fetch all users from the database
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${getBaseUrl()}/people`, {
          withCredentials: true,
        });
        setAllUsers(
          response.data.filter((user) => user.username !== currentUsername)
        );
      } catch (err) {
        setErrorMessage("Failed to load users. Please try again.");
        console.error(err);
      }
    };
    fetchUsers();
  }, [currentUsername]);

  // Fetch messages for the selected user
  useEffect(() => {
    if (selectedUserId) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(
            `${getBaseUrl()}/messages/${selectedUserId}`,
            { withCredentials: true }
          );
          const messagesWithValidDate = response.data.map((message) => ({
            ...message,
            createdAt:
              message.createdAt && !isNaN(new Date(message.createdAt))
                ? new Date(message.createdAt).toISOString()
                : new Date().toISOString(),
          }));
          setMessages(messagesWithValidDate);
        } catch (err) {
          setErrorMessage("Failed to load messages. Please try again.");
          console.error(err);
        }
      };
      fetchMessages();
    }
  }, [selectedUserId]);

  const onlinePeopleExcludeUs = { ...onlinePeople };
  delete onlinePeopleExcludeUs[currentId];

  const messageWithoutDupes = uniqBy(messages, "_id");

  const handleLogout = async () => {
    try{
      const tokenDel = await axios.post(`${getBaseUrl()}/logout`, {
        withCredentials: true,
      });
      if(tokenDel)
      {
        setWs(null);
        setCurrentId(null);
        setCurrentUsername(null);
        toast.success("Logged off successfully!");
        Navigate('/login');
      }
      
    } catch(err){
      toast.error('Log out failed. Try again.')
    }
    
  };

  if (redirect) {
    return <Navigate to="/login" />;
  }

  if (!currentUsername) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Left side (User List) */}
      <div className="flex flex-col bg-white w-full md:w-1/4 shadow-lg">
        <Logo />
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">All Users</h2>
        </div>
        <div className="flex-grow overflow-y-auto">
          {allUsers.length > 0 ? (
            allUsers.map((user) => (
              <div
                key={user._id}
                onClick={() => setSelectedUserId(user._id)}
                className={`border-b border-gray-300 p-3 flex items-center gap-3 cursor-pointer transition duration-200 ease-in-out ${
                  user._id === selectedUserId
                    ? "bg-blue-200 border-l-4 border-green-600" // Active selection color
                    : onlinePeople[user._id]
                    ? "bg-green-100" // Green background for online users
                    : "hover:bg-gray-100" // Default hover for offline users
                }`}
              >
                <Avatar username={user.username} userId={user._id} />
                <span className="text-gray-800">{user.username}</span>
                {onlinePeople[user._id] && (
                  <span className="ml-2 text-green-500">Online</span>
                )}
              </div>
            ))
          ) : (
            <div className="text-gray-600 text-center p-4">No users found.</div>
          )}
        </div>
        <div className="p-4 border-t flex justify-between items-center">
          <span className="font-semibold">{currentUsername}</span>
          <button
            onClick={handleLogout}
            className="ml-2 text-red-500 flex items-center gap-2 border rounded-xl p-2 hover:bg-red-500 hover:text-white"
          >
            <CgLogOff className="size-6" />
          </button>
        </div>
      </div>

      {/* Right side chat */}
      <div className="flex flex-col bg-[#F0C1E1] w-full p-4">
        <div className="flex-grow">
          {!selectedUserId ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-4xl text-white">
                Select Someone and Start Chatting...
              </div>
            </div>
          ) : (
            <div className="relative h-full">
              <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2">
                {messageWithoutDupes.length > 0 ? (
                  messageWithoutDupes.map((message) => (
                    <div
                      key={message._id}
                      className={`${
                        message.sender === currentId
                          ? "text-right"
                          : "text-left"
                      }`}
                    >
                      <div
                        className={`inline-block p-2 my-2 rounded-md text-sm ${
                          message.sender === currentId
                            ? "bg-blue-500 text-white"
                            : "bg-white text-gray-600"
                        }`}
                      >
                        <div>{message.text}</div>
                        <div className="text-xs text-black/80 text-right">
                          {message.createdAt &&
                          !isNaN(new Date(message.createdAt))
                            ? new Date(message.createdAt).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )
                            : "Invalid time"}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-600 p-4">
                    No messages yet.
                  </div>
                )}
                <div ref={divUnderMsg}></div>
              </div>
            </div>
          )}
        </div>
        <form className="flex gap-2 mt-4" onSubmit={sendMsg}>
          <input
            value={newMsgTexted}
            onChange={(e) => setNewMsgTexted(e.target.value)}
            type="text"
            placeholder="Type your message here..."
            className="flex-grow p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className={`p-2 rounded-md text-white transition duration-200 ease-in-out ${
              !selectedUserId ? "bg-blue-100" : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={!selectedUserId}
            title={selectedUserId ? "Send" : "Select User first"}
          >
            <LuSend className="size-6" />
          </button>
        </form>
        {errorMessage && (
          <div className="text-red-500 text-center mt-2">{errorMessage}</div>
        )}
      </div>
    </div>
  );
};

export default Chat;
