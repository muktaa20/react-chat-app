import { supabase } from "../config/supabase";

export async function uploadFile(file) {
  if (!file) return null;

  const fileName = `${Date.now()}-${file.name}`;
  const filePath = `avatars/${fileName}`;   
  const { error } = await supabase.storage
    .from("images")
    .upload(filePath, file, { upsert: true });

  if (error) {
    console.error("Upload Error:", error.message);
    return null;
  }

  return filePath; 
}