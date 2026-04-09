import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCalendar } from '@/contexts/CalendarContext';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import CalendarGrid from '@/components/CalendarGrid';
import NotesPanel from '@/components/NotesPanel';
import MiniCalendar from '@/components/MiniCalendar';
import { StatsDashboard } from '@/components/StatsDashboard';
import { QuickActionsMenu } from '@/components/QuickActionsMenu';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import { exportCalendarAsPDF, exportNotesAsJSON } from '@/lib/exportUtils';

/**
 * Home page - Main interactive calendar interface
 * Design: Modern Minimalist with Tactile Depth
 * - Asymmetric layout with hero image on left (desktop)
 * - Responsive stacked layout on mobile
 * - Full keyboard navigation support
 * - Smooth animations and transitions
 */

export default function Home() {
  const { state, dispatch } = useCalendar();
  const notesHistory = useUndoRedo(state.notes);

  // Sync notes with undo/redo system
  useEffect(() => {
    if (JSON.stringify(notesHistory.state) !== JSON.stringify(state.notes)) {
      notesHistory.set(state.notes);
    }
  }, [state.notes]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Arrow keys for month navigation
      if (e.key === 'ArrowLeft') {
        const newDate = new Date(state.currentDate);
        newDate.setMonth(newDate.getMonth() - 1);
        dispatch({ type: 'SET_CURRENT_DATE', payload: newDate });
      } else if (e.key === 'ArrowRight') {
        const newDate = new Date(state.currentDate);
        newDate.setMonth(newDate.getMonth() + 1);
        dispatch({ type: 'SET_CURRENT_DATE', payload: newDate });
      }
      // 'd' key for dark mode toggle
      else if (e.key === 'd' && e.ctrlKey) {
        e.preventDefault();
        dispatch({ type: 'TOGGLE_DARK_MODE' });
      }
      // 'r' key to reset
      else if (e.key === 'r' && e.ctrlKey) {
        e.preventDefault();
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.currentDate]);

  const handleReset = () => {
    dispatch({ type: 'SET_CURRENT_DATE', payload: new Date() });
    dispatch({ type: 'SET_SELECTED_RANGE', payload: { start: null, end: null } });
  };

  const handleDateSelect = (date: Date) => {
    dispatch({ type: 'SET_CURRENT_DATE', payload: date });
  };

  const handleExportPDF = () => {
    exportCalendarAsPDF(state.currentDate, state.notes);
  };

  const handleExportJSON = () => {
    exportNotesAsJSON(state.notes);
  };

  const handleUndo = () => {
    notesHistory.undo();
    // Update state with previous notes
    const prevNotes = notesHistory.state;
    prevNotes.forEach(note => {
      dispatch({ type: 'UPDATE_NOTE', payload: note });
    });
  };

  const handleRedo = () => {
    notesHistory.redo();
    const nextNotes = notesHistory.state;
    nextNotes.forEach(note => {
      dispatch({ type: 'UPDATE_NOTE', payload: note });
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onReset={handleReset} />

      <main className="container mx-auto px-4 py-8">
        {/* Hero section */}
        <HeroSection
          currentDate={state.currentDate}
          heroImageIndex={state.heroImageIndex}
          onImageChange={index => dispatch({ type: 'SET_HERO_IMAGE_INDEX', payload: index })}
        />

        {/* Statistics Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8"
        >
          <StatsDashboard notes={state.notes} currentMonth={state.currentDate} />
        </motion.div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Left column - Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <CalendarGrid
              currentDate={state.currentDate}
              selectedRange={state.selectedRange}
              onDateSelect={handleDateSelect}
              onRangeSelect={range =>
                dispatch({ type: 'SET_SELECTED_RANGE', payload: range })
              }
              onMonthChange={date => dispatch({ type: 'SET_CURRENT_DATE', payload: date })}
            />
          </motion.div>

          {/* Right column - Notes and Mini Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col gap-6"
          >
            {/* Mini Calendar */}
            <MiniCalendar
              currentDate={state.currentDate}
              selectedDate={state.selectedRange.start}
              onDateSelect={handleDateSelect}
            />

            {/* Notes Panel */}
            <div className="flex-1 min-h-96">
              <NotesPanel
                notes={state.notes}
                selectedRange={state.selectedRange}
                onAddNote={note => dispatch({ type: 'ADD_NOTE', payload: note })}
                onUpdateNote={note => dispatch({ type: 'UPDATE_NOTE', payload: note })}
                onDeleteNote={id => dispatch({ type: 'DELETE_NOTE', payload: id })}
              />
            </div>
          </motion.div>
        </div>

        {/* Quick Actions Menu */}
        <QuickActionsMenu
          onExport={handleExportJSON}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onPrint={handleExportPDF}
          canUndo={notesHistory.canUndo}
          canRedo={notesHistory.canRedo}
        />

        {/* Features info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4 text-center text-sm text-muted-foreground"
        >
          <div className="p-4 bg-card rounded-lg border border-border hover:border-primary/30 transition-colors">
            <p className="font-semibold text-foreground mb-1">📅 Date Selection</p>
            <p>Click or drag to select ranges</p>
          </div>
          <div className="p-4 bg-card rounded-lg border border-border hover:border-primary/30 transition-colors">
            <p className="font-semibold text-foreground mb-1">🏷️ Smart Tags</p>
            <p>Categorize notes with tags</p>
          </div>
          <div className="p-4 bg-card rounded-lg border border-border hover:border-primary/30 transition-colors">
            <p className="font-semibold text-foreground mb-1">🔍 Search & Filter</p>
            <p>Find notes instantly</p>
          </div>
          <div className="p-4 bg-card rounded-lg border border-border hover:border-primary/30 transition-colors">
            <p className="font-semibold text-foreground mb-1">📊 Statistics</p>
            <p>Track your planning activity</p>
          </div>
        </motion.div>

        {/* Keyboard shortcuts info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 p-4 bg-secondary/10 rounded-lg border border-border text-xs text-muted-foreground"
        >
          <p className="font-semibold text-foreground mb-2">⌨️ Keyboard Shortcuts</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <p>← → : Navigate months</p>
            <p>Ctrl+D : Toggle dark mode</p>
            <p>Ctrl+R : Reset selections</p>
            <p>Ctrl+Z : Undo (via FAB)</p>
            <p>Ctrl+Y : Redo (via FAB)</p>
            <p>Click/Drag : Select range</p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-border bg-card/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Built with React, Tailwind CSS, and Framer Motion. All data stored locally in your browser.
          </p>
          <p className="mt-2">
            ✨ Enhanced with search, tags, statistics, undo/redo, and export features.
          </p>
        </div>
      </footer>
    </div>
  );
}
