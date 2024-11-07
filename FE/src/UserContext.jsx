import { createContext, useEffect, useState } from "react";
import getBaseUrl from "./utils/baseUrl";
import axios from "axios";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [currentUsername, setCurrentUsername] = useState(null);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log("Fetching profile...");
        const response = await axios.get(`${getBaseUrl()}/profile`, {
          withCredentials: true,
        });
        console.log("Response:", response.data);
        setCurrentId(response.data.userId);
        setCurrentUsername(response.data.username);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <UserContext.Provider
      value={{ currentUsername, setCurrentUsername, currentId, setCurrentId }}
    >
      {children}
    </UserContext.Provider>
  );
}
