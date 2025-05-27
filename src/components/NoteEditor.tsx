
import { useState, useEffect, useRef } from "react";
import { Save, X, Edit3, Type } from "lucide-react";
import { Note } from "../hooks/useNotes";

interface NoteEditorProps {
  note?: Note;
  isCreating: boolean;
  onSave: (noteId: string, content: string, title: string) => void;
  onCancel: () => void;
}

const NoteEditor = ({ note, isCreating, onSave, onCancel }: NoteEditorProps) => {
  const [title, setTitle] = useState(note?.title || "Untitled Note");
  const [content, setContent] = useState(note?.content || "");
  const [hasChanges, setHasChanges] = useState(false);
  
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle("Untitled Note");
      setContent("");
    }
    setHasChanges(false);
  }, [note]);

  useEffect(() => {
    if (isCreating && titleRef.current) {
      titleRef.current.focus();
      titleRef.current.select();
    }
  }, [isCreating]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setHasChanges(true);
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    setHasChanges(true);
  };

  const handleSave = () => {
    if (note?.id) {
      onSave(note.id, content, title);
      setHasChanges(false);
    }
  };

  const handleCancel = () => {
    // If creating a new note and there are unsaved changes, just cancel without saving
    if (hasChanges && (isCreating || note)) {
      const confirmCancel = window.confirm("You have unsaved changes. Are you sure you want to cancel?");
      if (!confirmCancel) return;
    }
    onCancel();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="flex-1 flex flex-col" onKeyDown={handleKeyDown}>
      {/* Header */}
      <div className="border-b border-white/20 backdrop-blur-sm bg-white/10 dark:bg-slate-800/20 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Edit3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                {isCreating ? "New Note" : "Edit Note"}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {hasChanges ? "Unsaved changes" : "No changes"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium ${
                hasChanges 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col p-6 space-y-4">
        {/* Title Input */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
            <Type className="w-4 h-4" />
            Title
          </label>
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Enter note title..."
            className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-white/30 dark:border-slate-600/30 rounded-xl text-xl font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300/50 dark:focus:border-blue-500/50 transition-all duration-300 backdrop-blur-sm"
          />
        </div>

        {/* Content Textarea */}
        <div className="flex-1 space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
            <Edit3 className="w-4 h-4" />
            Content
          </label>
          <textarea
            ref={contentRef}
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Start writing your note..."
            className="w-full h-full min-h-96 px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-white/30 dark:border-slate-600/30 rounded-xl text-slate-700 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300/50 dark:focus:border-blue-500/50 transition-all duration-300 backdrop-blur-sm resize-none leading-relaxed"
            style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif' }}
          />
        </div>

        {/* Keyboard Shortcuts */}
        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-white/20 dark:border-slate-600/20">
          <span>💡 Tips:</span>
          <span>Ctrl+S to save</span>
          <span>Esc to cancel</span>
          <span>Click Save to keep changes</span>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;
