import React from "react";
import { userMenuClassNames, buttonClassNames } from '../../styles/classNames';

export function UserDropdown({
  user, mode, setMode, email, setEmail, password, setPassword, error, loading, handleLogin, handleSignup, handleLogout,
}: {
  user: any; mode: "login" | "signup"; setMode: (mode: "login" | "signup") => void; email: string; setEmail: (email: string) => void;
  password: string; setPassword: (password: string) => void; error: string; loading: boolean;
  handleLogin: (e: React.FormEvent) => void; handleSignup: (e: React.FormEvent) => void; handleLogout: () => void;
}) {
  return !user ? (
    <form onSubmit={mode === "login" ? handleLogin : handleSignup} className={userMenuClassNames.form}>
      <label className={userMenuClassNames.label}>Email</label>
      <input className={userMenuClassNames.input} type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="username" />
      <label className={userMenuClassNames.label}>Password</label>
      <input className={userMenuClassNames.input} type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
      {error && <div className={userMenuClassNames.error}>{error}</div>}
      <button type="submit" className={`${buttonClassNames.base} ${buttonClassNames.primary} ${buttonClassNames.sizes.md} w-full`} disabled={loading}>
        {loading ? (mode === "login" ? "Signing in..." : "Signing up...") : (mode === "login" ? "Sign In" : "Sign Up")}
      </button>
      <button type="button" className={`${buttonClassNames.base} ${buttonClassNames.ghost} ${buttonClassNames.sizes.sm} underline`} onClick={() => setMode(mode === "login" ? "signup" : "login")}>
        {mode === "login" ? "Need an account? Sign up" : "Already have an account? Sign in"}
      </button>
    </form>
  ) : (
    <div className={userMenuClassNames.userInfo}>
      <div className={userMenuClassNames.userEmail}>{user.email}</div>
      <button className={`${buttonClassNames.base} ${buttonClassNames.secondary} ${buttonClassNames.sizes.md} w-full`} onClick={handleLogout} type="button">Sign Out</button>
    </div>
  );
}
