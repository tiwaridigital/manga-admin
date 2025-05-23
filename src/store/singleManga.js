import { create } from 'zustand';

export const useGenres = create((set) => ({
  genres: [],
}));
