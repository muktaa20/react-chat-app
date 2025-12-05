import { supabase } from "../config/supabase";

export async function uploadFile(file) {
  const fileName = `${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from("images")
    .upload(fileName, file);

  if (error) {
    console.error("Upload Error:", error.message);
    return null;
  }

  // ⛔ DON'T return signed URL here
  // ✔️ Return ONLY file path
  return fileName;
}


// import { supabase } from "../config/supabase";



// // file upload function
// export async function uploadFile(file) {
 
//     const fileName = `${Date.now()}-${file.name}`;

//   // Upload to Supabase bucket
//   const { data, error } = await supabase.storage
//     .from("images")        // bucket name
//     .upload(fileName, file, {
//       cacheControl: "3600",
//       upsert: false,
//     });

//   if (error) {
//     console.error("Upload Error:", error.message);
//     return null;
//   }

//   // Create signed URL (private bucket)
//   const { data: signedURL } = await supabase.storage
//     .from("images")
//     .createSignedUrl(fileName, 60 * 60); // valid for 1 hour

//   return signedURL.signedUrl;
// }
