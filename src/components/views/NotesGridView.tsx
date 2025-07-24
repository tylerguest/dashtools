
"use client";

import React, { useEffect, useState } from "react";
import { notesGridViewClassNames, buttonClassNames } from '../../styles/classNames';
import { createClient } from "@/utils/supabase/client";

interface Note { id: string; title: string; content: string; created_at: string; }

export default function NotesGridView({ user }: { user: any }) {
  const minNotesPaneWidth = 180;
  const maxNotesPaneWidth = 400;
  const handleResizerMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation(); 
    const startX = e.clientX;
    const startWidth = notesPaneWidth;
    const originalUserSelect = document.body.style.userSelect;
    document.body.style.userSelect = 'none';
    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      let newWidth = startWidth + delta;
      if (newWidth < minNotesPaneWidth) newWidth = minNotesPaneWidth;
      if (newWidth > maxNotesPaneWidth) newWidth = maxNotesPaneWidth;
      setNotesPaneWidth(newWidth);
    };
    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      document.body.style.userSelect = originalUserSelect;
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };
  const [notes, setNotes] = useState<Note[]>([]);
  const [localNotes, setLocalNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [showNotesPane, setShowNotesPane] = useState(true);
  const [notesPaneWidth, setNotesPaneWidth] = useState(260); 
  const supabase = createClient();

  useEffect(() => {
    if (!user) { setNotes([]); setLoading(false); return; }
    setLoading(true);
    supabase
      .from("notes")
      .select("id, title, content, created_at")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) { setNotes([]); } 
        else { setNotes(data || []); }
        setLoading(false);
      });
  }, [user, supabase]);
  const handleAddNote = () => {
    setSelectedNote(null);
    setNewTitle("");
    setNewContent("");
    setIsAdding(true);
  };

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setNewTitle(note.title);
    setNewContent(note.content);
    setIsAdding(false);
  };

  const handleSave = async (closeEditor = true) => {
    if (!user || !user.id) {
      if (selectedNote) {
        setLocalNotes((prev) =>
          prev.map((n) =>
            n.id === selectedNote.id
              ? { ...n, title: newTitle, content: newContent }
              : n
          )
        );
      } else {
        setLocalNotes((prev) => [
          {
            id: Math.random().toString(36).slice(2),
            title: newTitle,
            content: newContent,
            created_at: new Date().toISOString(),
          },
          ...prev,
        ]);
      }
      if (closeEditor) {
        setIsAdding(false);
        setSelectedNote(null);
        setNewTitle("");
        setNewContent("");
      }
      return;
    }
    try {
      let error = null;
      if (selectedNote) {
        const { error: updateError } = await supabase
          .from("notes")
          .update({ title: newTitle, content: newContent })
          .eq("id", selectedNote.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from("notes").insert({
          user_id: user.id,
          title: newTitle,
          content: newContent,
        });
        error = insertError;
      }
      if (error) {
        alert("Failed to save note: " + error.message);
        console.error("Supabase error saving note:", error);
        return;
      }
      if (closeEditor) {
        setIsAdding(false);
        setSelectedNote(null);
        setNewTitle("");
        setNewContent("");
      }
      const { data, error: fetchError } = await supabase
        .from("notes")
        .select("id, title, content, created_at")
        .order("created_at", { ascending: false });
      if (fetchError) {
        alert("Failed to fetch notes: " + fetchError.message);
        console.error("Supabase error fetching notes:", fetchError);
      }
      setNotes(data || []);
    } catch (err) {
      alert("Unexpected error: " + (err instanceof Error ? err.message : String(err)));
      console.error("Unexpected error in handleSave:", err);
    }
  };

  const handleBackToList = async () => {
    if (
      (selectedNote && (selectedNote.title !== newTitle || selectedNote.content !== newContent)) ||
      (isAdding && (newTitle.trim() || newContent.trim()))
    ) {
      await handleSave(false);
    }
    setIsAdding(false);
    setSelectedNote(null);
    setNewTitle("");
    setNewContent("");
  };

  const handleDeleteNote = async (id: string) => {
    if (!user || !user.id) {
      setLocalNotes((prev) => prev.filter((n) => n.id !== id));
      setPendingDeleteId(null);
      return;
    }
    try {
      const { error } = await supabase.from("notes").delete().eq("id", id);
      if (error) {
        alert("Failed to delete note: " + error.message);
        setPendingDeleteId(null);
        return;
      }
      const { data, error: fetchError } = await supabase
        .from("notes")
        .select("id, title, content, created_at")
        .order("created_at", { ascending: false });
      if (fetchError) {
        alert("Failed to fetch notes: " + fetchError.message);
      }
      setNotes(data || []);
    } catch (err) {
      alert("Unexpected error: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setPendingDeleteId(null);
    }
  };

  return (
    <div className={notesGridViewClassNames.container}>
      {/* Only show left column if not editing or adding */}
      {showNotesPane && !(isAdding || selectedNote) && (
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
          {/* Vertical resizer */}
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
      )}
      {/* Right pane: Note content or add form */}
      <div className={notesGridViewClassNames.rightPane}>
        {loading ? (
          <div className={notesGridViewClassNames.loading}>Loading...</div>
        ) : isAdding ? (
          <div className={notesGridViewClassNames.noteFormContainer}>
            <div className={notesGridViewClassNames.noteFormHeader}>
              <button
                className={notesGridViewClassNames.backButton}
                onClick={handleBackToList}
                title="Back to Notes"
                type="button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className={notesGridViewClassNames.noteFormTitle}>New Note</span>
            </div>
            <input
              className={notesGridViewClassNames.noteInput}
              type="text"
              placeholder="Title"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              autoFocus
            />
            <textarea
              className={notesGridViewClassNames.noteTextarea}
              placeholder="Write your note..."
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              style={{ minHeight: '300px' }}
            />
          </div>
        ) : selectedNote ? (
          <div className={notesGridViewClassNames.noteFormContainer}>
            <div className={notesGridViewClassNames.noteFormHeader}>
              <button
                className={notesGridViewClassNames.backButton}
                onClick={handleBackToList}
                title="Back to Notes"
                type="button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className={notesGridViewClassNames.noteFormTitle}>Edit Note</span>
            </div>
            <input
              className={notesGridViewClassNames.noteInput}
              type="text"
              placeholder="Title"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              autoFocus
            />
            <textarea
              className={notesGridViewClassNames.noteTextarea}
              placeholder="Write your note..."
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              style={{ minHeight: '300px' }}
            />
          </div>
        ) : (
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
                onClick={handleAddNote}
                title="Add new note"
              >
              +
              </button>
            </div>
          </div>
        )}
      </div>
      {pendingDeleteId && (
        <div className={notesGridViewClassNames.deleteModalOverlay}>
          <div className={notesGridViewClassNames.deleteModal}>
            <div className={notesGridViewClassNames.deleteModalTitle}>Delete Note</div>
            <div className={notesGridViewClassNames.deleteModalText}>Are you sure you want to delete this note? <br />This action cannot be undone.</div>
            <div className={notesGridViewClassNames.deleteModalActions}>
              <button
                className={notesGridViewClassNames.cancelButton}
                onClick={() => setPendingDeleteId(null)}
                type="button"
              >
                Cancel
              </button>
              <button
                className={notesGridViewClassNames.confirmDeleteButton}
                onClick={() => handleDeleteNote(pendingDeleteId)}
                type="button"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
