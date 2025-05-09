import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Book, User, ThemeMode, AuthState, UserProfile, AdminDashboard } from './types';
import { mockBooks } from './mockData';
import { supabase } from './lib/supabase';

interface AppState {
  // Books state
  books: Book[];
  currentBook: Book | null;
  isAudioPlaying: boolean;
  
  // UI state
  currentTheme: ThemeMode;
  isMenuOpen: boolean;
  searchQuery: string;
  
  // Auth state
  auth: AuthState;
  
  // User state
  userProfile: UserProfile | null;
  
  // Admin state
  adminDashboard: AdminDashboard | null;
  
  // Actions - Books
  setBooks: (books: Book[]) => void;
  setCurrentBook: (book: Book | null) => void;
  toggleAudioPlaying: () => void;
  
  // Actions - UI
  setTheme: (theme: ThemeMode) => void;
  toggleMenu: () => void;
  setSearchQuery: (query: string) => void;
  
  // Actions - Auth
  login: (token: string, user: User) => void;
  logout: () => void;
  setAuthLoading: (isLoading: boolean) => void;
  setAuthError: (error: string | null) => void;
  
  // Actions - User
  setUserProfile: (profile: UserProfile) => void;
  
  // Actions - Admin
  setAdminDashboard: (dashboard: AdminDashboard) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Books state
      books: mockBooks,
      currentBook: null,
      isAudioPlaying: false,
      
      // UI state
      currentTheme: 'light',
      isMenuOpen: false,
      searchQuery: '',
      
      // Auth state
      auth: {
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      },
      
      // User state
      userProfile: null,
      
      // Admin state
      adminDashboard: null,
      
      // Actions - Books
      setBooks: (books) => set({ books }),
      setCurrentBook: (book) => set({ currentBook: book }),
      toggleAudioPlaying: () => set((state) => ({ isAudioPlaying: !state.isAudioPlaying })),
      
      // Actions - UI
      setTheme: (theme) => set({ currentTheme: theme }),
      toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      // Actions - Auth
      login: (token, user) => set({
        auth: {
          token,
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        }
      }),
      logout: async () => {
        await supabase.auth.signOut();
        set({
          auth: {
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          },
          userProfile: null,
          adminDashboard: null
        });
      },
      setAuthLoading: (isLoading) => set((state) => ({
        auth: { ...state.auth, isLoading }
      })),
      setAuthError: (error) => set((state) => ({
        auth: { ...state.auth, error }
      })),
      
      // Actions - User
      setUserProfile: (profile) => set({ userProfile: profile }),
      
      // Actions - Admin
      setAdminDashboard: (dashboard) => set({ adminDashboard: dashboard }),
    }),
    {
      name: 'text-center-storage',
      partialize: (state) => ({
        currentTheme: state.currentTheme,
        auth: {
          token: state.auth.token,
          user: state.auth.user,
          isAuthenticated: state.auth.isAuthenticated
        }
      })
    }
  )
);