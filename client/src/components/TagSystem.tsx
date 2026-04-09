import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const TAG_COLORS = {
  work: 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30',
  personal: 'bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30',
  urgent: 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30',
  event: 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30',
  reminder: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30',
} as const;

export type TagType = keyof typeof TAG_COLORS;

interface TagProps {
  tag: TagType;
  onRemove?: () => void;
  size?: 'sm' | 'md';
}

export function Tag({ tag, onRemove, size = 'md' }: TagProps) {
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';
  
  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className={`inline-flex items-center gap-1 rounded-full border ${TAG_COLORS[tag]} ${sizeClasses} font-medium`}
    >
      {tag}
      {onRemove && (
        <button
          onClick={onRemove}
          className="hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </motion.span>
  );
}

interface TagSelectorProps {
  selectedTags: TagType[];
  onToggle: (tag: TagType) => void;
}

export function TagSelector({ selectedTags, onToggle }: TagSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {(Object.keys(TAG_COLORS) as TagType[]).map((tag) => (
        <Button
          key={tag}
          variant={selectedTags.includes(tag) ? 'default' : 'outline'}
          size="sm"
          onClick={() => onToggle(tag)}
          className={`${selectedTags.includes(tag) ? TAG_COLORS[tag] : ''} capitalize`}
        >
          {tag}
        </Button>
      ))}
    </div>
  );
}
