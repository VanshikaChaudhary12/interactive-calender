import { Calendar, CalendarDays, CalendarRange } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type ViewMode = 'month' | 'week' | 'year';

interface ViewModeSwitcherProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export function ViewModeSwitcher({ currentView, onViewChange }: ViewModeSwitcherProps) {
  const views: { mode: ViewMode; icon: React.ReactNode; label: string }[] = [
    { mode: 'month', icon: <Calendar className="w-4 h-4" />, label: 'Month' },
    { mode: 'week', icon: <CalendarDays className="w-4 h-4" />, label: 'Week' },
    { mode: 'year', icon: <CalendarRange className="w-4 h-4" />, label: 'Year' },
  ];

  return (
    <div className="inline-flex rounded-lg border border-border bg-card p-1 shadow-sm">
      {views.map(({ mode, icon, label }) => (
        <Button
          key={mode}
          variant={currentView === mode ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewChange(mode)}
          className="gap-2"
        >
          {icon}
          <span className="hidden sm:inline">{label}</span>
        </Button>
      ))}
    </div>
  );
}
