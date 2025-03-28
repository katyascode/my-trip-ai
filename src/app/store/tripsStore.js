import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useTripsStore = create(
  persist(
    (set, get) => ({
      trips: [],
      addTrip: (trip) => {
        const id = Math.random().toString(36).substr(2, 9);
        set((state) => ({
          trips: [...state.trips, { ...trip, id, itinerary: null, preferences: null }]
        }));
        return id;
      },
      getTripById: (id) => get().trips.find(trip => trip.id === id),
      getTripByProfileId: (profileId) => get().trips.filter(trip=>trip.profileId ===profileId),
      deleteTrip: (id) => {
        set((state) => ({
          trips: state.trips.filter(trip => trip.id !== id)
        }));
      },
      deleteTripsByProfileId: (profileId)=>{
        set((state)=> ({
          trips:state.trips.filter(trip=>trip.profileId !==profileId)
        }));
      },

      updateTripItinerary: (id, itinerary) => {
        set((state) => ({
          trips: state.trips.map(trip =>
            trip.id === id ? { ...trip, itinerary } : trip
          )
        }));
      },

      updateTripPreferences: (id, preferences) => {
        set((state) => ({
          trips: state.trips.map(trip =>
            trip.id === id ? { ...trip, preferences } : trip
          )
        }));
      },
    }),
    {
      name: 'trips-storage',
    }
  )
);

export default useTripsStore;
