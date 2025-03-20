'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

const TripCard = ({ trip }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/trips/${trip.id}`);
  };

  return (
    <div 
      className="bg-white shadow-md rounded-xl p-3.5 border border-pink-600 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleClick}
    >
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
