import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import PasswordInput from "./PasswordInput";

export default function SignUp() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const signUp = useAuthStore((s) => s.signUp);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  if (currentUser) return <Navigate to="/" replace />;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username.trim() || username.trim().length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }

    //  Full name validation (no numbers, no special symbols)
    const trimmedName = fullName.trim();
    if (!trimmedName) {
      setError("Please enter your full name.");
      return;
    }
    if (trimmedName.length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }
    if (!/^[a-zA-Z\s\u00C0-\u024F\u1200-\u137F'-]+$/.test(trimmedName)) {
      setError("Please enter a valid name (letters only, no numbers).");
      return;
    }

    const cleanedPhone = phone.trim().replace(/[\s-]/g, "");
    if (!/^(?:\+251|0)[79]\d{8}$/.test(cleanedPhone)) {
      setError("Enter a valid Ethiopian number (e.g. 0901020304 or +251901020304)");
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    const result = signUp(username, password, trimmedName, phone.trim());
    if (!result.success) {
      setError(result.error);
      return;
    }
    navigate("/");
  };

  return (
    <section className="auth-page">
      <div className="title-band">
        <h1 className="serif">
          Create <em>Account</em>
        </h1>
        <div className="rule" />
      </div>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </div>

        <div className="field">
          <label>Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Abebe Kebede"
            autoComplete="name"
          />
        </div>

        <div className="field">
          <label>Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+251 9xx xxx xxx"
            autoComplete="tel"
          />
        </div>

        <div className="field">
          <label>Password</label>
          <PasswordInput
            id="signup-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>

        <div className="field">
          <label>Confirm Password</label>
          <PasswordInput
            id="signup-confirm"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter password"
            autoComplete="new-password"
          />
        </div>

        {error && <span className="field-error">{error}</span>}

        <button type="submit" className="cart-place-order">
          Create Account
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/signin">Sign in</Link>
        </p>
      </form>
    </section>
  );
}