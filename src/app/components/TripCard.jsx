'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import useTripsStore from '@/app/store/tripsStore';

const TripCard = ({ trip }) => {
  const router = useRouter();
  const deleteTrip = useTripsStore(state => state.deleteTrip);

  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    router.push(`/trips/${trip.id}`);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // prevent triggering the card's click
    setShowModal(true);
  };

  const confirmDelete = () => {
    deleteTrip(trip.id);
    setShowModal(false);
  };

  const cancelDelete = () => {
    setShowModal(false);
  };

  return (
    <div
      className="relative bg-white shadow-md rounded-xl p-3.5 border border-pink-600 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleClick}
    >
      <button
        onClick={handleDeleteClick}
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

      {/* Modal */}
      {showModal && (
        <div
          className="fixed border inset-0 bg-opacity-20 backdrop-blur-xs flex items-center justify-center z-50"
          onClick={cancelDelete}
        >
          <div
            className="bg-white p-6 rounded-xl shadow-lg w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Delete Trip</h2>
            <p className="text-sm mb-6">Are you sure you want to delete this trip?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-pink-800 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripCard;
