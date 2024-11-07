import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContextProvider } from "./UserContext";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <UserContextProvider>
      <BrowserRouter>
        <ToastContainer  />
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/:username/chatroom" element={<Chat />} /> {/* Dynamic username route */}
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
  );
};

export default App;
