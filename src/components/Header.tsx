import React from 'react';

export default function Header() {
  return (
    <header className="bg-gray-900 p-4 border-b border-gray-700 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <h1 className="text-xl font-bold">WebTools</h1>
      </div>
    </header>
  );
}