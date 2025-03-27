'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useTripsStore from '@/app/store/tripsStore';
import Button from '@/app/components/Button';
import dayjs from 'dayjs';
import useProfileStore from '@/app/store/profileStore';
import useUploadStore from '@/app/store/uploadStore';

const ItineraryPage = () => {
  const params = useParams();
  const router = useRouter();
  const getTripById = useTripsStore(state => state.getTripById);
  const files = useUploadStore(state => state.uploadedFiles);
  const filesText = files.map(file => file.text);
  const trip = getTripById(params.id);
  const [aiResponse, setAiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const profiles = useProfileStore(state => state.profiles);
  const latestProfile = profiles.length > 0 ? profiles[profiles.length - 1] : null;

  useEffect(() => {
    const fetchAiSuggestions = async () => {
      if (!trip || !latestProfile) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/openai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'itinerary',
            userMessage: `Generate an itinerary for ${trip.destination}`,
            destinationCity: trip.destination,
            files: filesText,
            preferences: latestProfile.interests,
            budget: latestProfile.budget
          })
        });

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setAiResponse(data.reply);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAiSuggestions();
  }, [trip, latestProfile]);

  // Show not found state
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
    <div className="max-w-[800px] mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Itinerary for {trip.destination}</h1>
          <p className="text-gray-600">
            {dayjs(trip.departureDate).format('MMM D')} - {dayjs(trip.returnDate).format('MMM D, YYYY')}
          </p>
        </div>
        <Button
          title="Back to Trip"
          colourClass="green"
          onClick={() => router.back()}
        />
      </div>

      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-2 border-t-1 border-pink-600 rounded-t-xl" />
        <div className="px-6 py-4">
          {isLoading && <div className="text-gray-600">Loading itinerary...</div>}
          {error && <div className="text-red-600">Error: {error}</div>}
          {aiResponse && (
            <div className="bg-white rounded-lg p-4 shadow-sm border border-pink-200">
              <h2 className="text-xl font-semibold text-pink-800 mb-2">Trip Suggestions</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{aiResponse}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItineraryPage;
