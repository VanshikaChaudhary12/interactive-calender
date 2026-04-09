# Interactive Wall Calendar

A production-quality, visually stunning interactive wall calendar component built with React, featuring advanced date range selection, smart notes management, dark mode, and smooth animations.

## 🎯 Overview

This calendar application delivers a premium user experience inspired by physical wall calendars with modern UX enhancements. It combines functional elegance with tactile feedback, making date planning intuitive and enjoyable.

**Design Philosophy:** Modern Minimalist with Tactile Depth—clean geometry with subtle physical affordances, professional yet warm aesthetic.

## ✨ Core Features

### 🔍 Search & Filter System
- **Real-time Search:** Instantly find notes across all date ranges
- **Tag Filtering:** Filter notes by categories (Work, Personal, Urgent, Event, Reminder)
- **Smart Results:** Empty states and result counts
- **Quick Clear:** Reset filters with one click

### 🏷️ Tag System
- **5 Color-Coded Tags:** Work (Blue), Personal (Green), Urgent (Red), Event (Purple), Reminder (Yellow)
- **Multi-Tag Support:** Add multiple tags to each note
- **Visual Organization:** Tags displayed on note cards
- **Filter by Tags:** Show only notes with specific tags

### ⚡ Quick Actions Menu
- **Floating Action Button:** Always accessible in bottom-right corner
- **Undo/Redo:** Full history tracking for note changes
- **Export Notes:** Download as JSON with all metadata
- **Print Calendar:** Beautiful print-ready format with notes

### 📊 Statistics Dashboard
- **Total Notes:** Track all your notes
- **Monthly Count:** Notes in current month
- **Active Days:** Days with at least one note
- **Average per Day:** Planning activity metrics

### 📅 Wall Calendar Aesthetic
- Beautiful hero image section with month/year overlay
- Clean, organized date grid layout with strong visual hierarchy
- Responsive design that adapts seamlessly from mobile to desktop
- Hero image carousel with smooth transitions

### 🗓️ Day Range Selection
- **Click to Select:** Click a date to set start, then click another to set end
- **Drag to Select:** Drag across dates for quick range selection
- **Hover Preview:** See potential range highlighted while hovering
- **Edge Cases:** Handles reverse selection, same-day selection, and complex ranges
- **Visual Feedback:** Selected dates highlighted with smooth animations

### 📝 Smart Notes System
- Add, edit, and delete notes for any date range
- Notes automatically attached to selected date ranges
- Edit existing notes with inline editing
- Delete notes with confirmation feedback
- **Search Notes:** Real-time search across all notes
- **Tag Notes:** Organize with color-coded categories
- **Export Feature:** Download all notes as JSON or text file
- **Undo/Redo:** Recover from mistakes instantly

### 🎨 Advanced UI/UX Features
- **Dark/Light Mode Toggle:** Smooth theme switching with persistent storage
- **Smooth Animations:** Framer Motion for fluid transitions and interactions
- **Holiday Markers:** Visual indicators with tooltips
- **Weekend Highlighting:** Visual distinction for weekend dates
- **Today Indicator:** Animated pulse on current date
- **Mini Calendar:** Quick navigation overview on the right sidebar
- **View Mode Switcher:** Toggle between Month/Week/Year views
- **Statistics Dashboard:** Visual overview of your planning activity
- **Enhanced Micro-interactions:** Spring physics and hover effects

### ⌨️ Keyboard Navigation
- **Arrow Keys:** Navigate between months (← →)
- **Ctrl+D:** Toggle dark/light mode
- **Ctrl+R:** Reset all selections
- Full keyboard accessibility with visible focus rings

### 💾 Persistent Storage
- All data saved to localStorage automatically
- Selected date ranges persist across sessions
- Notes and theme preference remembered
- No backend required—everything stored locally

### 🔔 Bonus Features
- **Export Notes:** Download notes as JSON or text file
- **Print Calendar:** Print-ready format with all notes
- **Mini Calendar Overview:** Quick date navigation
- **Tooltip Previews:** Holiday information on hover
- **Responsive Layout:** Three-column desktop, single-column mobile
- **Accessibility:** High contrast, keyboard navigation, semantic HTML
- **Undo/Redo System:** Full history tracking for all changes
- **Search & Filter:** Find notes instantly with smart filtering
- **Tag System:** Organize notes with color-coded categories
- **Statistics:** Track your planning habits and activity

## 🏗️ Technical Architecture

### Component Structure
```
components/
├── Header.tsx              # Top navigation with theme toggle
├── HeroSection.tsx         # Hero image with month/year display
├── CalendarGrid.tsx        # Main calendar with date cells
├── DateCell.tsx            # Individual date cell component
├── NotesPanel.tsx          # Notes management interface
├── MiniCalendar.tsx        # Quick navigation calendar
├── SearchBar.tsx           # Search functionality
├── TagSystem.tsx           # Tag management and filtering
├── QuickActionsMenu.tsx    # Floating action button menu
├── StatsDashboard.tsx      # Statistics visualization
├── ViewModeSwitcher.tsx    # View mode toggle
└── ui/                     # shadcn/ui components

contexts/
├── CalendarContext.tsx     # Global state management
└── ThemeContext.tsx        # Theme switching logic

hooks/
├── useUndoRedo.ts          # Undo/redo functionality
├── useMobile.tsx           # Mobile detection
└── usePersistFn.ts         # Persistence utilities

lib/
├── calendarUtils.ts        # Date utilities and helpers
└── exportUtils.ts          # Export and print utilities

pages/
└── Home.tsx                # Main page composition
```

