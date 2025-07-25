import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";

export interface Note { id: string; title: string; content: string; created_at: string; }

export function useNotesGridView(user: any) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [localNotes, setLocalNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [showNotesPane, setShowNotesPane] = useState(true);
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

  const handleAddNote = useCallback(() => {
    setSelectedNote(null);
    setNewTitle("");
    setNewContent("");
    setIsAdding(true);
  }, []);

  const handleSelectNote = useCallback((note: Note) => {
    setSelectedNote(note);
    setNewTitle(note.title);
    setNewContent(note.content);
    setIsAdding(false);
  }, []);

  const handleSave = useCallback(async (closeEditor = true) => {
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
      }
      setNotes(data || []);
    } catch (err) {
      alert("Unexpected error: " + (err instanceof Error ? err.message : String(err)));
    }
  }, [user, selectedNote, newTitle, newContent, supabase]);

  const handleBackToList = useCallback(async () => {
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
  }, [selectedNote, newTitle, newContent, isAdding, handleSave]);

  const handleDeleteNote = useCallback(async (id: string) => {
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
  }, [user, supabase]);

  return {
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
  };
}
