"use client";

import React, { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function UserMenu() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { data: session } = useSession();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid credentials");
    } else {
      setDropdownOpen(false);
      setUsername("");
      setPassword("");
    }
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
          {!session ? (
            <form onSubmit={handleLogin} className="flex flex-col gap-2">
              <label className="text-zinc-200 text-sm">Username</label>
              <input
                className="rounded bg-zinc-800 px-3 py-2 outline-none border border-zinc-700 focus:border-blue-500 text-zinc-200"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
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
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="text-zinc-200 font-bold">{session.user?.name || session.user?.email}</div>
              <div className="text-zinc-400 text-xs">{session.user?.email}</div>
              <button
                className="bg-zinc-700 hover:bg-zinc-600 text-zinc-200 px-4 py-2 rounded font-bold mt-2"
                onClick={() => { signOut(); setDropdownOpen(false); }}
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