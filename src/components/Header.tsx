"use client";

import React from 'react';

interface HeaderProps {
  onNewWindow: () => void;
}

export default function Header({ onNewWindow }: HeaderProps) {
  return (
    <header className="bg-zinc-900 border-b border-zinc-700 px-4 py-2 flex justify-between items-center">
      <h1 className="text-zinc-200 text-lg font-black">WebTools</h1>
      <button
        onClick={onNewWindow}
        className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-sm rounded border border-zinc-600 hover:border-zinc-500 transition-colors"
      >
        + New Window
      </button>
    </header>
  );
}