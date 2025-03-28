'use client';

import React from 'react';
import useTripsStore from '@/app/store/tripsStore';
import useProfileStore from '../store/profileStore';
import TripCard from '@/app/components/TripCard';
import Button from '@/app/components/Button';
import { FaPlaneUp } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';


const Trips = () => {
  const router = useRouter();
  const profiles = useProfileStore(state=>state.profiles);
  const latestProfile = profiles[profiles.length - 1];
  const trips = useTripsStore(state => state.trips);
  const profileTrips = latestProfile ? trips.filter(trip=>trip.profileId === latestProfile.id) : [];

  return (
    <div className="max-w-[800px] mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-pink-800">My Trips</h1>
        <Button
          title="Create New Trip"
          icon={<FaPlaneUp/>}
          colourClass="green"
          link="/trips/create"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {!latestProfile ? (
          <div className='col-span-2 text-center py-8'>
            <p className='text-gray-500 mb-4'>Create a profile first to manage trips.</p>
            <Button
              title="Create Profile"
              colourClass="green"
              onClick={()=>router.push('/trips/profile/register')}
          />
          </div>
        ) : profileTrips.length === 0 ? (
          <p className="text-gray-500 col-span-2 text-center py-8">
            No trips yet. Create your first trip!
          </p>
        ) : (
          profileTrips.map(trip => (
            <TripCard key={trip.id} trip={trip} />
          ))
        )}
      </div>
    </div>
  );
}

export default Trips;
