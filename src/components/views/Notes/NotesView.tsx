import React, { useState, useEffect } from 'react';
import { notesViewClassNames } from '../../../styles/classNames';

interface NotesViewProps { value?: string; onChange?: (value: string) => void; }

const NotesView: React.FC<NotesViewProps> = ({ value = '', onChange }) => {
  return (
    <div className={notesViewClassNames.container}>
      <textarea
        className={notesViewClassNames.textarea}
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
