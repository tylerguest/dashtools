import React from "react";
import { notesGridViewClassNames } from '../../styles/classNames';

interface DeleteNoteModalProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteNoteModal: React.FC<DeleteNoteModalProps> = ({
  onCancel,
  onConfirm,
}) => (
  <div className={notesGridViewClassNames.deleteModalOverlay}>
    <div className={notesGridViewClassNames.deleteModal}>
      <div className={notesGridViewClassNames.deleteModalTitle}>Delete Note</div>
      <div className={notesGridViewClassNames.deleteModalText}>
        Are you sure you want to delete this note? <br />This action cannot be undone.
      </div>
      <div className={notesGridViewClassNames.deleteModalActions}>
        <button
          className={notesGridViewClassNames.cancelButton}
          onClick={onCancel}
          type="button"
        >
          Cancel
        </button>
        <button
          className={notesGridViewClassNames.confirmDeleteButton}
          onClick={onConfirm}
          type="button"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);