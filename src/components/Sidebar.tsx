
import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, FileText, Hash } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameDay, startOfWeek, endOfWeek } from "date-fns";

interface SidebarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  notesCount: number;
}

const Sidebar = ({ selectedDate, onDateSelect, notesCount }: SidebarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const today = () => {
    const now = new Date();
    setCurrentMonth(now);
    onDateSelect(now);
  };

  return (
    <div className="w-80 border-r border-white/20 backdrop-blur-sm bg-white/10 dark:bg-slate-800/20 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Daily Notes
        </h1>
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <FileText className="w-4 h-4" />
          <span>{notesCount} {notesCount === 1 ? 'note' : 'notes'} total</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <button
          onClick={today}
          className="w-full p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm font-medium"
        >
          Go to Today
        </button>
      </div>

      {/* Calendar */}
      <div className="space-y-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <div className="flex gap-1">
            <button
              onClick={prevMonth}
              className="p-2 rounded-lg hover:bg-white/20 dark:hover:bg-slate-700/50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-lg hover:bg-white/20 dark:hover:bg-slate-700/50 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day Headers */}
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-slate-500 dark:text-slate-400 p-2">
              {day}
            </div>
          ))}
          
          {/* Calendar Days */}
          {days.map(day => {
            const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
            const isTodayDate = isToday(day);
            const isSelected = isSameDay(day, selectedDate);
            
            return (
              <button
                key={day.toISOString()}
                onClick={() => onDateSelect(day)}
                className={`
                  p-2 text-sm rounded-lg transition-all duration-200 relative
                  ${isCurrentMonth 
                    ? 'text-slate-700 dark:text-slate-200 hover:bg-white/30 dark:hover:bg-slate-700/50' 
                    : 'text-slate-400 dark:text-slate-600 hover:bg-white/20'
                  }
                  ${isTodayDate 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : ''
                  }
                  ${isSelected && !isTodayDate 
                    ? 'bg-indigo-500 text-white hover:bg-indigo-600' 
                    : ''
                  }
                `}
              >
                {format(day, 'd')}
                {isTodayDate && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 p-4 rounded-xl bg-white/20 dark:bg-slate-700/30 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-2">
          <Hash className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Quick Stats</span>
        </div>
        <div className="text-2xl font-bold text-slate-700 dark:text-slate-200">
          {notesCount}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {notesCount === 1 ? 'note created' : 'notes created'}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
