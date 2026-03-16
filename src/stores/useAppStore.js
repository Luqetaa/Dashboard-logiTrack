import { create } from "zustand"

/**
 * Global application store managed by Zustand.
 * Handles sidebar state and global search query.
 */
export const useAppStore = create((set) => ({
  sidebarOpen: false,
  searchQuery: "",

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}))
