import React from "react";
import { notesGridViewClassNames } from '../../../styles/classNames';

interface NoteFormProps {
  isEditing: boolean;
  title: string;
  content: string;
  onTitleChange: (val: string) => void;
  onContentChange: (val: string) => void;
  onBack: () => void;
  onSave?: () => void;
}

export const NoteForm: React.FC<NoteFormProps> = ({
  isEditing,
  title,
  content,
  onTitleChange,
  onContentChange,
  onBack,
  onSave,
}) => (
  <div className={notesGridViewClassNames.noteFormContainer}>
    <div className={notesGridViewClassNames.noteFormHeader}>
      <button
        className={notesGridViewClassNames.backButton}
        onClick={onBack}
        title="Back to Notes"
        type="button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <span className={notesGridViewClassNames.noteFormTitle}>
        {isEditing ? "Edit Note" : "New Note"}
      </span>
    </div>
    <input
      className={notesGridViewClassNames.noteInput}
      type="text"
      placeholder="Title"
      value={title}
      onChange={e => onTitleChange(e.target.value)}
      autoFocus
    />
    <textarea
      className={notesGridViewClassNames.noteTextarea}
      placeholder="Write your note..."
      value={content}
      onChange={e => onContentChange(e.target.value)}
      style={{ minHeight: '300px' }}
    />
  </div>
);