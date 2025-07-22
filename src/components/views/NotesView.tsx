import React, { useState, useEffect } from 'react';

interface NotesViewProps {
  value?: string;
  onChange?: (value: string) => void;
}

const NotesView: React.FC<NotesViewProps> = ({ value = '', onChange }) => {
  console.log('[NotesView] value prop:', value);
  return (
    <div
      style={{ width: '100%', height: '100%', background: 'yellow', border: '2px solid red' }}
    >
      <textarea
        className="w-full h-full bg-yellow-100 text-black p-2 rounded resize-none outline-none border-4 border-blue-500"
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
