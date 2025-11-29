import { supabase } from "./supabase";

// ---------------------- SIGNUP ---------------------- //
export const signup = async (username, email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: "http://localhost:5173/auth/callback",
      data: { username },
    },
  });

  if (error) {
    if (error.message.includes("already registered")) {
      throw new Error("Email already registered! Please login.");
    }
    throw error;
  }

  const user = data.user;

  // If email unverified → user.id null hota hai
  if (!user?.id) return data;

  // Insert user profile first time only
  const { error: insertErr } = await supabase.from("users").insert([
    {
      id: user.id,
      username,
      email,
      name: "",
      avatar: "",
      bio: "Hey! I’m using the chat app.",
      lastSeen: new Date().toISOString(), // FIXED
    },
  ]);

  if (insertErr) throw insertErr;

  return data;
};

// ---------------------- LOGIN ---------------------- //
export const login = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

// ---------------------- LOGOUT ---------------------- //
export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    localStorage.clear();

    // Correct redirect
    window.location.href = "/login";
  } catch (err) {
    console.error("Logout failed:", err.message);
  }
};





// import { supabase } from "./supabase";

// // ---------------------- SIGNUP ---------------------- //
// const signup = async (username, email, password) => {
//   try {
//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         emailRedirectTo: "http://localhost:5173/auth/callback",
//       },
//     });

//     if (error) throw error;

//     alert("Verification email sent! Please verify your email then login.");

//     return data;
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
//     alert(error.message);
//     throw error;
//   }
// };

// const logout = async () => {
//   try {
//     await supabase.auth.signOut();
//   } catch (error) {
//     console.error("Logout error:", error.message);
//     alert(error.message);
//   }
// };

// export { signup, login,logout };