"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { userMenuClassNames, buttonClassNames } from '../styles/classNames';

export default function UserMenu() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const supabase = createClient();
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dropdownOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) { setDropdownOpen(false); }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else setDropdownOpen(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else setDropdownOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setDropdownOpen(false);
  };

  return (
    <div className={userMenuClassNames.container}>
      <button
        ref={buttonRef}
        className={`${buttonClassNames.base} ${buttonClassNames.icon}`}
        onClick={() => setDropdownOpen((v) => !v)}
        aria-label="User menu"
        type="button"
      >
        <svg  fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 8-4 8-4s8 0 8 4" />
        </svg>
      </button>
      {dropdownOpen && (
        <div
          ref={dropdownRef}
          className={userMenuClassNames.dropdown}
        >
          {!user ? (
            <form onSubmit={mode === "login" ? handleLogin : handleSignup} className={userMenuClassNames.form}>
              <label className={userMenuClassNames.label}>Email</label>
              <input
                className={userMenuClassNames.input}
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="username"
              />
              <label className={userMenuClassNames.label}>Password</label>
              <input
                className={userMenuClassNames.input}
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              {error && <div className={userMenuClassNames.error}>{error}</div>}
              <button
                type="submit"
                className={`${buttonClassNames.base} ${buttonClassNames.primary} ${buttonClassNames.sizes.md} w-full`}
                disabled={loading}
              >
                {loading ? (mode === "login" ? "Signing in..." : "Signing up...") : (mode === "login" ? "Sign In" : "Sign Up")}
              </button>
              <button
                type="button"
                className={`${buttonClassNames.base} ${buttonClassNames.ghost} ${buttonClassNames.sizes.sm} underline`}
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
              >
                {mode === "login" ? "Need an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </form>
          ) : (
            <div className={userMenuClassNames.userInfo}>
              <div className={userMenuClassNames.userEmail}>{user.email}</div>
              <button
                className={`${buttonClassNames.base} ${buttonClassNames.secondary} ${buttonClassNames.sizes.md} w-full`}
                onClick={handleLogout}
                type="button"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}