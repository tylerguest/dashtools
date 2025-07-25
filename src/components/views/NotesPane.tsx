import React from "react";
import { notesGridViewClassNames, buttonClassNames } from '../../styles/classNames';

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

interface NotesPaneProps {
  notes: Note[];
  localNotes: Note[];
  user: any;
  selectedNote: Note | null;
  showNotesPane: boolean;
  isAdding: boolean;
  minNotesPaneWidth: number;
  maxNotesPaneWidth: number;
  notesPaneWidth: number;
  setShowNotesPane: (show: boolean) => void;
  setPendingDeleteId: (id: string | null) => void;
  handleSelectNote: (note: Note) => void;
  handleResizerMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  pendingDeleteId: string | null;
}

export const NotesPane: React.FC<NotesPaneProps> = ({
  notes,
  localNotes,
  user,
  selectedNote,
  showNotesPane,
  isAdding,
  minNotesPaneWidth,
  maxNotesPaneWidth,
  notesPaneWidth,
  setShowNotesPane,
  setPendingDeleteId,
  handleSelectNote,
  handleResizerMouseDown,
  pendingDeleteId,
}) => {
  if (!showNotesPane || isAdding || selectedNote) return null;
  return (
    <>
      <div
        className={notesGridViewClassNames.notesPane}
        style={{
          width: Math.max(minNotesPaneWidth, Math.min(notesPaneWidth, maxNotesPaneWidth)),
          minWidth: minNotesPaneWidth,
          maxWidth: maxNotesPaneWidth,
          transition: 'none',
          userSelect: 'none',
        }}
      >
        <div className={notesGridViewClassNames.notesPaneHeader}>
          <span className={notesGridViewClassNames.notesTitle}>Notes</span>
          <button
            className={`${buttonClassNames.base} ${buttonClassNames.icon}`}
            title="Hide notes pane"
            onClick={() => setShowNotesPane(false)}
            aria-label="Hide notes pane"
            type="button"
            style={{ minWidth: 24, minHeight: 24 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
        <div className={notesGridViewClassNames.notesList}>
          {(user ? notes : localNotes).length === 0 ? (
            <div className={notesGridViewClassNames.emptyNotes}>No notes yet.</div>
          ) : (
            (user ? notes : localNotes).map((note: Note) => (
              <div
                key={note.id}
                className={
                  notesGridViewClassNames.noteRowBase +
                  (selectedNote && (selectedNote as Note).id === note.id
                    ? ' ' + notesGridViewClassNames.noteRowSelected
                    : ' ' + notesGridViewClassNames.noteRowHover)
                }
                onClick={() => handleSelectNote(note)}
              >
                <div className="flex-1 min-w-0">
                  <div className={notesGridViewClassNames.noteTitle}>{note.title || "Untitled"}</div>
                  <div className={notesGridViewClassNames.noteContent}>{note.content.length > 60 ? note.content.slice(0, 60) + "…" : note.content}</div>
                </div>
                <button
                  className={`${buttonClassNames.base} ${buttonClassNames.danger} ${buttonClassNames.sizes.xs} ml-2`}
                  onClick={e => { e.stopPropagation(); setPendingDeleteId(note.id); }}
                  title="Delete note"
                  type="button"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      <div
        className={notesGridViewClassNames.resizer}
        style={{ marginLeft: -1, marginRight: -1 }}
        onMouseDown={handleResizerMouseDown}
        onMouseUp={e => e.stopPropagation()}
        onClick={e => e.stopPropagation()}
        role="separator"
        aria-orientation="vertical"
        tabIndex={0}
        title="Resize notes pane"
      />
    </>
  );
};