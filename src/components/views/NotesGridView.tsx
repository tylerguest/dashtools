"use client";

import React, { useEffect, useState } from "react";
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
  const [notesPaneWidth, setNotesPaneWidth] = useState(260); // px, default width
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
    <div className="h-full w-full flex bg-zinc-800">
      {/* Only show left column if not editing or adding */}
      {showNotesPane && !(isAdding || selectedNote) && (
        <>
          <div
            className="h-full border-r border-zinc-700 bg-zinc-900/95 flex flex-col"
            style={{
              width: Math.max(minNotesPaneWidth, Math.min(notesPaneWidth, maxNotesPaneWidth)),
              minWidth: minNotesPaneWidth,
              maxWidth: maxNotesPaneWidth,
              transition: 'none', // disables unwanted transitions
              userSelect: 'none', // disables text selection while resizing
            }}
          >
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
            <span className="text-lg font-bold text-zinc-100">Notes</span>
            <button
              className="ml-1 px-1 py-0 text-zinc-400 hover:text-zinc-200 text-sm border-none bg-transparent transition-all focus:outline-none flex items-center justify-center"
              title="Hide notes pane"
              onClick={() => setShowNotesPane(false)}
              aria-label="Hide notes pane"
              style={{ minWidth: 24, minHeight: 24 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {(user ? notes : localNotes).length === 0 ? (
              <div className="text-zinc-500 text-center py-8">No notes yet.</div>
            ) : (
            (user ? notes : localNotes).map((note: Note) => (
              <div
                key={note.id}
                className={`group flex items-center px-4 py-3 border-b border-zinc-800 cursor-pointer transition-all ${selectedNote && (selectedNote as Note).id === note.id ? 'bg-zinc-800/80' : 'hover:bg-zinc-800/60'}`}
                onClick={() => handleSelectNote(note)}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-zinc-100 truncate text-base">{note.title || "Untitled"}</div>
                  <div className="text-zinc-400 text-xs truncate">{note.content.length > 60 ? note.content.slice(0, 60) + "…" : note.content}</div>
                </div>
                <button
                  className="ml-2 text-red-500 opacity-70 hover:opacity-100 text-sm font-bold px-1 rounded transition-all"
                  onClick={e => { e.stopPropagation(); setPendingDeleteId(note.id); }}
                  title="Delete note"
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
            className="group w-2 cursor-col-resize h-full bg-transparent hover:bg-zinc-700/40 transition-colors z-30 select-none"
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
      <div className="flex-1 h-full flex flex-col bg-zinc-800">
        {loading ? (
          <div className="text-zinc-400 p-8">Loading...</div>
        ) : isAdding ? (
          <div className="h-full w-full flex flex-col p-8">
            <div className="flex items-center mb-4">
              <button
                className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-700 hover:bg-zinc-600 text-zinc-200 transition shadow focus:outline-none focus:ring-2 focus:ring-zinc-500"
                onClick={handleBackToList}
                title="Back to Notes"
                type="button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="ml-3 text-xl font-semibold text-zinc-100">New Note</span>
            </div>
            <input
              className="mb-4 text-2xl font-semibold bg-transparent border-none outline-none text-white placeholder-zinc-400"
              type="text"
              placeholder="Title"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              autoFocus
            />
            <textarea
              className="flex-1 resize-none bg-zinc-800 border-none outline-none text-white placeholder-zinc-400 text-lg"
              placeholder="Write your note..."
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              style={{ minHeight: '300px' }}
            />
          </div>
        ) : selectedNote ? (
          <div className="h-full w-full flex flex-col p-8">
            <div className="flex items-center mb-4">
              <button
                className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-700 hover:bg-zinc-600 text-zinc-200 transition shadow focus:outline-none focus:ring-2 focus:ring-zinc-500"
                onClick={handleBackToList}
                title="Back to Notes"
                type="button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="ml-3 text-xl font-semibold text-zinc-100">Edit Note</span>
            </div>
            <input
              className="mb-4 text-2xl font-semibold bg-transparent border-none outline-none text-white placeholder-zinc-400"
              type="text"
              placeholder="Title"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              autoFocus
            />
            <textarea
              className="flex-1 resize-none bg-zinc-800 border-none outline-none text-white placeholder-zinc-400 text-lg"
              placeholder="Write your note..."
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              style={{ minHeight: '300px' }}
            />
          </div>
        ) : (
          <div className="flex flex-col h-full w-full">
            {!showNotesPane && (
              <div className="flex items-start">
                <button
                  className="mt-3 ml-3 px-1 py-0 text-zinc-400 hover:text-zinc-200 text-sm border-none bg-transparent transition-all focus:outline-none flex items-center justify-center"
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
                className="px-4 py-1 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-zinc-500 border border-zinc-600 shadow-none rounded-none"
                onClick={handleAddNote}
                title="Add new note"
              >
                + New Note
              </button>
            </div>
          </div>
        )}
      </div>
      {pendingDeleteId && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-8 min-w-[340px] max-w-[90vw] flex flex-col items-center animate-fadeIn">
            <div className="text-2xl font-bold text-white mb-2 tracking-tight">Delete Note</div>
            <div className="text-zinc-400 mb-8 text-center text-base">Are you sure you want to delete this note? <br />This action cannot be undone.</div>
            <div className="flex gap-4 w-full justify-center">
              <button
                className="px-6 py-2 rounded-full bg-zinc-700 hover:bg-zinc-600 active:bg-zinc-800 text-zinc-200 font-semibold transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
                onClick={() => setPendingDeleteId(null)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 rounded-full bg-gradient-to-tr from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 active:from-red-800 active:to-red-700 text-white font-bold transition-all shadow focus:outline-none focus:ring-2 focus:ring-red-500"
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
