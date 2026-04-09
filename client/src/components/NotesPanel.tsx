import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { formatDate } from '@/lib/calendarUtils';
import { Trash2, Plus, Download, Filter } from 'lucide-react';
import { Note, DateRange } from '@/contexts/CalendarContext';
import { nanoid } from 'nanoid';
import { SearchBar } from './SearchBar';
import { Tag, TagSelector, TagType } from './TagSystem';

interface NotesPanelProps {
  notes: Note[];
  selectedRange: DateRange;
  onAddNote: (note: Note) => void;
  onUpdateNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
}

export function NotesPanel({
  notes,
  selectedRange,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
}: NotesPanelProps) {
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<TagType[]>([]);
  const [newNoteTags, setNewNoteTags] = useState<TagType[]>([]);
  const [showTagSelector, setShowTagSelector] = useState(false);

  const relatedNotes = notes.filter(note => {
    if (!selectedRange.start || !selectedRange.end) return false;
    const noteStart = note.dateRange.start?.getTime() || 0;
    const noteEnd = note.dateRange.end?.getTime() || 0;
    const rangeStart = selectedRange.start.getTime();
    const rangeEnd = selectedRange.end.getTime();
    return !(noteEnd < rangeStart || noteStart > rangeEnd);
  });

  // Filter notes by search and tags
  const filteredNotes = relatedNotes.filter(note => {
    const matchesSearch = note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => note.tags?.includes(tag));
    return matchesSearch && matchesTags;
  });

  const handleAddNote = () => {
    if (!newNoteContent.trim() || !selectedRange.start || !selectedRange.end) return;

    const newNote: Note = {
      id: nanoid(),
      content: newNoteContent,
      dateRange: selectedRange,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: newNoteTags,
    };

    onAddNote(newNote);
    setNewNoteContent('');
    setNewNoteTags([]);
  };

  const handleUpdateNote = (id: string) => {
    if (!editingContent.trim()) return;

    const note = notes.find(n => n.id === id);
    if (note) {
      onUpdateNote({
        ...note,
        content: editingContent,
        updatedAt: new Date(),
      });
    }
    setEditingId(null);
    setEditingContent('');
  };

  const handleExportNotes = () => {
    const content = relatedNotes
      .map(
        note =>
          `Date Range: ${formatDate(note.dateRange.start!)} to ${formatDate(note.dateRange.end!)}\n` +
          `Created: ${note.createdAt.toLocaleString()}\n` +
          `Note: ${note.content}\n` +
          '---\n'
      )
      .join('\n');

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', `calendar-notes-${new Date().toISOString().split('T')[0]}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="w-full bg-card rounded-xl shadow-lg p-6 border border-border flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-foreground">Notes</h3>
        <div className="flex gap-2">
          {relatedNotes.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExportNotes}
              className="hover:bg-secondary"
              title="Export notes as text"
            >
              <Download className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Search and Filter */}
      {relatedNotes.length > 0 && (
        <div className="mb-4 space-y-3">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTagSelector(!showTagSelector)}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              Filter Tags {selectedTags.length > 0 && `(${selectedTags.length})`}
            </Button>
            {selectedTags.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTags([])}
              >
                Clear
              </Button>
            )}
          </div>
          {showTagSelector && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <TagSelector
                selectedTags={selectedTags}
                onToggle={(tag) => {
                  setSelectedTags(prev =>
                    prev.includes(tag)
                      ? prev.filter(t => t !== tag)
                      : [...prev, tag]
                  );
                }}
              />
            </motion.div>
          )}
        </div>
      )}

      {/* Add note section */}
      {selectedRange.start && selectedRange.end && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-secondary/20 rounded-lg border border-secondary/30"
        >
          <p className="text-sm text-muted-foreground mb-3">
            {formatDate(selectedRange.start)} to {formatDate(selectedRange.end)}
          </p>
          <Textarea
            placeholder="Add a note for this date range..."
            value={newNoteContent}
            onChange={e => setNewNoteContent(e.target.value)}
            className="min-h-24 mb-3 resize-none"
          />
          <div className="mb-3">
            <p className="text-xs text-muted-foreground mb-2">Add tags (optional):</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {newNoteTags.map(tag => (
                <Tag
                  key={tag}
                  tag={tag as TagType}
                  onRemove={() => setNewNoteTags(prev => prev.filter(t => t !== tag))}
                  size="sm"
                />
              ))}
            </div>
            <TagSelector
              selectedTags={newNoteTags}
              onToggle={(tag) => {
                setNewNoteTags(prev =>
                  prev.includes(tag)
                    ? prev.filter(t => t !== tag)
                    : [...prev, tag]
                );
              }}
            />
          </div>
          <Button
            onClick={handleAddNote}
            disabled={!newNoteContent.trim()}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Note
          </Button>
        </motion.div>
      )}

      {!selectedRange.start && (
        <div className="text-center py-8 text-muted-foreground">
          <p>Select a date range to add notes</p>
        </div>
      )}

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto space-y-3">
        <AnimatePresence>
          {filteredNotes.length === 0 && selectedRange.start ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8 text-muted-foreground text-sm"
            >
              {searchQuery || selectedTags.length > 0
                ? 'No notes match your filters'
                : 'No notes for this date range'}
            </motion.div>
          ) : null}

          {filteredNotes.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className="p-3 bg-secondary/10 rounded-lg border border-border hover:border-primary/30 transition-colors"
            >
              {editingId === note.id ? (
                <div className="space-y-2">
                  <Textarea
                    value={editingContent}
                    onChange={e => setEditingContent(e.target.value)}
                    className="min-h-20 resize-none"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleUpdateNote(note.id)}
                      className="flex-1 bg-primary hover:bg-primary/90"
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingId(null)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {formatDate(note.dateRange.start!)} to {formatDate(note.dateRange.end!)}
                  </p>
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {note.tags.map(tag => (
                        <Tag key={tag} tag={tag as TagType} size="sm" />
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-foreground mb-2 break-words">{note.content}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingId(note.id);
                        setEditingContent(note.content);
                      }}
                      className="text-xs hover:bg-secondary flex-1"
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDeleteNote(note.id)}
                      className="text-xs hover:bg-destructive/10 text-destructive flex-1"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default NotesPanel;
