import { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "./auth/AuthContext";

function SignIn() {
  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/";

  function handleSignIn(e) {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Please enter both a username and password.");
      return;
    }

    signIn();
    navigate(from, { replace: true });
  }

  return (
    <div className="signin-page">
      <h2>Sign in</h2>
      <p>Sign in to continue to checkout.</p>

      <form onSubmit={handleSignIn}>
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </label>

        {error && <span className="field-error">{error}</span>}

        <p className="signin-hint">
          Demo credentials — username: <strong>demo</strong>, password: <strong>demo123</strong>
        </p>

        <button type="submit">Sign in</button>
      </form>
    </div>
  );
}

export default SignIn;