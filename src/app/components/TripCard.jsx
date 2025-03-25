'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import useTripsStore from '@/app/store/tripsStore';


const TripCard = ({ trip }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/trips/${trip.id}`);
  };

  const deleteTrip = useTripsStore(state => state.deleteTrip);

  const handleDelete = (e) => {
    e.stopPropagation(); // prevent triggering the card's click
    if (confirm("Are you sure you want to delete this trip?")) {
      deleteTrip(trip.id);
    }
  };  


  return (
    <div 
      className="relative bg-white shadow-md rounded-xl p-3.5 border border-pink-600 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleClick}
    >
      <button
        onClick={handleDelete}
        title="Delete this trip"
        className="absolute top-2 right-2 text-pink-600 hover:text-red-600 text-lg"
      >
        ✕
      </button>
      <p className="text-xl font-semibold">{trip.destination}</p>
      <p className="text-sm text-green-400">
        {dayjs(trip.departureDate).format('MMM D, YYYY')}
        {!trip.isOneWay && ` - ${dayjs(trip.returnDate).format('MMM D, YYYY')}`}
      </p>
      <p className="text-sm text-pink-600 mt-1">Budget: ${trip.budget}</p>
    </div>
  );
}

export default TripCard;
