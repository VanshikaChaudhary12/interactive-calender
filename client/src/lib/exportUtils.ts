import { Note } from '@/contexts/CalendarContext';
import { formatDate } from './calendarUtils';

export function exportCalendarAsPDF(currentMonth: Date, notes: Note[]) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const monthNotes = notes.filter(note => {
    const noteDate = note.dateRange.start;
    return noteDate && 
      noteDate.getMonth() === currentMonth.getMonth() &&
      noteDate.getFullYear() === currentMonth.getFullYear();
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Calendar - ${currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</title>
      <style>
        body {
          font-family: system-ui, -apple-system, sans-serif;
          padding: 40px;
          max-width: 800px;
          margin: 0 auto;
        }
        h1 {
          color: #1a1a1a;
          margin-bottom: 30px;
          text-align: center;
        }
        .note {
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
          page-break-inside: avoid;
        }
        .note-date {
          color: #666;
          font-size: 14px;
          margin-bottom: 8px;
        }
        .note-content {
          color: #1a1a1a;
          line-height: 1.6;
        }
        .note-tags {
          margin-top: 8px;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .tag {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          background: #f0f0f0;
          color: #333;
        }
        @media print {
          body { padding: 20px; }
        }
      </style>
    </head>
    <body>
      <h1>Calendar - ${currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h1>
      ${monthNotes.length === 0 ? '<p style="text-align: center; color: #666;">No notes for this month</p>' : ''}
      ${monthNotes.map(note => `
        <div class="note">
          <div class="note-date">
            ${formatDate(note.dateRange.start!)} - ${formatDate(note.dateRange.end!)}
          </div>
          <div class="note-content">${note.content}</div>
          ${note.tags && note.tags.length > 0 ? `
            <div class="note-tags">
              ${note.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
          ` : ''}
        </div>
      `).join('')}
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 250);
}

export function exportNotesAsJSON(notes: Note[]) {
  const dataStr = JSON.stringify(notes, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `calendar-notes-${new Date().toISOString().split('T')[0]}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}
