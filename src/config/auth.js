import { supabase } from "./supabase";

// ------------------ SIGNUP ------------------ //
export const signup = async (username, email, password) => {
  // First check if email already exists in auth
  const { data: existingUser, error: existErr } = await supabase
    .from("users")
    .select("email")
    .eq("email", email)
    .single();

  if (existingUser) {
    throw new Error("Email already exists! Please login.");
  }

  // Create auth user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  const user = data.user;

  // Insert into users profile table
  const { error: insertErr } = await supabase.from("users").insert([
    {
      id: user.id,
      username,
      email,
      name: "",
      avatar: "",
      bio: "Hey! I am using chat app.",
     lastSeen: Date.now(),   // int8 number

    },
  ]);

  if (insertErr) throw insertErr;

  return data;
};

// ------------------ LOGIN ------------------ //
export const login = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      throw new Error("Invalid Email or Password!");
    }
    throw error;
  }

  return data;
};

// ------------------ LOGOUT ------------------ //
export const logout = async () => {
  await supabase.auth.signOut();
  localStorage.clear();
  window.location.href = "/";
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
