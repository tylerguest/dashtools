"use client";

import { useState } from 'react';
import Workspace from '../components/Workspace';

export default function Home() {
  const [windows, setWindows] = useState([
    { id: 1, x: 50, y: 50, width: 200, height: 150, title: 'Window 1' }
  ]);
  const [nextId, setNextId] = useState(2);

  const addNewWindow = () => {
    const newWindow = {
      id: nextId,
      x: 50 + (nextId - 1) * 30, // Offset new windows slightly
      y: 50 + (nextId - 1) * 30,
      width: 200,
      height: 150,
      title: `Window ${nextId}`
    };
    setWindows(prev => [...prev, newWindow]);
    setNextId(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <header className="bg-zinc-900 border-b border-zinc-700 px-4 py-2 flex justify-between items-center">
        <h1 className="text-zinc-200 text-lg font-black">WebTools</h1>
        <button
          onClick={addNewWindow}
          className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-sm rounded border border-zinc-600 hover:border-zinc-500 transition-colors"
        >
          + New Window
        </button>
      </header>
      <main className="flex-1 flex">
        <Workspace windows={windows} setWindows={setWindows} />
      </main>
    </div>
  );
}
