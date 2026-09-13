import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export default function AccountMenu() {
  const { currentUser, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!currentUser) {
    return (
      <Link to="/signin" className="icon-btn" aria-label="Sign in">
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4 3.5-6 8-6s8 2 8 6" />
        </svg>
      </Link>
    );
  }

  const initial = currentUser.username.charAt(0).toUpperCase();

  return (
    <div className="account-menu" ref={menuRef}>
      <button className="avatar-btn" onClick={() => setOpen((prev) => !prev)} aria-label="Account menu">
        {currentUser.avatar ? (
          <img src={currentUser.avatar} alt={currentUser.username} />
        ) : (
          <span>{initial}</span>
        )}
      </button>

      {open && (
        <div className="account-dropdown">
          <div className="account-dropdown-header">
            <span className="account-dropdown-name">{currentUser.username}</span>
          </div>
          <button
            className="account-dropdown-item"
            onClick={() => {
              setOpen(false);
              navigate("/profile");
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.5-6 8-6s8 2 8 6" /></svg>
            Profile
          </button>
          <button
            className="account-dropdown-item"
            onClick={() => {
              setOpen(false);
              signOut();
              navigate("/");
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><path d="M16 17l5-5-5-5M21 12H9" /></svg>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}