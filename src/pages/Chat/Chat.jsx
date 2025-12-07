import React, { useEffect, useState } from "react";
import "./Chat.css";

import LeftSidebar from "../../components/Leftsidebar/LeftSidebar";
import ChatBox from "../../components/Chatbox/ChatBox";
import RightSidebar from "../../components/Rightsidebar/RightSidebar";
import { AppContext } from "../../context/AppContext";

const Chat = () => {

   const {chatData,userData} = (AppContext);
  //  const [loading, setLoading] = useState(true)
   const [loading, setLoading] = useState(false)

   useEffect(()=>{
      if (chatData && userData) {
        // setLoading(false)
        setLoading(true)
      }
   },[chatData,userData])

  return (
    <div className="chat">
      {
        loading?<p className="loading">Loading..</p>
        : <div className="chat-container">
        <LeftSidebar />
        <ChatBox />
        <RightSidebar />
      </div>
      }
     
    </div>
  );
};

export default Chat;
