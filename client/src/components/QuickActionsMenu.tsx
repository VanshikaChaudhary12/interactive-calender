import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Download, Undo, Redo, Calendar, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

interface QuickActionsMenuProps {
  onExport: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onPrint: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function QuickActionsMenu({
  onExport,
  onUndo,
  onRedo,
  onPrint,
  canUndo,
  canRedo,
}: QuickActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const actions: QuickAction[] = [
    { icon: <Undo className="w-4 h-4" />, label: 'Undo', onClick: onUndo, disabled: !canUndo },
    { icon: <Redo className="w-4 h-4" />, label: 'Redo', onClick: onRedo, disabled: !canRedo },
    { icon: <Download className="w-4 h-4" />, label: 'Export', onClick: onExport },
    { icon: <Printer className="w-4 h-4" />, label: 'Print', onClick: onPrint },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-16 right-0 flex flex-col gap-2 mb-2"
          >
            {actions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    action.onClick();
                    setIsOpen(false);
                  }}
                  disabled={action.disabled}
                  className="shadow-lg hover:shadow-xl transition-shadow whitespace-nowrap"
                >
                  {action.icon}
                  <span className="ml-2">{action.label}</span>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Plus className="w-6 h-6" />
        </motion.div>
      </motion.button>
    </div>
  );
}
