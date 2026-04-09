import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface Note {
  id: string;
  content: string;
  dateRange: DateRange;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}

export interface CalendarState {
  currentDate: Date;
  selectedRange: DateRange;
  notes: Note[];
  isDarkMode: boolean;
  heroImageIndex: number;
}

type CalendarAction =
  | { type: 'SET_CURRENT_DATE'; payload: Date }
  | { type: 'SET_SELECTED_RANGE'; payload: DateRange }
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: Note }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_DARK_MODE'; payload: boolean }
  | { type: 'SET_HERO_IMAGE_INDEX'; payload: number }
  | { type: 'LOAD_FROM_STORAGE'; payload: Partial<CalendarState> };

const CalendarContext = createContext<{
  state: CalendarState;
  dispatch: React.Dispatch<CalendarAction>;
} | null>(null);

const initialState: CalendarState = {
  currentDate: new Date(),
  selectedRange: { start: null, end: null },
  notes: [],
  isDarkMode: false,
  heroImageIndex: 0,
};

function calendarReducer(state: CalendarState, action: CalendarAction): CalendarState {
  switch (action.type) {
    case 'SET_CURRENT_DATE':
      return { ...state, currentDate: action.payload };
    case 'SET_SELECTED_RANGE':
      return { ...state, selectedRange: action.payload };
    case 'ADD_NOTE':
      return { ...state, notes: [...state.notes, action.payload] };
    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map(n => (n.id === action.payload.id ? action.payload : n)),
      };
    case 'DELETE_NOTE':
      return { ...state, notes: state.notes.filter(n => n.id !== action.payload) };
    case 'TOGGLE_DARK_MODE':
      return { ...state, isDarkMode: !state.isDarkMode };
    case 'SET_DARK_MODE':
      return { ...state, isDarkMode: action.payload };
    case 'SET_HERO_IMAGE_INDEX':
      return { ...state, heroImageIndex: action.payload };
    case 'LOAD_FROM_STORAGE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(calendarReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('calendarState');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        const loadedState = {
          ...parsed,
          currentDate: new Date(parsed.currentDate),
          selectedRange: {
            start: parsed.selectedRange.start ? new Date(parsed.selectedRange.start) : null,
            end: parsed.selectedRange.end ? new Date(parsed.selectedRange.end) : null,
          },
          notes: parsed.notes.map((note: any) => ({
            ...note,
            createdAt: new Date(note.createdAt),
            updatedAt: new Date(note.updatedAt),
            dateRange: {
              start: note.dateRange.start ? new Date(note.dateRange.start) : null,
              end: note.dateRange.end ? new Date(note.dateRange.end) : null,
            },
          })),
        };
        dispatch({ type: 'LOAD_FROM_STORAGE', payload: loadedState });
      } catch (error) {
        console.error('Failed to load calendar state from storage:', error);
      }
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('calendarState', JSON.stringify(state));
  }, [state]);

  // Apply dark mode to document
  useEffect(() => {
    if (state.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.isDarkMode]);

  return (
    <CalendarContext.Provider value={{ state, dispatch }}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within CalendarProvider');
  }
  return context;
}
