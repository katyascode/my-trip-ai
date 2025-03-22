'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useTripsStore from '@/app/store/tripsStore';
import useExpenseStore from '@/app/store/expenseStore';
import Button from '@/app/components/Button';
import dayjs from 'dayjs';

const TripDetails = () => {
  const params = useParams();
  const router = useRouter();
  const getTripById = useTripsStore(state => state.getTripById);
  const trip = getTripById(params.id);
  const expenses = useExpenseStore(state => state.expenses);
  const spent = expenses
      .filter(expense => expense.tripId === params.id)
      .reduce((total, expense) => total + parseFloat(expense.amount || 0), 0);

  if (!trip) {
    return (
      <div className="max-w-[800px] mx-auto px-6 py-8">
        <div className="bg-white rounded-xl p-6 shadow-md border border-pink-600 text-center">
          <h1 className="text-2xl font-bold text-pink-800 mb-4">Trip not found</h1>
          <Button
            title="Back to Trips"
            colourClass="green"
            onClick={() => router.push('/trips')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="px-6 py-8 flex flex-col space-y-1">
        <h1 className="text-4xl font-semibold">{trip.destination}</h1>
        <div className="flex flex-row gap-2 text-sm">
          {dayjs(trip.departureDate).format('MMM D, YYYY')}
          {!trip.isOneWay && ` - ${dayjs(trip.returnDate).format('MMM D, YYYY')}`}
          <span>•</span>
          <div>${spent} / ${trip.budget} spent</div>
        </div>
        <div className="flex flex-row gap-2 text-sm">
          <button className="bg-pink-200 text-pink-600 rounded-lg px-2 py-1.5">
            + Add documents to trip
          </button>
          <button
            className="bg-green-200 text-green-400 rounded-lg px-2 py-1.5"
            onClick={() => router.push(`/trips/${params.id}/budget`)}
          >
            $ View budget
          </button>
        </div>
      </div>
      <div className="relative">
        {/* Top border with shadow and rounded corners */}
        <div className="absolute top-0 left-0 right-0 h-2 border-t-1 border-pink-600 rounded-t-xl"/>

        {/* Todo - Main content */}
      </div>
    </div>
  );
};

export default TripDetails;
