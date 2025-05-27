
import { useState, useEffect } from "react";
import { Calendar, Search, Plus, FileText, Trash2, Edit3, Menu } from "lucide-react";
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
  const [showSidebar, setShowSidebar] = useState(false);
  const [showNotesList, setShowNotesList] = useState(true);

  const handleCreateNote = () => {
    const newNote = addNote(selectedDate);
    setSelectedNote(newNote.id);
    setIsCreatingNote(true);
    // On mobile, hide notes list when creating/editing a note
    if (window.innerWidth < 1024) {
      setShowNotesList(false);
    }
  };

  const handleNoteSelect = (noteId: string) => {
    setSelectedNote(noteId);
    setIsCreatingNote(false);
    // On mobile, hide notes list when selecting a note
    if (window.innerWidth < 1024) {
      setShowNotesList(false);
    }
  };

  const handleNoteUpdate = (noteId: string, content: string, title: string) => {
    updateNote(noteId, content, title);
    setIsCreatingNote(false);
  };

  const handleBackToNotes = () => {
    setSelectedNote(null);
    setIsCreatingNote(false);
    setShowNotesList(true);
  };

  const currentNote = notes.find(note => note.id === selectedNote);
  const todayNotes = notes.filter(note => isToday(parseISO(note.date)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="flex h-screen relative">
        {/* Mobile Sidebar Overlay */}
        {showSidebar && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed lg:relative z-50 lg:z-auto
          ${showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-transform duration-300 ease-in-out
        `}>
          <Sidebar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            notesCount={notes.length}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex min-w-0">
          {/* Notes List - Responsive */}
          <div className={`
            ${showNotesList ? 'block' : 'hidden lg:block'}
            w-full lg:w-80 border-r border-white/20 backdrop-blur-sm bg-white/10 dark:bg-slate-800/20
            ${currentNote || isCreatingNote ? 'lg:block' : 'block'}
          `}>
            {/* Mobile Header */}
            <div className="lg:hidden p-4 border-b border-white/20 flex items-center gap-3">
              <button
                onClick={() => setShowSidebar(true)}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              >
                <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </button>
              <h1 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                Notes
              </h1>
            </div>

            <div className="p-3 lg:p-4 space-y-3 lg:space-y-4">
              {/* Search Bar */}
              <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
              
              {/* Create Note Button */}
              <button
                onClick={handleCreateNote}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm lg:text-base"
              >
                <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="font-medium">New Note</span>
              </button>

              {/* Date Header */}
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Calendar className="w-3 h-3 lg:w-4 lg:h-4" />
                <span className="text-xs lg:text-sm font-medium">
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
          <div className={`
            flex-1 flex flex-col min-w-0
            ${!showNotesList ? 'block' : 'hidden lg:flex'}
          `}>
            {currentNote || isCreatingNote ? (
              <>
                {/* Mobile Back Button */}
                <div className="lg:hidden p-4 border-b border-white/20 flex items-center gap-3">
                  <button
                    onClick={handleBackToNotes}
                    className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    <svg className="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 truncate">
                    {currentNote?.title || "New Note"}
                  </h2>
                </div>
                
                <NoteEditor
                  note={currentNote}
                  isCreating={isCreatingNote}
                  onSave={handleNoteUpdate}
                  onCancel={() => {
                    setIsCreatingNote(false);
                    setSelectedNote(null);
                    if (window.innerWidth < 1024) {
                      setShowNotesList(true);
                    }
                  }}
                />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
                <div className="text-center space-y-4 max-w-md mx-auto">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900/30 dark:to-indigo-800/30 flex items-center justify-center">
                    <FileText className="w-8 h-8 lg:w-10 lg:h-10 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl lg:text-2xl font-semibold text-slate-700 dark:text-slate-200">
                    Ready to capture your thoughts?
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm lg:text-base">
                    Select a note from the list or create a new one to get started. 
                    Your notes are automatically saved and organized by date.
                  </p>
                  <button
                    onClick={handleCreateNote}
                    className="inline-flex items-center gap-2 px-4 py-2 lg:px-6 lg:py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm lg:text-base"
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
