"use client";

import React, { useState, useEffect } from "react";
import { userMenuClassNames, buttonClassNames } from '../../styles/classNames';
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth';
import { useClickAway } from '../../hooks/useClickAway';
import { UserDropdown } from './UserDropdown';


function UserMenu() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const {
    user, loading, error, mode, setMode, login, signup, logout, setError
  } = useSupabaseAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) setDropdownOpen(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await signup(email, password);
    if (success) setDropdownOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
  };
  
  useClickAway(
    [dropdownRef as React.RefObject<Element>, buttonRef as React.RefObject<Element>],
    () => setDropdownOpen(false),
    dropdownOpen
  );

  return (
    <div className={userMenuClassNames.container}>
      <button
        ref={buttonRef}
        className={`${buttonClassNames.base} ${buttonClassNames.icon}`}
        onClick={() => setDropdownOpen((v) => !v)}
        aria-label="User menu"
        type="button"
      >
        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 8-4 8-4s8 0 8 4" />
        </svg>
      </button>
      {dropdownOpen && (
        <div
          ref={dropdownRef}
          className={userMenuClassNames.dropdown}
        >
          <UserDropdown
            user={user}
            mode={mode}
            setMode={setMode}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            error={error}
            loading={loading}
            handleLogin={handleLogin}
            handleSignup={handleSignup}
            handleLogout={handleLogout}
          />
        </div>
      )}
    </div>
  );
}

export default React.memo(UserMenu);