
import { useState, useEffect } from "react";
import { Calendar, Search, Plus, FileText, Trash2, Edit3 } from "lucide-react";
import { format, startOfDay, isToday, isYesterday, parseISO } from "date-fns";
import NoteEditor from "../components/NoteEditor";
import Sidebar from "../components/Sidebar";
import NotesList from "../components/NotesList";
import SearchBar from "../components/SearchBar";
import { Note, useNotes } from "../hooks/useNotes";

const Index = () => {
  const {
    notes,
    selectedDate,
    setSelectedDate,
    selectedNote,
    setSelectedNote,
    addNote,
    updateNote,
    deleteNote,
    searchTerm,
    setSearchTerm,
    filteredNotes
  } = useNotes();

  const [isCreatingNote, setIsCreatingNote] = useState(false);

  const handleCreateNote = () => {
    const newNote = addNote(selectedDate);
    setSelectedNote(newNote.id);
    setIsCreatingNote(true);
  };

  const handleNoteSelect = (noteId: string) => {
    setSelectedNote(noteId);
    setIsCreatingNote(false);
  };

  const handleNoteUpdate = (noteId: string, content: string, title: string) => {
    updateNote(noteId, content, title);
    setIsCreatingNote(false);
  };

  const currentNote = notes.find(note => note.id === selectedNote);
  const todayNotes = notes.filter(note => isToday(parseISO(note.date)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          notesCount={notes.length}
        />

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Notes List */}
          <div className="w-80 border-r border-white/20 backdrop-blur-sm bg-white/10 dark:bg-slate-800/20">
            <div className="p-4 space-y-4">
              {/* Search Bar */}
              <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
              
              {/* Create Note Button */}
              <button
                onClick={handleCreateNote}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">New Note</span>
              </button>

              {/* Date Header */}
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {isToday(selectedDate) ? "Today" : 
                   isYesterday(selectedDate) ? "Yesterday" : 
                   format(selectedDate, "MMMM d, yyyy")}
                </span>
              </div>
            </div>

            {/* Notes List */}
            <NotesList
              notes={searchTerm ? filteredNotes : notes.filter(note => 
                startOfDay(parseISO(note.date)).getTime() === startOfDay(selectedDate).getTime()
              )}
              selectedNoteId={selectedNote}
              onNoteSelect={handleNoteSelect}
              onNoteDelete={deleteNote}
            />
          </div>

          {/* Note Editor */}
          <div className="flex-1 flex flex-col">
            {currentNote || isCreatingNote ? (
              <NoteEditor
                note={currentNote}
                isCreating={isCreatingNote}
                onSave={handleNoteUpdate}
                onCancel={() => {
                  setIsCreatingNote(false);
                  setSelectedNote(null);
                }}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4 max-w-md mx-auto p-8">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900/30 dark:to-indigo-800/30 flex items-center justify-center">
                    <FileText className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-200">
                    Ready to capture your thoughts?
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                    Select a note from the list or create a new one to get started. 
                    Your notes are automatically saved and organized by date.
                  </p>
                  <button
                    onClick={handleCreateNote}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Edit3 className="w-4 h-4" />
                    Create Your First Note
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
