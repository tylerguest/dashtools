"use client";

import React from 'react';
import UserMenu from './UserMenu';

interface HeaderProps {
  onNewWindow: () => void;
}

export default function Header({ onNewWindow }: HeaderProps) {
  return (
    <header className="bg-zinc-900 border-b border-zinc-700 px-4 py-3 flex justify-between items-center">
      <div className="flex items-center gap-6">
        <h1 className="text-zinc-200 text-lg font-black">dashtools</h1>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={onNewWindow} className="text-zinc-200 text-xl font-bold px-2 py-1 rounded hover:bg-zinc-800">+</button>
        <UserMenu />
      </div>
    </header>
  );
}