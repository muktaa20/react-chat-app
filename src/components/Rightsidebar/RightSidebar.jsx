import React from 'react'
import profile_img from "../../assets/profile_richard.png"; 
import pic1 from "../../assets/pic1.png"; 
import pic2 from "../../assets/pic2.png"; 
import pic3 from "../../assets/pic3.png"; 
import pic4 from "../../assets/pic4.png"; 
import './RightSidebar.css'
import { logout } from "../../config/auth";
const RightSidebar = () => {
  return (
    <div className='rs'>
    <div className="rs-profile">
      <img src={profile_img} alt="" />
      <h3>Mukta Suryavanshi</h3>
      <p>HArd work + dream = success</p>
    </div>
    <hr />
    <div className="rs-media">
      <p>media</p>
      <div>
        <img src={pic1} alt="" />
        <img src={pic2} alt="" />
        <img src={pic3} alt="" />
        <img src={pic4} alt="" />
        <img src={pic1} alt="" />
        <img src={pic2} alt="" />
      </div>
    </div>
    <button onClick={logout}>Logout</button>
    </div>
  )
}

export default RightSidebar
