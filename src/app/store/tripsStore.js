import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useTripsStore = create(
  persist(
    (set, get) => ({
      trips: [],
      addTrip: (trip) => {
        const id = Math.random().toString(36).substr(2, 9);
        set((state) => ({ 
          trips: [...state.trips, { ...trip, id }] 
        }));
        return id;
      },
      getTripById: (id) => get().trips.find(trip => trip.id === id),
    }),
    {
      name: 'trips-storage',
    }
  )
);

export default useTripsStore;
