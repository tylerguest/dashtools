import React from "react";
import { notesGridViewClassNames } from '../../../styles/classNames';

interface NotesRightPaneDefaultProps {
  showNotesPane: boolean;
  setShowNotesPane: (show: boolean) => void;
  onAddNote: () => void;
}

export const NotesRightPaneDefault: React.FC<NotesRightPaneDefaultProps> = ({
  showNotesPane,
  setShowNotesPane,
  onAddNote,
}) => (
  <div className={notesGridViewClassNames.rightPaneDefault}>
    {!showNotesPane && (
      <div className="flex items-start">
        <button
          className={notesGridViewClassNames.showNotesButton}
          onClick={() => setShowNotesPane(true)}
          title="Show notes pane"
          aria-label="Show notes pane"
          style={{ minWidth: 24, minHeight: 24 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    )}
    <div className="flex flex-1 items-center justify-center">
      <button
        className={notesGridViewClassNames.addNoteButton}
        onClick={onAddNote}
        title="Add new note"
      >
        +
      </button>
    </div>
  </div>
);