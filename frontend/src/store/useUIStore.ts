import { create } from 'zustand';

interface UIState {
  activeTab: 'encrypt' | 'decrypt' | 'keys';
  setActiveTab: (tab: 'encrypt' | 'decrypt' | 'keys') => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'encrypt',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
