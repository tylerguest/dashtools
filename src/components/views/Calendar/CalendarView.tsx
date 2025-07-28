import React, { useState, useEffect } from 'react';
import {  } from '../../../styles/classNames';

interface CalendarViewProps { value?: string; onChange?: (value: string) => void; }

const CalendarView: React.FC<CalendarViewProps> = ({ value = '', onChange }) => {
  return (
    <div>
      <textarea
        value={value}
        style={{ minHeight: 0 }}
        onClick={() => console.log('[NotesView] textarea clicked')}
        onFocus={() => console.log('[NotesView] textarea focused')}
        onChange={e => {
          onChange && onChange(e.target.value);
        }}
        placeholder="Type your notes here..."
      />
    </div>
  );
};

export default CalendarView;
