
import { useState } from "react";
import { Calendar, Check, X } from "lucide-react";
import { format } from "date-fns";
import MobileDatePicker from "./MobileDatePicker";

interface DateSelectionDialogProps {
  isOpen: boolean;
  onDateConfirm: (date: Date) => void;
  onCancel: () => void;
  initialDate?: Date;
}

const DateSelectionDialog = ({ isOpen, onDateConfirm, onCancel, initialDate = new Date() }: DateSelectionDialogProps) => {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [showMobileDatePicker, setShowMobileDatePicker] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onDateConfirm(selectedDate);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                  Set Note Date
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Choose when this note should be saved
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div className="text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Selected Date
              </p>
              <button
                onClick={() => setShowMobileDatePicker(true)}
                className="w-full p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl text-blue-700 dark:text-blue-300 font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                {format(selectedDate, "EEEE, MMMM d, yyyy")}
              </button>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
              💡 Your note will be organized under this date
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition-colors text-sm font-medium"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors text-sm font-medium"
            >
              <Check className="w-4 h-4" />
              Confirm
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Date Picker */}
      <MobileDatePicker
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        isOpen={showMobileDatePicker}
        onOpenChange={setShowMobileDatePicker}
      />
    </>
  );
};

export default DateSelectionDialog;
