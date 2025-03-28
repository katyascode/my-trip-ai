import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useTripsStore from './tripsStore';
import useUploadStore from './uploadStore';

const useProfileStore = create(
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
      updateProfile: (id, updatedProfile)=> {
        set((state)=>({
          profiles: state.profiles.map(profile =>
            profile.id === id ? {...updatedProfile, id} : profile
          )
        }));
      },
      //for testing purposes
      deleteProfile: (id) => {
        const trips = useTripsStore.getState().getTripByProfileId(id);

        // Delete all documents associated with these trips
        trips.forEach(trip => {
          useUploadStore.getState().deleteFilesByTripId(trip.id);
        });

        set((state)=>({
          profiles:state.profiles.filter(profile=>profile.id !==id)
        }));
      }
    }),
    {
      name: 'profile-storage',
    }
  )
);

export default useProfileStore;
