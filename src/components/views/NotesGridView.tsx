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
      .then(({ data }) => {
        setNotes(data || []);
        setLoading(false);
      });
  }, [user]);

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

  const handleSave = async () => {
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
      setShowEditor(false);
      setSelectedNote(null);
      setNewTitle('');
      setNewContent('');
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
      setShowEditor(false);
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

  return (
    <div className="h-full w-full p-0 bg-zinc-800">
      {showEditor ? (
        <div className="h-full w-full flex flex-col bg-zinc-800 p-8">
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
          <div className="flex gap-2 justify-end mt-6">
            <button
              className="px-4 py-2 rounded text-zinc-600 hover:bg-zinc-200 transition"
              onClick={() => setShowEditor(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-900 text-white font-bold transition"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        loading ? (
          <div className="text-zinc-400 p-4">Loading...</div>
        ) : (
          <div className="w-full min-h-[200px] p-4 bg-zinc-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch justify-items-stretch">
              <div
                className="flex flex-col items-center justify-center min-h-[180px] h-full border-2 border-dashed border-zinc-500 rounded-lg bg-zinc-800 hover:bg-zinc-700 hover:border-zinc-400 transition-all duration-200 shadow-md cursor-pointer group p-4"
                onClick={handleAddNote}
                title="Add new note"
              >
                <div className="flex items-center justify-center w-12 h-12 mb-2 rounded-full bg-zinc-700 group-hover:bg-zinc-600 transition-all duration-200 shadow">
                  <span className="text-3xl text-zinc-300 group-hover:text-white">+</span>
                </div>
                <span className="text-zinc-400 group-hover:text-zinc-100 font-medium">Add Note</span>
              </div>
              {(user ? notes : localNotes).length === 0 ? (
                <div className="col-span-full text-center text-zinc-500 py-12">
                </div>
              ) : (
                (user ? notes : localNotes).map((note) => (
                  <div
                    key={note.id}
                    className="relative flex flex-col justify-between min-h-[180px] h-full bg-zinc-800 border border-zinc-700 rounded p-4 cursor-pointer hover:bg-zinc-700 transition"
                    onClick={() => handleEditNote(note)}
                  >
                    {/* Delete icon */}
                    <button
                      className="absolute top-2 right-2 z-10 p-1 rounded-full bg-transparent hover:bg-zinc-700/60 focus:bg-zinc-700/80 transition group"
                      title="Delete note"
                      aria-label="Delete note"
                      onClick={e => {
                        e.stopPropagation();
                        if (window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
                          handleDeleteNote(note.id);
                        }
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-zinc-400 group-hover:text-red-500 group-focus:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.12" fill="none" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 8l8 8M16 8l-8 8" />
                      </svg>
                    </button>
                    <div>
                      <div className="font-bold text-zinc-100 mb-2 truncate">{note.title || "Untitled"}</div>
                      <div className="text-zinc-400 text-xs mb-2">{new Date(note.created_at).toLocaleString()}</div>
                      <div className="text-zinc-300 text-sm">
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
        )
      )}
    </div>
  );

  // Delete note handler
  async function handleDeleteNote(id: string) {
    if (!user || !user.id) {
      setLocalNotes(prev => prev.filter(n => n.id !== id));
      return;
    }
    try {
      const { error } = await supabase.from("notes").delete().eq("id", id);
      if (error) {
        alert("Failed to delete note: " + error.message);
        return;
      }
      setNotes(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      alert("Unexpected error: " + (err instanceof Error ? err.message : String(err)));
    }
  }
}
