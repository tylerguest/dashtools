
"use client";

import React, { useEffect, useState } from "react";
import { notesGridViewClassNames } from '../../styles/classNames';
import { createClient } from "@/utils/supabase/client";
import { NotesPane } from "./NotesPane";
import { NoteForm } from "./NoteForm";
import { NotesRightPaneDefault } from "./NotesRightPaneDefault";
import { DeleteNoteModal } from "./DeleteNoteModal";


import { useNotesGridView } from "@/hooks/useNotesGridView";
import { useNotesPaneResizer } from "@/hooks/useNotesPaneResizer";

export default function NotesGridView({ user }: { user: any }) {
  const minNotesPaneWidth = 180;
  const maxNotesPaneWidth = 400;
  const {
    notes,
    localNotes,
    loading,
    selectedNote,
    isAdding,
    newTitle,
    newContent,
    pendingDeleteId,
    showNotesPane,
    setShowNotesPane,
    setPendingDeleteId,
    setNewTitle,
    setNewContent,
    setIsAdding,
    setSelectedNote,
    handleAddNote,
    handleSelectNote,
    handleSave,
    handleBackToList,
    handleDeleteNote,
  } = useNotesGridView(user);
  const { notesPaneWidth, handleResizerMouseDown } = useNotesPaneResizer(260, minNotesPaneWidth, maxNotesPaneWidth);

  return (
    <div className={notesGridViewClassNames.container}>
      <NotesPane
        notes={notes}
        localNotes={localNotes}
        user={user}
        selectedNote={selectedNote}
        showNotesPane={showNotesPane}
        isAdding={isAdding}
        minNotesPaneWidth={minNotesPaneWidth}
        maxNotesPaneWidth={maxNotesPaneWidth}
        notesPaneWidth={notesPaneWidth}
        setShowNotesPane={setShowNotesPane}
        setPendingDeleteId={setPendingDeleteId}
        handleSelectNote={handleSelectNote}
        handleResizerMouseDown={handleResizerMouseDown}
        pendingDeleteId={pendingDeleteId}
      />
      <div className={notesGridViewClassNames.rightPane}>
        {loading ? (
          <div className={notesGridViewClassNames.loading}>Loading...</div>
        ) : isAdding ? (
          <NoteForm
            isEditing={false}
            title={newTitle}
            content={newContent}
            onTitleChange={setNewTitle}
            onContentChange={setNewContent}
            onBack={handleBackToList}
            onSave={() => handleSave()}
          />
        ) : selectedNote ? (
          <NoteForm
            isEditing={true}
            title={newTitle}
            content={newContent}
            onTitleChange={setNewTitle}
            onContentChange={setNewContent}
            onBack={handleBackToList}
            onSave={() => handleSave()}
          />
        ) : (
          <NotesRightPaneDefault
            showNotesPane={showNotesPane}
            setShowNotesPane={setShowNotesPane}
            onAddNote={handleAddNote}
          />
        )}
      </div>
      {pendingDeleteId && (
        <DeleteNoteModal
          onCancel={() => setPendingDeleteId(null)}
          onConfirm={() => handleDeleteNote(pendingDeleteId)}
        />
      )}
    </div>
  );
}
