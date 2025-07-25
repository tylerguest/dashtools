import React from 'react';
import WindowContent from './WindowContent';
import { windowClassNames } from '../../styles/classNames';
import { WindowContent as WindowContentType } from '../../types/window';

interface WindowBodyProps {
  content: string;
  notes: string;
  updateNotes: (notes: string) => void;
  user?: any;
}

const WindowBody: React.FC<WindowBodyProps> = ({
  content,
  notes,
  updateNotes,
  user,
}) => (
  <div className={windowClassNames.content}>
    <WindowContent
      content={content as WindowContentType}
      notes={notes}
      onNotesChange={updateNotes}
      user={user}
    />
  </div>
);

export default WindowBody;