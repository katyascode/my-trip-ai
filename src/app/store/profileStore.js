import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useExpenseStore = create(
  persist(
    (set, get) => ({
      profiles: [],
      addProfile: (profile) => {
        const id = Math.random().toString(36).substr(2, 9);
        set((state) => ({
          profiles: [...state.profiles, { ...profile, id }]
        }));
        return id;
      },
      getProfileById: (id) => get().profiles.find(profile => profile.id === id),
    }),
    {
      name: 'profile-storage',
    }
  )
);

export default useExpenseStore;
