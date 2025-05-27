
import { format, isToday, isYesterday, parseISO } from "date-fns";
import { FileText, Trash2, Clock } from "lucide-react";
import { Note } from "../hooks/useNotes";

interface NotesListProps {
  notes: Note[];
  selectedNoteId: string | null;
  onNoteSelect: (noteId: string) => void;
  onNoteDelete: (noteId: string) => void;
}

const NotesList = ({ notes, selectedNoteId, onNoteSelect, onNoteDelete }: NotesListProps) => {
  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMM d");
  };

  const formatTime = (dateString: string) => {
    return format(parseISO(dateString), "h:mm a");
  };

  const truncateContent = (content: string, maxLength = 80) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  if (notes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 lg:w-16 lg:h-16 mx-auto rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
            <FileText className="w-6 h-6 lg:w-8 lg:h-8 text-slate-400 dark:text-slate-500" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs lg:text-sm">
            No notes for this day yet
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="space-y-2 p-3 lg:p-4">
        {notes.map((note) => (
          <div
            key={note.id}
            onClick={() => onNoteSelect(note.id)}
            className={`
              group p-3 lg:p-4 rounded-xl cursor-pointer transition-all duration-300 border
              ${selectedNoteId === note.id
                ? 'bg-blue-500/20 border-blue-300/50 dark:bg-blue-600/20 dark:border-blue-500/50 shadow-lg'
                : 'bg-white/30 border-white/30 dark:bg-slate-700/30 dark:border-slate-600/30 hover:bg-white/50 dark:hover:bg-slate-700/50 hover:shadow-md'
              }
            `}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium text-slate-800 dark:text-slate-100 truncate flex-1 mr-2 text-sm lg:text-base">
                {note.title}
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNoteDelete(note.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-red-500/20 text-red-500 hover:text-red-600 transition-all duration-200 flex-shrink-0"
              >
                <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
              </button>
            </div>
            
            {note.content && (
              <p className="text-xs lg:text-sm text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
                {truncateContent(note.content, window.innerWidth < 768 ? 60 : 100)}
              </p>
            )}
            
            <div className="flex items-center gap-3 lg:gap-4 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{formatTime(note.updatedAt)}</span>
              </div>
              <span className="hidden sm:inline">{formatDate(note.date)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesList;
