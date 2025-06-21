"use client";

import { useState } from 'react';
import Header from '../components/Header';
import Workspace from '../components/Workspace';

export default function Home() {
  const [windows, setWindows] = useState([
    { id: 1, x: 50, y: 50, width: 200, height: 150, title: 'Untitled' }
  ]);
  const [nextId, setNextId] = useState(2);

  const addNewWindow = () => {
    const newWindow = {
      id: nextId,
      x: 50 + (nextId - 1) * 30, // Offset new windows slightly
      y: 50 + (nextId - 1) * 30,
      width: 200,
      height: 150,
      title: 'Untitled'
    };
    setWindows(prev => [...prev, newWindow]);
    setNextId(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Header onNewWindow={addNewWindow} />
      <main className="flex-1 flex">
        <Workspace windows={windows} setWindows={setWindows} />
      </main>
    </div>
  );
}
