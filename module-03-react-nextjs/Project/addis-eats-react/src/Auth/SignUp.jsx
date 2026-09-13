import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SignUp() {
  const { currentUser, signUp } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
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
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    const result = signUp(username, password);
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
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="field">
          <label>Confirm Password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
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