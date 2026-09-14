import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { currentUser, updateProfile } = useAuth();
  const [username, setUsername] = useState(currentUser.username);
  const [fullName, setFullName] = useState(currentUser.fullName || "");
  const [phone, setPhone] = useState(currentUser.phone || "");
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be under 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(false);

    if (!username.trim() || username.trim().length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }
    if (!fullName.trim() || fullName.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }
    const cleanedPhone = phone.trim().replace(/[\s-]/g, "");
    if (!/^(?:\+251|0)[79]\d{8}$/.test(cleanedPhone)) {
      setError("Enter a valid Ethiopian number.");
      return;
    }

    const result = updateProfile(
      username,
      fullName.trim(),
      phone.trim(),
      avatar
    );
    if (!result.success) {
      setError(result.error);
      return;
    }
    setError("");
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  };

  const initial = currentUser.username.charAt(0).toUpperCase();

  return (
    <section className="auth-page">
      <div className="title-band">
        <h1 className="serif">
          Your <em>Profile</em>
        </h1>
        <div className="rule" />
      </div>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="avatar-upload">
          <button
            type="button"
            className="avatar-upload-circle"
            onClick={() => fileInputRef.current.click()}
          >
            {avatar ? <img src={avatar} alt="Profile" /> : <span>{initial}</span>}
            <div className="avatar-upload-overlay">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <span className="avatar-upload-hint">Click to change photo</span>
        </div>

        <div className="field">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+251 9xx xxx xxx"
          />
        </div>

        {error && <span className="field-error">{error}</span>}
        {success && (
          <span className="field-success">Profile updated successfully.</span>
        )}

        <button type="submit" className="cart-place-order">
          Save Changes
        </button>
      </form>
    </section>
  );
}