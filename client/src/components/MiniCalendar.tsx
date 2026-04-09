import React from 'react';
import { motion } from 'framer-motion';
import { getMonthDays, createDateFromDay, isSameDay, addMonths } from '@/lib/calendarUtils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MiniCalendarProps {
  currentDate: Date;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

export function MiniCalendar({ currentDate, selectedDate, onDateSelect }: MiniCalendarProps) {
  const [miniDate, setMiniDate] = React.useState(currentDate);
  const monthDays = getMonthDays(miniDate);
  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const handlePrevMonth = () => setMiniDate(addMonths(miniDate, -1));
  const handleNextMonth = () => setMiniDate(addMonths(miniDate, 1));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-lg shadow-md p-4 border border-border"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrevMonth}
          className="p-1 h-auto"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="text-sm font-semibold text-foreground">
          {miniDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNextMonth}
          className="p-1 h-auto"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayLabels.map((label, index) => (
          <div key={`day-label-${index}`} className="text-center text-xs font-semibold text-muted-foreground">
            {label}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {monthDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const date = createDateFromDay(miniDate, day);
          const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;

          return (
            <motion.button
              key={day}
              onClick={() => onDateSelect(date)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`
                aspect-square text-xs font-medium rounded transition-all
                ${
                  isSelected
                    ? 'bg-primary text-primary-foreground font-semibold'
                    : 'hover:bg-secondary text-foreground'
                }
              `}
            >
              {day}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

export default MiniCalendar;
