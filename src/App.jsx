import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/login/Login'
import ProfileUpdate from './pages/ProfileUpdate/ProfileUpdate'
import Chat from './pages/Chat/Chat'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const App = () => {
  return (
    <>
    <ToastContainer />
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/chat' element={<Chat />} />
        <Route path='/profile' element={<ProfileUpdate />}/>
      </Routes>
    </>
  )
}

export default App

