import React, { useState, useEffect } from 'react';

interface NotesViewProps {
  value?: string;
  onChange?: (value: string) => void;
}

const NotesView: React.FC<NotesViewProps> = ({ value = '', onChange }) => {
  console.log('[NotesView] value prop:', value);
  return (
    <div className="w-full h-full flex flex-col bg-zinc-900 text-zinc-200 font-mono text-sm p-2">
      <textarea
        className="flex-1 bg-zinc-800 text-zinc-200 p-2 rounded resize-none outline-none border-2 border-zinc-700 focus:border-zinc-700 focus:outline-none"
        value={value}
        style={{ minHeight: 0 }}
        onClick={() => console.log('[NotesView] textarea clicked')}
        onFocus={() => console.log('[NotesView] textarea focused')}
        onChange={e => {
          console.log('[NotesView] onChange fired:', e.target.value);
          onChange && onChange(e.target.value);
        }}
        placeholder="Type your notes here..."
      />
    </div>
  );
};

export default NotesView;
