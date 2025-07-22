"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function UserMenu() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const supabase = createClient();

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
    <div className="relative">
      <button
        className="w-9 h-9 flex items-center justify-center rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200"
        onClick={() => setDropdownOpen((v) => !v)}
        aria-label="User menu"
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 8-4 8-4s8 0 8 4" />
        </svg>
      </button>
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-zinc-700 rounded shadow-lg z-[9999] p-4">
          {!user ? (
            <form onSubmit={mode === "login" ? handleLogin : handleSignup} className="flex flex-col gap-2">
              <label className="text-zinc-200 text-sm">Email</label>
              <input
                className="rounded bg-zinc-800 px-3 py-2 outline-none border border-zinc-700 focus:border-blue-500 text-zinc-200"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="username"
              />
              <label className="text-zinc-200 text-sm">Password</label>
              <input
                className="rounded bg-zinc-800 px-3 py-2 outline-none border border-zinc-700 focus:border-blue-500 text-zinc-200"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              {error && <div className="text-red-400 text-xs">{error}</div>}
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold mt-2"
                disabled={loading}
              >
                {loading ? (mode === "login" ? "Signing in..." : "Signing up...") : (mode === "login" ? "Sign In" : "Sign Up")}
              </button>
              <button
                type="button"
                className="text-xs text-blue-400 mt-1 underline"
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
              >
                {mode === "login" ? "Need an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </form>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="text-zinc-200 font-bold">{user.email}</div>
              <button
                className="bg-zinc-700 hover:bg-zinc-600 text-zinc-200 px-4 py-2 rounded font-bold mt-2"
                onClick={handleLogout}
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