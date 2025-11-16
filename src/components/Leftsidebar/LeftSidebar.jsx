import React from 'react'
import logo from "../../assets/logo.png";
import menu_icon from "../../assets/menu_icon.png";
import search_icon from "../../assets/search_icon.png";
import profile_img from "../../assets/img1.jpg"; // example → use correct file
import './LeftSidebar.css'
const LeftSidebar = () => {
  return (
    <div className='ls'>
     <div className="ls-top">
      <div className="ls-nav">
        <img src={logo} className='logo' alt="" />
        <div className="menu">
           <img src={menu_icon} alt="" />
        </div>
      </div>
      <div className="ls-search">
        <img src={search_icon} alt="" />
        <input type="text" placeholder='Search here..' />
      </div>
     </div>
     <div className="ls-list">
      <div className="friends">
        <img src={profile_img} alt="" />
        <div>
          <p>Mukta Suryavanshi</p>
          <p>Hello how are you.</p>
        </div>
      </div>
     </div>
    </div>
  )
}

export default LeftSidebar
