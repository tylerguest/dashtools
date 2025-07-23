"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

export default function NotesGridView({ user }: { user: any }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [localNotes, setLocalNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!user) {
      setNotes([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from("notes")
      .select("id, title, content, created_at")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          setNotes([]);
        } else {
          setNotes(data || []);
        }
        setLoading(false);
      });
  }, [user, supabase]);
  const handleAddNote = () => {
    setSelectedNote(null);
    setNewTitle("");
    setNewContent("");
    setShowEditor(true);
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setNewTitle(note.title);
    setNewContent(note.content);
    setShowEditor(true);
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
        setShowEditor(false);
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
        setShowEditor(false);
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

  const handleBackToGrid = async () => {
    if (
      (selectedNote && (selectedNote.title !== newTitle || selectedNote.content !== newContent)) ||
      (!selectedNote && (newTitle.trim() || newContent.trim()))
    ) {
      await handleSave(false); 
    }
    setShowEditor(false);
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
    <div className="h-full w-full p-0 bg-zinc-800">
      {showEditor ? (
        <div className="h-full w-full flex flex-col bg-zinc-800 p-8">
          <div className="flex items-center mb-4">
            <button
              className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-700 hover:bg-zinc-600 text-zinc-200 transition shadow focus:outline-none focus:ring-2 focus:ring-zinc-500"
              onClick={handleBackToGrid}
              title="Back to Notes"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
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
          {/* Save and Cancel buttons removed: autosave is now handled on back navigation */}
        </div>
      ) : loading ? (
        <div className="text-zinc-400 p-4">Loading...</div>
      ) : (
        <div className="w-full min-h-[200px] p-4 bg-zinc-800">
          <div className="w-full min-w-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 items-stretch justify-items-stretch">
            {/* Add Note Card */}
            <div
              className="flex flex-col items-center justify-center min-h-[120px] sm:min-h-[160px] md:min-h-[180px] h-full rounded-2xl bg-zinc-900/60 border border-zinc-700/60 shadow-xl backdrop-blur-md cursor-pointer group p-4 sm:p-6 transition-all duration-200 hover:scale-[1.04] hover:bg-zinc-800/80 hover:border-zinc-500/80 focus:outline-none focus:ring-2 focus:ring-zinc-500 min-w-0 w-full sm:max-w-md sm:mx-auto"
              onClick={handleAddNote}
              title="Add new note"
            >
              <div className="flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 mb-2 sm:mb-3 rounded-full bg-zinc-700/80 group-hover:bg-zinc-600/90 transition-all duration-200 shadow-lg">
                <span className="text-2xl sm:text-4xl text-zinc-300 group-hover:text-white select-none">+</span>
              </div>
              <span className="text-zinc-400 group-hover:text-zinc-100 font-semibold tracking-wide text-base sm:text-lg select-none text-center">Add Note</span>
            </div>
            {/* Notes Grid */}
            {(user ? notes : localNotes).length === 0 ? (
              <div className="col-span-full text-center text-zinc-500 py-12 text-lg font-medium">
                No notes yet.
              </div>
            ) : (
              (user ? notes : localNotes).map((note) => (
                <div
                  key={note.id}
                  className="relative flex flex-col justify-between min-h-[120px] sm:min-h-[160px] md:min-h-[180px] h-full rounded-2xl bg-zinc-900/70 border border-zinc-700/70 shadow-lg backdrop-blur-md p-4 sm:p-6 cursor-pointer transition-all duration-200 hover:scale-[1.03] hover:bg-zinc-800/90 hover:border-zinc-500/80 group min-w-0 w-full sm:max-w-md sm:mx-auto"
                  onClick={() => handleEditNote(note)}
                >
                  {/* Delete icon */}
                  <button
                    className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 p-1 sm:p-1.5 rounded-full bg-transparent hover:bg-zinc-700/60 focus:bg-zinc-700/80 transition group"
                    title="Delete note"
                    aria-label="Delete note"
                    onClick={e => {
                      e.stopPropagation();
                      setPendingDeleteId(note.id);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-zinc-400 group-hover:text-red-500 group-focus:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.12" fill="none" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 8l8 8M16 8l-8 8" />
                    </svg>
                  </button>
                  <div>
                    <div className="font-bold text-zinc-100 mb-1 sm:mb-2 truncate pr-8 text-base sm:text-lg group-hover:text-white transition-colors">{note.title || "Untitled"}</div>
                    <div className="text-zinc-300 text-sm sm:text-base group-hover:text-zinc-100 transition-colors break-words">
                      {note.content.length > 100
                        ? note.content.slice(0, 100) + "…"
                        : note.content}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      {/* Custom Delete Confirmation Modal */}
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
