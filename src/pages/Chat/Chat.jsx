import React from "react";
import "./Chat.css";

import LeftSidebar from "../../components/Leftsidebar/LeftSidebar";
import ChatBox from "../../components/Chatbox/ChatBox";
import RightSidebar from "../../components/Rightsidebar/RightSidebar";

const Chat = () => {
  return (
    <div className="chat">
      <div className="chat-container">
        <LeftSidebar />
        <ChatBox />
        <RightSidebar />
      </div>
    </div>
  );
};

export default Chat;
