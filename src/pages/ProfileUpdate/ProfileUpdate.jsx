import "./ProfileUpdate.css";
import avatar_icon from "../../assets/avatar_icon.png";
import logo_icon from "../../assets/logo_icon.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabase";

const ProfileUpdate = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const { data: session } = await supabase.auth.getSession();
      const user = session?.session?.user;

      if (!user) {
        navigate("/");
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setName(data.name || "");
        setBio(data.bio || "");
        setAvatarUrl(data.avatar || "");
      }
    };

    loadData();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalImageUrl = avatarUrl;

    if (image) {
      const fileName = `avatars/${Date.now()}-${image.name}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(fileName, image, { upsert: true });

      if (uploadError) {
        alert("Image upload failed!");
        return;
      }

      const { data } = supabase.storage
        .from("images")
        .getPublicUrl(fileName);

      finalImageUrl = data.publicUrl;
    }

    const { data: session } = await supabase.auth.getSession();
    const user = session?.session?.user;

    const { error: updateError } = await supabase
      .from("users")
      .update({
        name,
        bio,
        avatar: finalImageUrl,
      })
      .eq("id", user.id);

    if (updateError) {
      alert("Profile update failed!");
      return;
    }

    alert("Profile updated successfully!");
    navigate("/chat");
  };

  return (
    <div className="profile">
      <div className="profile-container">
        <form onSubmit={handleSubmit}>
          <h3>Profile Details</h3>

          <label htmlFor="avatar">
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png,.jpg,.jpeg"
              hidden
            />
            <img
              src={image ? URL.createObjectURL(image) : avatarUrl || avatar_icon}
              alt="profile"
            />
            Upload profile image
          </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Your name"
            required
          />

          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write profile bio"
            required
          ></textarea>

          <button type="submit">Save</button>
        </form>

        <img
          className="profile-pic"
          src={image ? URL.createObjectURL(image) : avatarUrl || logo_icon}
          alt=""
        />
      </div>
    </div>
  );
};

export default ProfileUpdate;
