import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/login/Login";
import ProfileUpdate from "./pages/ProfileUpdate/ProfileUpdate";
import AuthCallback from "./pages/AuthCallback/AuthCallback";
import Chat from "./pages/Chat/Chat";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext, useEffect } from "react";
import { supabase } from "./config/supabase";
import { AppContext } from "./context/AppContext";

const App = () => {
  const navigate = useNavigate();
  const { loadUserData } = useContext(AppContext);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      const isLoggedIn = data?.session?.user;

      // redirect only if user is on login page
      if (isLoggedIn && window.location.pathname === "/") {
        navigate("/chat");
      }
    };

    checkSession();
  }, []);

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<ProfileUpdate />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </>
  );
};

export default App;


// import { Route, Routes, useNavigate } from 'react-router-dom'
// import Login from './pages/login/Login'
// import ProfileUpdate from './pages/ProfileUpdate/ProfileUpdate'
// import AuthCallback from './pages/AuthCallback/AuthCallback'
// import Chat from './pages/Chat/Chat'
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useEffect } from 'react'
// import { supabase } from './config/supabase'

// const App = () => {
//   const navigate = useNavigate();

//   useEffect(() => {

//     const checkSession = async () => {
//       const { data } = await supabase.auth.getSession();
//       if (data?.session?.user) {
//         navigate('/chat');
//       } else {
//         navigate('/');
//       }
//     };

//     checkSession();

//     const { data: authListener } = supabase.auth.onAuthStateChange(
//       (_event, session) => {
//         if (session?.user) {
//           navigate('/chat');
//         } else {
//           navigate('/');
//         }
//       }
//     );

//     return () => authListener.subscription.unsubscribe();
//   }, [navigate]);

//   return (
//     <>
//       <ToastContainer />
//       <Routes>
//         <Route path='/' element={<Login />} />
//         <Route path='/chat' element={<Chat />} />
//         <Route path='/profile' element={<ProfileUpdate />} />
//         <Route path='/auth/callback' element={<AuthCallback />} />
//       </Routes>
//     </>
//   );
// };

// export default App;