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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div
                className="flex flex-col items-center justify-center border-2 border-zinc-400 bg-zinc-800 rounded p-4 cursor-pointer hover:border-zinc-900 hover:bg-zinc-800 transition min-h-[120px]"
                onClick={handleAddNote}
                title="Add new note"
              >
                <span className="text-3xl text-zinc-400 font-light mb-1">+</span>
                <span className="text-zinc-500 text-sm">Add Note</span>
              </div>
              {(user ? notes : localNotes).length === 0 ? (
                <div className="col-span-full text-center text-zinc-500 py-12">
                </div>
              ) : (
                (user ? notes : localNotes).map((note) => (
                  <div
                    key={note.id}
                    className="bg-zinc-800 border border-zinc-700 rounded p-4 cursor-pointer hover:bg-zinc-700 transition"
                    onClick={() => handleEditNote(note)}
                  >
                    <div className="font-bold text-zinc-100 mb-2 truncate">{note.title || "Untitled"}</div>
                    <div className="text-zinc-400 text-xs mb-2">{new Date(note.created_at).toLocaleString()}</div>
                    <div className="text-zinc-300 text-sm">
                      {note.content.length > 100
                        ? note.content.slice(0, 100) + "…"
                        : note.content}
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
}
