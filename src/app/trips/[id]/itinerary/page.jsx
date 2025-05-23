'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useTripsStore from '@/app/store/tripsStore';
import Button from '@/app/components/Button';
import dayjs from 'dayjs';
import useProfileStore from '@/app/store/profileStore';
import useUploadStore from '@/app/store/uploadStore';
import ReactMarkdown from 'react-markdown';
import { MdEdit, MdCheck, MdClose, MdLoop } from 'react-icons/md';
import InputField from "@/app/components/InputField";

// Custom components for markdown rendering
const MarkdownComponents = {
  h2: ({ children }) => <h2 className="text-xl font-bold text-pink-800 mt-8 mb-4">{children}</h2>,
  h3: ({ children }) => <h3 className="text-lg font-semibold text-green-400 mt-6 mb-3">{children}</h3>,
  ul: ({ children }) => <ul className="space-y-2 mb-4">{children}</ul>,
  li: ({ children }) => (
    <li className="flex items-start">
      <span className="text-pink-600 mr-2">•</span>
      <span>{children}</span>
    </li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-pink-200 pl-4 my-4 text-gray-600 italic">
      {children}
    </blockquote>
  ),
  em: ({ children }) => <em className="text-gray-600 italic">{children}</em>,
};

const ItineraryPage = () => {
  const params = useParams();
  const router = useRouter();
  const getTripById = useTripsStore(state => state.getTripById);
  const updateTripItinerary = useTripsStore(state => state.updateTripItinerary);
  const updateTripPreferences = useTripsStore(state => state.updateTripPreferences);
  const files = useUploadStore(state => state.uploadedFiles);
  const filesText = files.map(file => file.text); // Todo - Pull only the files associated to the trip
  const trip = getTripById(params.id);
  const [aiResponse, setAiResponse] = useState(trip?.itinerary || null);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState(null);
  const profiles = useProfileStore(state => state.profiles);
  const latestProfile = profiles.length > 0 ? profiles[profiles.length - 1] : null;
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [preferences, setPreferences] = useState(trip?.preferences || '');

  // Handle initial loading state
  useEffect(() => {
    // Simulate a small delay to ensure we have the trip data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSavePreferences = () => {
    updateTripPreferences(trip.id, preferences);
    setIsEditingPreferences(false);
    fetchAiSuggestions(); // Regenerate itinerary with new preferences
  };

  const fetchAiSuggestions = async () => {
    if (!trip || !latestProfile) {
      console.log('Missing data:', { trip: !!trip, latestProfile: !!latestProfile });
    }

    setIsRegenerating(true);
    setError(null);

    try {
      // Calculate trip duration
      const startDate = dayjs(trip.departureDate);
      const endDate = dayjs(trip.returnDate);
      const tripDuration = endDate.diff(startDate, 'day') + 1;

      // Combine profile interests with trip-specific preferences
      const combinedPreferences = [
        latestProfile?.interests,
        preferences
      ].filter(Boolean).join(', ') || 'any';

      const requestBody = {
        type: 'itinerary',
        userMessage: `Generate an itinerary for ${trip.destination} for exactly ${tripDuration} days, from ${startDate.format('MMMM D')} to ${endDate.format('MMMM D, YYYY')}`,
        destinationCity: trip.destination,
        files: filesText,
        preferences: combinedPreferences,
        budget: latestProfile?.budget || "any",
        duration: tripDuration,
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD')
      };
      console.log('Sending request:', requestBody);

      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      console.log('Received response:', data);

      if (data.error) {
        throw new Error(data.error);
      }
      setAiResponse(data.reply);
      updateTripItinerary(trip.id, data.reply);
    } catch (err) {
      console.error('Error details:', err);
      setError(err.message);
    } finally {
      setIsRegenerating(false);
    }
  };

  // Show loading state first
  if (isLoading) {
    return (
      <div className="max-w-[800px] mx-auto px-6 py-8">
        <div className="bg-white rounded-xl p-6 shadow-md border border-pink-600 text-center">
          <h1 className="text-2xl font-bold text-pink-800 mb-4">Loading itinerary...</h1>
        </div>
      </div>
    );
  }

  // Then show not found state if no trip
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
    <div className="max-w-[800px] mx-auto">
      <div className="px-6 py-8">
        <button
          className="text-green-400 bg-green-200 px-1.5 py-1 rounded-lg mb-2"
          onClick={() => router.back()}
        >
          Back to trip
        </button>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Itinerary for {trip.destination}</h1>
            <p className="text-gray-600">
              {dayjs(trip.departureDate).format('MMM D, YYYY')} - {dayjs(trip.returnDate).format('MMM D, YYYY')}
            </p>
            <p className="mt-2 text-pink-800 font-semibold">Trip preferences:</p>
            <div className="flex items-center gap-2">
              {isEditingPreferences ? (
                <div className="flex items-center w-80 gap-2">
                  <InputField
                    type="text"
                    value={preferences}
                    onChange={(e) => setPreferences(e.target.value)}
                    placeholder="E.g. art, culture"
                  />
                  <button
                    onClick={handleSavePreferences}
                    className="text-green-600 hover:text-green-700"
                  >
                    <MdCheck size={20} />
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingPreferences(false);
                      setPreferences(trip.preferences || '');
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    <MdClose size={20} />
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-gray-600">
                    {preferences || 'Set your trip preferences'}
                  </span>
                  <button
                    onClick={() => setIsEditingPreferences(true)}
                    className="text-pink-600 hover:text-pink-700"
                  >
                    <MdEdit size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pink border */}
      <div className="absolute top-0 left-0 right-0 h-2 border-t-1 border-pink-600 rounded-t-xl"/>

      {/* Itinerary content pulled from ChatGPT */}
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-2 border-t-1 border-pink-600 rounded-t-xl"/>
        {!aiResponse && !isRegenerating && (
          <div className="text-center py-8">
            <Button
              title="Generate Itinerary"
              colourClass="green"
              onClick={fetchAiSuggestions}
            />
          </div>
        )}
        {isRegenerating && (
          <div className="px-8 py-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-pink-800">Trip Suggestions</h2>
              <div className="text-gray-600">Regenerating...</div>
            </div>
          </div>
        )}
        {error && <div className="text-red-600">Error: {error}</div>}
        {aiResponse && !isRegenerating && (
          <div className="bg-white px-8 py-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-pink-800">Trip Suggestions</h2>
              <button
                className="bg-pink-400 rounded-full p-1"
                onClick={fetchAiSuggestions}
              >
                <MdLoop />
              </button>
            </div>
            {(!latestProfile?.interests || !latestProfile?.budget) && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                <p className="text-yellow-800">
                  Your result will be more accurate if you complete your user profile with your interests and budget preferences.
                </p>
              </div>
            )}
            <div className="prose max-w-none">
              <ReactMarkdown components={MarkdownComponents}>{aiResponse}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItineraryPage;
