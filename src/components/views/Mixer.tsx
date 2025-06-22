import React from 'react';

export default function Mixer() {
  return (
    <div className="h-full flex flex-col">
      <div className="text-zinc-300 text-sm mb-3 font-medium">Mixer</div>
      
      <div className="flex gap-2 h-full">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="flex-1 bg-zinc-900 rounded p-2 flex flex-col items-center min-w-0">
            <div className="w-full bg-zinc-700 h-4 rounded mb-2 text-zinc-400 text-xs text-center leading-4">
              Ch {i + 1}
            </div>
            <div className="flex-1 w-4 bg-zinc-600 rounded relative">
              <div 
                className="absolute bottom-0 w-full bg-zinc-400 rounded transition-all" 
                style={{ height: `${20 + i * 10}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}