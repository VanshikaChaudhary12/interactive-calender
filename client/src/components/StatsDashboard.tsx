import { motion } from 'framer-motion';
import { Calendar, FileText, TrendingUp, Clock } from 'lucide-react';
import { Note } from '@/contexts/CalendarContext';

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: string;
}

function StatsCard({ icon, label, value, trend }: StatsCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-card border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {trend && (
            <p className="text-xs text-muted-foreground mt-1">{trend}</p>
          )}
        </div>
        <div className="text-primary">{icon}</div>
      </div>
    </motion.div>
  );
}

interface StatsDashboardProps {
  notes: Note[];
  currentMonth: Date;
}

export function StatsDashboard({ notes, currentMonth }: StatsDashboardProps) {
  const totalNotes = notes.length;
  
  const notesThisMonth = notes.filter(note => {
    const noteDate = note.dateRange.start;
    return noteDate && 
      noteDate.getMonth() === currentMonth.getMonth() &&
      noteDate.getFullYear() === currentMonth.getFullYear();
  }).length;

  const uniqueDays = new Set(
    notes.map(note => note.dateRange.start?.toDateString()).filter(Boolean)
  ).size;

  const avgNotesPerDay = uniqueDays > 0 ? (totalNotes / uniqueDays).toFixed(1) : '0';

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatsCard
        icon={<FileText className="w-5 h-5" />}
        label="Total Notes"
        value={totalNotes}
      />
      <StatsCard
        icon={<Calendar className="w-5 h-5" />}
        label="This Month"
        value={notesThisMonth}
      />
      <StatsCard
        icon={<TrendingUp className="w-5 h-5" />}
        label="Active Days"
        value={uniqueDays}
      />
      <StatsCard
        icon={<Clock className="w-5 h-5" />}
        label="Avg/Day"
        value={avgNotesPerDay}
      />
    </div>
  );
}
