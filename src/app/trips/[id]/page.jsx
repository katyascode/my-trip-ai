'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useTripsStore from '@/app/store/tripsStore';
import useExpenseStore from '@/app/store/expenseStore';
import useProfileStore from '@/app/store/profileStore';
import Button from '@/app/components/Button';
import dayjs from 'dayjs';
import useUploadStore from '@/app/store/uploadStore';
import UploadPopUp from "@/app/components/UploadPopUp";
import DocumentViewerPopUp from "@/app/components/DocumentViewerPopUp";


const TripDetails = () => {
  const params = useParams();
  const router = useRouter();
  const getTripById = useTripsStore(state => state.getTripById);
  const trip = getTripById(params.id);
  const expenses = useExpenseStore(state => state.expenses);
  const spent = expenses
      .filter(expense => expense.tripId === params.id)
      .reduce((total, expense) => total + parseFloat(expense.amount || 0), 0);
  const [aiResponse, setAiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const profiles = useProfileStore(state => state.profiles);
  const latestProfile = profiles[profiles.length - 1];

  const fileInputRef = useRef();
  const uploadedFiles = useUploadStore(state => state.uploadedFiles);
  const addFile = useUploadStore(state => state.addFile);
  const deleteFile = useUploadStore(state => state.deleteFile);
  const [showViewerPopUp, setShowViewerPopUp] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState('');
  const [showUploadPopUp, setShowUploadPopUp] = useState(false);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || !trip) return;
  
    setSelectedFile(file);
    setPreviewURL(URL.createObjectURL(file));
    setShowUploadPopUp(true);
  };

  const handleUpload = (fileData) => {
    addFile({
      ...fileData,
      trip: trip.destination,
      tripId: trip.id,
    });
  
    setSelectedFile(null);
    setPreviewURL('');
    setShowUploadPopUp(false);
  };

  useEffect(() => {
    const fetchAiSuggestions = async () => {
      if (!trip) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/openai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'trip',
            userMessage: `Tell me about ${trip.destination}`,
            destinationCity: trip.destination,
            // age: trip.age,
            preferences: latestProfile.interests,
            // originAirport: trip.originAirport,
            // destinationAirport: trip.destinationAirport
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
  }, [trip]);

  return (
    <div className="flex flex-col">
    {!trip ? (
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
      ) : (
        <>
          <DocumentViewerPopUp
            isOpen={showViewerPopUp}
            onClose={() => setShowViewerPopUp(false)}
            files={uploadedFiles}
            tripId={params.id}
            deleteFile={deleteFile}
          />
          <UploadPopUp
            isOpen={showUploadPopUp}
            onClose={() => {
              setShowUploadPopUp(false);
              setSelectedFile(null);
              setPreviewURL('');
            }}
            onUpload={handleUpload}
            selectedFile={selectedFile}
            previewURL={previewURL}
          />

          <div className="px-6 py-8 flex flex-col space-y-1">
            <h1 className="text-4xl font-semibold">{trip.destination}</h1>
            <div className="flex flex-row gap-2 text-sm">
              {dayjs(trip.departureDate).format('MMM D, YYYY')}
              {!trip.isOneWay && ` - ${dayjs(trip.returnDate).format('MMM D, YYYY')}`}
              <span>•</span>
              <div>${spent.toFixed(2)} / ${trip.budget} spent</div>
            </div>
            <div className="flex flex-row justify-between items-center text-sm mt-2">
              <div className="flex gap-2">
                <button
                  className="bg-pink-200 text-pink-600 rounded-lg px-2 py-1.5"
                  onClick={() => fileInputRef.current.click()}
                >
                  + Add documents to trip
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                />

                <button
                  className="bg-green-200 text-green-400 rounded-lg px-2 py-1.5"
                  onClick={() => router.push(`/trips/${params.id}/budget`)}
                >
                  $ View budget
                </button>
              </div>

              <button
                onClick={() => setShowViewerPopUp(true)}
                className="bg-orange-100 text-orange-400 rounded-lg px-2 py-1.5"
                title="View uploaded documents"
              >
                📁 Docs
              </button>
            </div>

            {/* Centered Generate Itinerary Button */}
            <div className="flex justify-center mt-4">
              <button
                className="bg-pink-500 text-white font-bold rounded-lg px-4 py-3 w-full max-w-md text-lg shadow-md hover:bg-pink-600 transition"
                onClick={() => router.push(`/trips/${params.id}/itinerary`)}
              >
                ✨ Generate Itinerary
              </button>
            </div>



          <div className="relative">
            <div className="absolute top-0 left-0 right-0 h-2 border-t-1 border-pink-600 rounded-t-xl"/>
            <div className="px-6 py-4">
              {isLoading && <div className="text-gray-600">Loading suggestions...</div>}
              {error && <div className="text-red-600">Error: {error}</div>}
              {aiResponse && (
                <div className="bg-white rounded-lg p-4 shadow-sm border border-pink-200">
                  <h2 className="text-xl font-semibold text-pink-800 mb-2">Travel Tips</h2>
                  <p className="text-gray-700 whitespace-pre-wrap">{aiResponse}</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TripDetails;
