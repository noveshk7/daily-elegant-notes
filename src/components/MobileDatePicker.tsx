
import { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isSameMonth } from "date-fns";

interface MobileDatePickerProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const MobileDatePicker = ({ selectedDate, onDateSelect, isOpen, onOpenChange }: MobileDatePickerProps) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handleDateSelect = (date: Date) => {
    onDateSelect(date);
    onOpenChange(false);
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePreviousMonth}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              {format(currentMonth, "MMMM yyyy")}
            </h2>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-4">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="p-2 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => (
              <button
                key={day.toISOString()}
                onClick={() => handleDateSelect(day)}
                className={`
                  p-2 text-sm rounded-lg transition-colors aspect-square flex items-center justify-center
                  ${isSameDay(day, selectedDate)
                    ? 'bg-blue-500 text-white'
                    : isToday(day)
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    : isSameMonth(day, currentMonth)
                    ? 'text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                    : 'text-slate-400 dark:text-slate-600'
                  }
                `}
              >
                {format(day, 'd')}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-700 flex gap-2">
          <button
            onClick={() => handleDateSelect(new Date())}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
          >
            Today
          </button>
          <button
            onClick={() => onOpenChange(false)}
            className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileDatePicker;
