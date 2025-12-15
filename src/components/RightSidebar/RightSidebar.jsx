import React, { useContext, useEffect, useState } from "react";
import profile_img from "../../assets/profile_richard.png";
import green_dot from "../../assets/green_dot.png";  // ADD THIS
// import "./Rightsidebar.css";
import "./RightSidebar.css";


import { logout } from "../../config/auth";
import { AppContext } from "../../context/AppContext";

const RightSidebar = () => {
  const { chatUser, messages } = useContext(AppContext);
  const [msgImages, setMsgImages] = useState([]);

  const user = chatUser?.userData || {};   // <-- FIXED HERE

  // useEffect(() => {
  //   if (!messages || messages.length === 0) return setMsgImages([]);

  //   const extracted = messages
  //     .filter((msg) => msg.image)
  //     .map((msg) => msg.image);

  //   setMsgImages(extracted);
  // }, [messages]);
  useEffect(() => {
  if (!messages || messages.length === 0) {
    setMsgImages([]);
    return;
  }

  const extracted = messages
    .filter((msg) => msg.imageSigned)     // ✅ FIX
    .map((msg) => msg.imageSigned);       // ✅ FIX

  setMsgImages(extracted);
}, [messages]);


  if (!chatUser) {
    return (
      <div className="rs">
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return (
    <div className="rs">
      <div className="rs-profile">

        <img src={user.avatar || profile_img} alt="" />

        <h3>
          {user.lastSeen && Date.now() - user.lastSeen <= 70000 && (
            <img className="dot" src={green_dot} alt="" />
          )}

          {user.username || user.name || "Unknown"}
        </h3>

        <p>{user.bio || "No bio available"}</p>
      </div>

      <hr />

      <div className="rs-media">
  <p>Media</p>

  <div className="rs-media-grid">
    {msgImages.length === 0 ? (
      <p style={{ opacity: 0.6 }}>No media</p>
    ) : (
      msgImages.map((url, index) => (
        <img
          key={index}
          src={url}
          alt="media"
          onClick={() => window.open(url, "_blank")}
        />
      ))
    )}
  </div>
</div>

      <button onClick={logout}>Logout</button>
    </div>

   

  );
};


export default RightSidebar;
