// import { Route, Routes, useNavigate } from "react-router-dom";
// import Login from "./pages/login/Login";
// import ProfileUpdate from "./pages/ProfileUpdate/ProfileUpdate";
// import AuthCallback from "./pages/AuthCallback/AuthCallback";
// import Chat from "./pages/Chat/Chat";
// import { useEffect } from "react";
// import { supabase } from "./config/supabase";

// const App = () => {
//   const navigate = useNavigate();
//   useEffect(() => {
//     const checkSession = async () => {
//       const { data } = await supabase.auth.getSession();
//       const user = data?.session?.user;

//       if (!user && window.location.pathname !== "/") {
//         navigate("/");
//       }

//       if (user && window.location.pathname === "/") {
//         navigate("/chat");
//       }
//     };

//     checkSession();
//   }, []);

//   return (
//     <Routes>
//       <Route path="/" element={<Login />} />
//       <Route path="/chat" element={<Chat />} />
//       <Route path="/profile" element={<ProfileUpdate />} />
//       <Route path="/auth/callback" element={<AuthCallback />} />
//     </Routes>
//   );
// };

// export default App;

import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/login/Login";
import ProfileUpdate from "./pages/ProfileUpdate/ProfileUpdate";
import AuthCallback from "./pages/AuthCallback/AuthCallback";
import Chat from "./pages/Chat/Chat";
import { useEffect } from "react";
import { supabase } from "./config/supabase";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data?.session?.user;

      if (!user && window.location.pathname !== "/") {
        navigate("/");
      }

      if (user && window.location.pathname === "/") {
        navigate("/chat");
      }
    };

    checkSession();
  }, [navigate]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<ProfileUpdate />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>

      {/* 🔥 Toast Container MUST be outside Routes */}
      <ToastContainer
        position="top-center"
        autoClose={2000}
        pauseOnHover
        theme="colored"
      />
    </>
  );
};

export default App;
