import { create } from 'zustand';
import { sanityClient } from '../../sanityClient';

export const useStore = create((set) => ({
  bears: 0,
  addPopulation: () => set((state) => ({ bears: state.bears + 2 })),
  manga: {},
  fetch: async () => {
    const result = await sanityClient.fetch(
      `*[_type == "incompleteManga" && _id == "hcPd9DU4IcfM8v35xVeG6I"]`,
    );
    set({ manga: result });
  },
}));

export const useBoundStore = create(() => ({
  count: 0,
  text: 'hello',
}));