### State Management
- **React Context API** for global state
- **useReducer** for predictable state updates
- **localStorage** for persistence
- Automatic serialization/deserialization of Date objects

### Styling
- **Tailwind CSS 4** with custom color tokens
- **OKLCH color space** for perceptually uniform colors
- **Framer Motion** for animations
- **shadcn/ui** for accessible components
- Custom design tokens in `client/src/index.css`

## 🎨 Design System

### Color Palette (Light Mode)
- **Background:** Off-white (`oklch(0.98 0.001 286)`)
- **Primary Accent:** Deep Teal (`oklch(0.45 0.15 200)`)
- **Secondary:** Warm Sand (`oklch(0.88 0.08 80)`)
- **Text:** Charcoal (`oklch(0.25 0.02 240)`)

### Typography
- **Display Font:** Geist (modern, geometric)
- **Body Font:** Sora (clean, readable)
- **Monospace:** JetBrains Mono (technical content)

### Spacing & Radius
- **Base Radius:** 12px (cards), 8px (buttons)
- **Spacing Scale:** 4px, 8px, 12px, 16px, 24px, 32px
- **Shadows:** Soft layered shadows for depth

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (package manager)

### Installation
```bash
# Clone the repository
cd interactive-calendar

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will be available at `http://localhost:3000`

### Build for Production
```bash
pnpm build
```

## 📱 Responsive Design

### Desktop (1024px+)
- Three-column layout: Hero | Calendar | Notes/Mini Calendar
- Full-width calendar grid
- Side-by-side notes panel

### Tablet (768px - 1023px)
- Two-column layout with adjusted spacing
- Calendar takes more space
- Notes panel below

### Mobile (< 768px)
- Single column stacked layout
- Hero image full width
- Calendar optimized for touch
- Notes panel below calendar
- Touch-friendly button sizes

## 🎮 User Interactions

### Date Selection
1. **First Click:** Sets start date (highlighted in primary color)
2. **Second Click:** Sets end date (range highlighted in light primary)
3. **Third Click:** Resets and starts new selection

### Drag Selection
- Click and drag across dates to select a range
- Visual feedback during drag operation
- Supports reverse direction selection

### Notes Management
1. Select a date range
2. Type note content in the text area
3. Click "Add Note" to save
4. Edit existing notes inline
5. Delete notes with one click
6. Export all notes as text file

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `← →` | Navigate between months |
| `Ctrl+D` | Toggle dark/light mode |
| `Ctrl+R` | Reset all selections |
| `Tab` | Navigate interactive elements |
| `Enter` | Activate buttons/links |
| `Ctrl+Z` | Undo (via Quick Actions) |
| `Ctrl+Y` | Redo (via Quick Actions) |

## 🔧 Configuration

### Holidays
Edit `client/src/lib/calendarUtils.ts` to add/modify holidays:
```typescript
export const HOLIDAYS: Record<string, string> = {
  '01-01': 'New Year',
  '02-14': "Valentine's Day",
  // Add more holidays in MM-DD format
};
```

### Hero Images
The calendar includes three beautiful hero images. To add more:
1. Upload images to your CDN
2. Add URLs to `HERO_IMAGES` array in `calendarUtils.ts`

### Theme Colors
Customize colors in `client/src/index.css`:
- Light mode: `:root` CSS variables
- Dark mode: `.dark` CSS variables

## 📊 Performance Optimizations

- **Memoized Components:** DateCell uses React.memo to prevent unnecessary re-renders
- **Lazy Animations:** Framer Motion animations optimized for 60fps
- **Efficient State Updates:** useReducer prevents redundant renders
- **localStorage Debouncing:** Automatic persistence without excessive writes

## 🔐 Data Privacy

All data is stored locally in your browser's localStorage. No data is sent to any server. You maintain complete control over your calendar data.

## ♿ Accessibility

- **WCAG 2.1 AA Compliant**
- High contrast text (4.5:1 ratio)
- Keyboard navigation support
- Semantic HTML structure
- ARIA labels on interactive elements
- Focus indicators visible on all interactive elements
- Screen reader friendly

## 🐛 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📦 Dependencies

### Core
- **React 19:** UI framework
- **Framer Motion 12:** Animations
- **Tailwind CSS 4:** Styling
- **shadcn/ui:** Accessible components

### Utilities
- **nanoid:** Unique ID generation
- **wouter:** Client-side routing
- **lucide-react:** Icons

## 🎯 Future Enhancements

- Recurring events/reminders
- Calendar sharing and collaboration
- Integration with Google Calendar/Outlook
- Mobile app (React Native)
- Time zone support
- Custom color themes
- Advanced search with filters
- Note templates
- Bulk operations
- Calendar import/export (iCal format)

## 📄 License

MIT License - Feel free to use this calendar in your projects.

## 🙏 Credits

Built with modern web technologies and best practices in frontend engineering. Designed with attention to detail and user experience.

---

**Version:** 2.0.0 - Enhanced Edition  
**Last Updated:** December 2024  
**Status:** Production Ready ✅

**New in v2.0:**
- ✨ Search & Filter System
- 🏷️ Tag Organization
- ⚡ Quick Actions Menu
- ↩️ Undo/Redo Support
- 📊 Statistics Dashboard
- 💾 Enhanced Export Features
- 🎨 Improved Animations

**See [ENHANCEMENTS.md](./ENHANCEMENTS.md) for detailed changelog**  
**See [QUICK_START.md](./QUICK_START.md) for user guide**
