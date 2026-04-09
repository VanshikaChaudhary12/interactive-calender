import React from 'react';
import { motion } from 'framer-motion';
import {
  isSameDay,
  isToday,
  isWeekend,
  isInRange,
  isRangeStart,
  isRangeEnd,
  getHolidayName,
} from '@/lib/calendarUtils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface DateCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isInSelectedRange: boolean;
  isRangeStartDate: boolean;
  isRangeEndDate: boolean;
  isHovered: boolean;
  isInHoverRange: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

export const DateCell = React.memo(function DateCell({
  date,
  isCurrentMonth,
  isSelected,
  isInSelectedRange,
  isRangeStartDate,
  isRangeEndDate,
  isHovered,
  isInHoverRange,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onDragStart,
  onDragEnd,
}: DateCellProps) {
  const holiday = getHolidayName(date);
  const isTodayDate = isToday(date);
  const isWeekendDay = isWeekend(date);

  const cellContent = (
    <motion.div
      className={`
        relative w-full aspect-square flex items-center justify-center rounded-lg
        transition-all duration-200 cursor-pointer select-none
        ${!isCurrentMonth ? 'opacity-30' : ''}
        ${isRangeStartDate || isRangeEndDate
          ? 'bg-primary text-primary-foreground font-semibold shadow-md hover:shadow-lg'
          : isInSelectedRange
            ? 'bg-primary/20 text-foreground hover:bg-primary/30'
            : isInHoverRange
              ? 'bg-primary/10 text-foreground'
              : 'hover:bg-secondary hover:shadow-sm text-foreground'
        }
        ${isTodayDate && !isRangeStartDate && !isRangeEndDate ? 'ring-2 ring-primary/50 ring-offset-2' : ''}
        ${isWeekendDay && !isInSelectedRange && !isRangeStartDate && !isRangeEndDate ? 'bg-secondary/30' : ''}
        ${holiday ? 'border-2 border-dashed border-primary/40' : ''}
      `}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      draggable
    >
      <div className="flex flex-col items-center justify-center w-full h-full">
        <span className="text-sm font-medium">{date.getDate()}</span>
        {isTodayDate && (
          <motion.div
            className="w-1.5 h-1.5 bg-primary rounded-full mt-0.5"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        {holiday && (
          <motion.div
            className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </div>
    </motion.div>
  );

  if (holiday) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {cellContent}
        </TooltipTrigger>
        <TooltipContent className="bg-card text-card-foreground border border-border">
          <p className="font-semibold">{holiday}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return cellContent;
});

export default DateCell;
