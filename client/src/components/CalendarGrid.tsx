import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DateCell from './DateCell';
import {
  getMonthDays,
  formatMonthYear,
  createDateFromDay,
  isInRange,
  isSameDay,
  addMonths,
} from '@/lib/calendarUtils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { ViewModeSwitcher, ViewMode } from './ViewModeSwitcher';

interface CalendarGridProps {
  currentDate: Date;
  selectedRange: { start: Date | null; end: Date | null };
  onDateSelect: (date: Date) => void;
  onRangeSelect: (range: { start: Date | null; end: Date | null }) => void;
  onMonthChange: (date: Date) => void;
}

export function CalendarGrid({
  currentDate,
  selectedRange,
  onDateSelect,
  onRangeSelect,
  onMonthChange,
}: CalendarGridProps) {
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Date | null>(null);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [viewMode, setViewMode] = useState<ViewMode>('month');

  const monthDays = getMonthDays(currentDate);
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleDateClick = useCallback(
    (day: number) => {
      const clickedDate = createDateFromDay(currentDate, day);

      if (!selectedRange.start) {
        // First selection
        onRangeSelect({ start: clickedDate, end: null });
      } else if (!selectedRange.end) {
        // Second selection
        if (isSameDay(clickedDate, selectedRange.start)) {
          // Same day selection
          onRangeSelect({ start: clickedDate, end: clickedDate });
        } else {
          // Different day
          onRangeSelect({
            start: selectedRange.start,
            end: clickedDate,
          });
        }
      } else {
        // Reset and start new selection
        onRangeSelect({ start: clickedDate, end: null });
      }
    },
    [currentDate, selectedRange, onRangeSelect]
  );

  const handleDragStart = useCallback((day: number) => {
    setIsDragging(true);
    setDragStart(createDateFromDay(currentDate, day));
  }, [currentDate]);

  const handleDragEnd = useCallback(
    (day: number) => {
      if (dragStart) {
        const dragEnd = createDateFromDay(currentDate, day);
        onRangeSelect({
          start: dragStart,
          end: dragEnd,
        });
      }
      setIsDragging(false);
      setDragStart(null);
    },
    [dragStart, currentDate, onRangeSelect]
  );

  const handlePrevMonth = () => {
    setDirection('prev');
    onMonthChange(addMonths(currentDate, -1));
  };

  const handleNextMonth = () => {
    setDirection('next');
    onMonthChange(addMonths(currentDate, 1));
  };

  const isDateInRange = (day: number) => {
    const date = createDateFromDay(currentDate, day);
    return isInRange(date, selectedRange.start, selectedRange.end);
  };

  const isDateRangeStart = (day: number) => {
    const date = createDateFromDay(currentDate, day);
    return selectedRange.start ? isSameDay(date, selectedRange.start) : false;
  };

  const isDateRangeEnd = (day: number) => {
    const date = createDateFromDay(currentDate, day);
    return selectedRange.end ? isSameDay(date, selectedRange.end) : false;
  };

  const isDateInHoverRange = (day: number) => {
    if (!hoverDate || !dragStart) return false;
    const date = createDateFromDay(currentDate, day);
    return isInRange(date, dragStart, hoverDate);
  };

  return (
    <div className="w-full bg-card rounded-xl shadow-lg p-6 border border-border">
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevMonth}
            className="hover:bg-secondary"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <motion.h2
            key={formatMonthYear(currentDate)}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="text-2xl font-bold text-foreground min-w-[200px] text-center"
          >
            {formatMonthYear(currentDate)}
          </motion.h2>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextMonth}
            className="hover:bg-secondary"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <ViewModeSwitcher currentView={viewMode} onViewChange={setViewMode} />
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRangeSelect({ start: null, end: null })}
            className="gap-2"
            title="Reset selection"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {dayLabels.map((label, index) => (
          <div
            key={`day-label-${index}`}
            className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider py-2"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={formatMonthYear(currentDate)}
          initial={{ opacity: 0, x: direction === 'next' ? 100 : -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction === 'next' ? -100 : 100 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="grid grid-cols-7 gap-2"
        >
          {monthDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const date = createDateFromDay(currentDate, day);

            return (
              <DateCell
                key={`${currentDate.getMonth()}-${day}`}
                date={date}
                isCurrentMonth={true}
                isSelected={isDateRangeStart(day) || isDateRangeEnd(day)}
                isInSelectedRange={isDateInRange(day)}
                isRangeStartDate={isDateRangeStart(day)}
                isRangeEndDate={isDateRangeEnd(day)}
                isHovered={hoverDate ? isSameDay(date, hoverDate) : false}
                isInHoverRange={isDateInHoverRange(day)}
                onMouseEnter={() => setHoverDate(date)}
                onMouseLeave={() => setHoverDate(null)}
                onClick={() => handleDateClick(day)}
                onDragStart={() => handleDragStart(day)}
                onDragEnd={() => handleDragEnd(day)}
              />
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Info text */}
      <div className="mt-6 pt-4 border-t border-border text-sm text-muted-foreground">
        {selectedRange.start && selectedRange.end ? (
          <p>
            Selected: {selectedRange.start.toLocaleDateString()} -{' '}
            {selectedRange.end.toLocaleDateString()}
          </p>
        ) : selectedRange.start ? (
          <p>Start date: {selectedRange.start.toLocaleDateString()} (click to select end date)</p>
        ) : (
          <p>Click or drag to select a date range</p>
        )}
      </div>
    </div>
  );
}

export default CalendarGrid;
