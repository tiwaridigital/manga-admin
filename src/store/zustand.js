import { create } from 'zustand';

export const useStore = create((set) => ({
  bears: 0,
  addPopulation: () => set((state) => ({ bears: state.bears + 2 })),
}));
