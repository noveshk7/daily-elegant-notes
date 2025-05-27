
import { useState, useEffect, useMemo } from "react";
import { startOfDay } from "date-fns";

export interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "daily-notes-app";

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Load notes from localStorage on mount
  useEffect(() => {
    try {
      const storedNotes = localStorage.getItem(STORAGE_KEY);
      if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes);
        setNotes(parsedNotes);
      }
    } catch (error) {
      console.error("Error loading notes from localStorage:", error);
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error("Error saving notes to localStorage:", error);
    }
  }, [notes]);

  const addNote = (date: Date): Note => {
    const now = new Date().toISOString();
    const newNote: Note = {
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: "Untitled Note",
      content: "",
      date: date.toISOString(),
      createdAt: now,
      updatedAt: now,
    };

    setNotes(prev => [newNote, ...prev]);
    return newNote;
  };

  const updateNote = (id: string, content: string, title: string) => {
    setNotes(prev => prev.map(note => 
      note.id === id 
        ? { 
            ...note, 
            content, 
            title: title || "Untitled Note",
            updatedAt: new Date().toISOString() 
          }
        : note
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    if (selectedNote === id) {
      setSelectedNote(null);
    }
  };

  // Filter notes based on search term
  const filteredNotes = useMemo(() => {
    if (!searchTerm.trim()) return notes;
    
    const lowercaseSearch = searchTerm.toLowerCase();
    return notes.filter(note => 
      note.title.toLowerCase().includes(lowercaseSearch) ||
      note.content.toLowerCase().includes(lowercaseSearch)
    );
  }, [notes, searchTerm]);

  // Get notes for selected date
  const notesForSelectedDate = useMemo(() => {
    const selectedDateStart = startOfDay(selectedDate);
    return notes.filter(note => {
      const noteDate = startOfDay(new Date(note.date));
      return noteDate.getTime() === selectedDateStart.getTime();
    });
  }, [notes, selectedDate]);

  return {
    notes,
    selectedDate,
    setSelectedDate,
    selectedNote,
    setSelectedNote,
    searchTerm,
    setSearchTerm,
    filteredNotes,
    notesForSelectedDate,
    addNote,
    updateNote,
    deleteNote,
  };
};
