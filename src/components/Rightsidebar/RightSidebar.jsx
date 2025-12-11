// import React, { useContext, useEffect, useState } from 'react'
// import profile_img from "../../assets/profile_richard.png"; 
// import pic1 from "../../assets/pic1.png"; 
// import pic2 from "../../assets/pic2.png"; 
// import pic3 from "../../assets/pic3.png"; 
// import pic4 from "../../assets/pic4.png"; 
// import './RightSidebar.css'
// import { logout } from "../../config/auth";
// import { AppContext } from '../../context/AppContext';
// const RightSidebar = () => {

//   const {chatUser,messages} = useContext(AppContext)
//    const [msgImages,setMsgImages] = useState([]);

//   useEffect(()=>{
//     let tempVar = []
//     messages.map((msg)=>{
//       if(msg.image){
//         tempVar.push(msg.image)
//       }
//       console.log(tempVar);
      
//     })
//   },[messages])

//   return chatUser? (
//     <div className='rs'>
//     <div className="rs-profile">
//       <img src={chatUser.userData.avatar} alt="" />
//       <h3>{Date.now() - chatUser.userData.lastSeen <= 70000 ? <img className="dot" src={green_dot} alt="" />: null} {chatUser.userData.name}</h3>
//       <p> {chatUser.userData.bio}</p>
//     </div>
//     <hr />
//     <div className="rs-media">
//       <p>media</p>
//       <div>
//          {/* <img className="dot" src={green_dot} alt="" /> */}
//         {msgImages.map((url,index) => (<img onClick={()=> window.open(url)} key={index} src={url} alt=''/>))}
//         {/* <img src={pic1} alt="" />
//         <img src={pic2} alt="" />
//         <img src={pic3} alt="" />
//         <img src={pic4} alt="" />
//         <img src={pic1} alt="" />
//         <img src={pic2} alt="" /> */}
//       </div>
//     </div>
//     <button onClick={logout}>Logout</button>
//     </div>
//   ):(
//     <div className='rs'>
//   <button onClick={() => logout()}>Logout</button>
//     </div>
//   )

// }

// export default RightSidebar

import React, { useContext, useEffect, useState } from "react";
import profile_img from "../../assets/profile_richard.png";
import green_dot from "../../assets/green_dot.png";  // ADD THIS
import "./Rightsidebar.css";

import { logout } from "../../config/auth";
import { AppContext } from "../../context/AppContext";

const RightSidebar = () => {
  const { chatUser, messages } = useContext(AppContext);
  const [msgImages, setMsgImages] = useState([]);

  const user = chatUser?.userData || {};   // <-- FIXED HERE

  useEffect(() => {
    if (!messages || messages.length === 0) return setMsgImages([]);

    const extracted = messages
      .filter((msg) => msg.image)
      .map((msg) => msg.image);

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
        <div>
          {msgImages.length === 0 ? (
            <p style={{ opacity: 0.6 }}>No media</p>
          ) : (
            msgImages.map((url, index) => (
              <img key={index} src={url} onClick={() => window.open(url)} />
            ))
          )}
        </div>
      </div>

      <button onClick={logout}>Logout</button>
    </div>
  );
};


export default RightSidebar;
