'use client';

import React from 'react';
import useTripsStore from '@/app/store/tripsStore';
import TripCard from '@/app/components/TripCard';
import Button from '@/app/components/Button';
import { FaPlaneUp } from 'react-icons/fa6';

const Trips = () => {
  const trips = useTripsStore(state => state.trips);

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
        {trips.map(trip => (
          <TripCard key={trip.id} trip={trip} />
        ))}
        {trips.length === 0 && (
          <p className="text-gray-500 col-span-2 text-center py-8">
            No trips yet. Create your first trip!
          </p>
        )}
      </div>
    </div>
  );
}

export default Trips;
