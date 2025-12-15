import React, { useEffect, useState, useContext } from "react";
import "./Chat.css";

// import LeftSidebar from "../../components/Leftsidebar/LeftSidebar";
import ChatBox from "../../components/Chatbox/ChatBox";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar.jsx";
import RightSidebar from "../../components/RightSidebar/RightSidebar.jsx";



// import RightSidebar from "../../components/Rightsidebar/RightSidebar";
import { AppContext } from "../../context/AppContext";

const Chat = () => {
  const { chatData, userData } = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(false);

  useEffect(() => {
    if (chatData && userData) {
      setLoading(false);
    }
  }, [chatData, userData]);

  // 🔁 toggle function
  const toggleRightSidebar = () => {
    setShowRightSidebar(prev => !prev);
  };

  return (
    <div className="chat">
      {loading ? (
        <p className="loading">Loading..</p>
      ) : (
        <div className={`chat-container ${
    showRightSidebar ? "with-right" : "no-right"
  }`}>
          <LeftSidebar />

          {/* pass toggle function to ChatBox */}
          <ChatBox onHelpClick={toggleRightSidebar} />

          {/* conditional render */}
          {showRightSidebar && <RightSidebar />}
        </div>
      )}
    </div>
  );
};

export default Chat;
