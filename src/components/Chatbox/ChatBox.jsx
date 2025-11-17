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
