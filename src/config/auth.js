import { supabase } from "./supabase";

// ---------------------- SIGNUP ---------------------- //
const signup = async (username, email, password) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "http://localhost:5173/auth/callback",
      },
    });

    if (error) throw error;

    alert("Verification email sent! Please verify your email then login.");

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// ---------------------- LOGIN ---------------------- //
const login = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Login error:", error);
    alert(error.message);
    throw error;
  }
};

const logout = async () => {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error("Logout error:", error.message);
    alert(error.message);
  }
};

export { signup, login,logout };



// import { supabase } from "./supabase";

// // ---------------------- SIGNUP ---------------------- //
// const signup = async (username, email, password) => {
//   try {
//     // 1. Create auth user
//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//        options: {
//     emailRedirectTo: "http://localhost:5173"
//   }
//     });

//     if (error) throw error;

//     const user = data.user;

//     // 2. Insert user profile
//     const { error: insertErr } = await supabase.from("users").insert([
//       {
//         id: user.id,
//         username: username.toLowerCase(),
//         email,
//         name: "",
//         avatar: "",
//         bio: "Hey, there I am using chat app",
//         lastSeen: Date.now(),
//       },
//     ]);

//     if (insertErr) throw insertErr;

//     // 3. Create empty chat row
//     const { error: chatErr } = await supabase.from("chats").insert([
//       {
//         chatData: [],
//       },
//     ]);

//     if (chatErr) throw chatErr;

//     return { user };
//   } catch (err) {
//     console.error(err);
//     throw err;
//   }
// };

// // ---------------------- LOGIN ---------------------- //
// const login = async (email, password) => {
//   try {
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });

//     if (error) throw error;

//     return data;
//   } catch (error) {
//     console.error("Login error:", error);
//     throw error;
//   }
// };

// export { signup, login };

