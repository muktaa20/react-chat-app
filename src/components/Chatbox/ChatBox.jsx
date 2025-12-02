// import React, { useContext, useEffect, useState } from 'react'
// import './ChatBox.css'
// import profile_img from "../../assets/profile_richard.png"; 
// import green_dot from "../../assets/green_dot.png"; 
// import help_icon from "../../assets/help_icon.png"; 
// import gallery_icon from "../../assets/gallery_icon.png"; 
// import send_button from "../../assets/send_button.png"; 
// import pic1 from "../../assets/pic1.png"; 
// import { AppContext } from '../../context/AppContext';
// import { arrayUnion } from 'firebase/firestore/lite';
// import { toast } from 'react-toastify';



// const ChatBox = () => {

// const {userData, messagesId, chatUser, messages, setMesaages} = useContext(AppContext)
// const [input,setInput] = useState("")

// const sendMessage = async()=>{
// try {
//   if (input && messagesId) {
//     await updateDoc(doc(db,'messages',messagesId),{
//       messages:arrayUnion({
//         sId:userData.id,
//         text:input,
//         createdAt:new Date()
//       })
//     })

//     const userIDs = [chatUser.rId,userData.id];

//     userIDs.forEach(async(id) => {
//       const userChatRef = doc(db,"chats",id);
//       const userChatSnapshot = await getDoc(userChatsRef)

//       if(userChatSnapshot.exists()){
//         const userChatData = userChatSnapshot.data();
//         const chatIndex = userChatData.chatsData.findIndex((c)=> c.messagesId === messagesId);
//         userChatData.chatsData[chatIndex].lastMessage = input.slice(0,30)
//         userChatData.chatsData[chatIndex].updatedAt = Date.now();
//         if (userChatData.chatsData[chatIndex].rId === userData.id) {
//           userChatData.chatsData[chatIndex].messageSeen = false;
//         }
//         await updateDoc(userChatRef,{
//           chatsData:userChatData.chatsData
//         })
//       }
//     })
//   }
// } catch (error) {
//   toast.error(error.message)
// }
// setInput("")
// }

// const convertTimestamp  = (timestamp) =>{
//   let date = timestamp.toDate()
//   let hour = date.getHours();
//   let minute = date.getMinutes();
//   if (hour>12) {
//     return hour-12 + ':' + minute + "PM"
//   }
//   else{
//     return hour + ':' + minute + "AM"
//   }
// }

// const sendImage = async (e) => {
//     try {
//       const fileUrl = await upload(e.target.files[0]);
//       if (fileUrl && messagesId) {
//         await  updateDoc(doc(db,'messages',messagesId),{
//           messages:arrayUnion({
//             sId:userData.id,
//             image:fileUrl,
//             createdAt:new Date()
//           })
//         })

//         const userIDs = [chatUser.rId,userData.id];

//     userIDs.forEach(async(id) => {
//       const userChatRef = doc(db,"chats",id);
//       const userChatSnapshot = await getDoc(userChatsRef)

//       if(userChatSnapshot.exists()){
//         const userChatData = userChatSnapshot.data();
//         const chatIndex = userChatData.chatsData.findIndex((c)=> c.messagesId === messagesId);
//         userChatData.chatsData[chatIndex].lastMessage = "Image"
//         userChatData.chatsData[chatIndex].updatedAt = Date.now();
//         if (userChatData.chatsData[chatIndex].rId === userData.id) {
//           userChatData.chatsData[chatIndex].messageSeen = false;
//         }
//         await updateDoc(userChatRef,{
//           chatsData:userChatData.chatsData
//         })
//       }
//     })

//       }
//     } catch (error) {
//       toast.error(error.message)
//     }
// }

// useEffect(()=>{
// if(messagesId){
//   const unSub = onSnapshot(doc(db,'messages',messagesId),(res)=>{
//    setMesaages(res.data().messages.reverse())
//    console.log(res.data().messages.reverse());
   
//   })
// return ()=>{
//   unSub();
// }
// }
// },[messagesId])

//   return chatUser ? (
//     <div className='chat-box'>
//       <div className="chat-user">
//         <img src={chatUser.userData.avatar} alt="" />
//         <p>{chatUser.userData.name}  <img className='dot' src={green_dot} alt="" /></p>
//         <img src={help_icon} className='help' alt="" />
//       </div>

// <div className="chat-msg">
//   {messages.map((msg,index) => (
//    <div key={index} className={msg.sId === userData.id ? 's-msg' : 'r-msg'}>
//     {msg["image"]
//     ? <img src={msg.image} alt=""/>
//      : <p className='msg'>{msg.text}</p>
//     }
//     <p className="msg">{msg.text}</p>
//     <div>
//       <img src={msg.sId === userData.id ? userData.avatar : chatUser.userData.avatar} alt="" />
//       <p>{convertTimestamp(msg.createdAt)}</p>
//     </div>
//   </div>
//   ))}
 

// </div>

//       <div className="chat-input">
//         <input onChange={(e)=> setInput(e.target.value)} value={input} type="text" placeholder='send a message'/>
//         <input onChange={sendImage} type="file" id='image' accept='image/png,image.jpeg' hidden />
//         <label htmlFor="image">
//           <img src={gallery_icon} alt="" />
//         </label>
//         <img onClick={sendMessage} src={send_button} alt="" />
//       </div>
//     </div>
//   ):
//   <div className='chat-welcome'>
//     <img src={assets.logo_icon} alt="" />
//     <p>Chat anytime, anywhere</p>
//   </div>
// }

// export default ChatBox

import React from 'react'
import './ChatBox.css'
import profile_img from "../../assets/profile_richard.png"; 
import green_dot from "../../assets/green_dot.png"; 
import help_icon from "../../assets/help_icon.png"; 
import gallery_icon from "../../assets/gallery_icon.png"; 
import send_button from "../../assets/send_button.png"; 
import pic1 from "../../assets/pic1.png"; 



const ChatBox = () => {
  return (
    <div className='chat-box'>
      <div className="chat-user">
        <img src={profile_img} alt="" />
        <p>Mukta suryavanshi <img className='dot' src={green_dot} alt="" /></p>
        <img src={help_icon} className='help' alt="" />
      </div>

<div className="chat-msg">
  <div className="s-msg">
    <p className="msg">Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore, quos?</p>
    <div>
      <img src={profile_img} alt="" />
      <p>2:30 PM</p>
    </div>
  </div>
   <div className="s-msg">
    <img className='msg-img' src={pic1} alt="" />
    <div>
      <img src={profile_img} alt="" />
      <p>2:30 PM</p>
    </div>
  </div>
  <div className="r-msg">
    <p className="msg">Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore, quos?</p>
    <div>
      <img src={profile_img} alt="" />
      <p>2:30 PM</p>
    </div>
  </div>

</div>

      <div className="chat-input">
        <input type="text" placeholder='send a message'/>
        <input type="file" id='image' accept='image/png,image.jpeg' hidden />
        <label htmlFor="image">
          <img src={gallery_icon} alt="" />
        </label>
        <img src={send_button} alt="" />
      </div>
    </div>
  )
}

export default ChatBox
