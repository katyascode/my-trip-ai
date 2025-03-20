'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import InputField from "@/app/components/InputField";
import Button from "@/app/components/Button";
import {FaUpload} from "react-icons/fa6";
import useTripsStore from '@/app/store/tripsStore';

// Todo - Form Validation -> End date cannot be before start date
// Todo - Upload documents mockup
const CreateTrip = () => {
  const router = useRouter();
  const addTrip = useTripsStore(state => state.addTrip);
  const [tripData, setTripData] = useState({
    destination: '',
    departureDate: '',
    returnDate: '',
    isOneWay: false,
    budget: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting trip data:', tripData);

    try {
      const newTripId = addTrip(tripData);
      console.log('Created trip with ID:', newTripId);
      await router.push(`/trips/${newTripId}`);
    } catch (error) {
      console.error('Error creating trip:', error);
    }
  };

  const isFormValid = () => {
    const valid = tripData.destination &&
           tripData.departureDate &&
           (tripData.isOneWay || tripData.returnDate) &&
           tripData.budget;
    console.log('Form valid:', valid, tripData);
    return valid;
  };

  return (
    <div className="max-w-[600px] mx-auto p-5 bg-white rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create a new trip</h1>
        <button
          className="text-2xl text-pink-600 hover:text-gray-600"
          onClick={() => router.back()}
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <InputField
            type="text"
            value={tripData.destination}
            label="Heading to:"
            onChange={(e) => {
              console.log('Destination change:', e.target.value);
              setTripData({...tripData, destination: e.target.value});
            }}
            placeholder="Enter your destination"
          />
        </div>

        <div className="space-y-3">
          <div className="flex flex-row items-center gap-2">
            <label className="font-semibold">Travel dates</label>
            <InputField
              type="checkbox"
              label="One-way"
              checked={tripData.isOneWay}
              onChange={(e) => setTripData({...tripData, isOneWay: e.target.checked})}
            />
          </div>
          <div className="flex flex-row justify-between gap-4">
            <InputField
              type="date"
              placeholder="Departure date"
              value={tripData.departureDate}
              onChange={(e) => setTripData({...tripData, departureDate: e.target.value})}
            />
            {!tripData.isOneWay && (
              <InputField
                type="date"
                placeholder="Return date"
                value={tripData.returnDate}
                onChange={(e) => setTripData({...tripData, returnDate: e.target.value})}
              />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <InputField
            label="Budget"
            type="number"
            placeholder="How much do you want to spend?"
            value={tripData.budget}
            onChange={(e) => setTripData({...tripData, budget: e.target.value})}
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="font-semibold">Upload documents</label>
          <p className="text-sm text-green-400">
            Add travel papers like boarding passes, hotel bookings, or rental confirmations,
            and we'll take care of the rest by providing intelligent suggestions based on your bookings.
          </p>
          <div className="mt-2 flex justify-center">
            <Button
              title="Upload Documents..."
              colourClass="green"
              textSize="text-reg"
              icon={<FaUpload />}
              iconSide="left"
              customClassName="w-full"
            />
          </div>
        </div>

        <div className="flex justify-center pt-6 mt-10">
          <Button
            type="submit"
            title="Create my trip!"
            fontWeight="font-semibold"
            colourClass="pinkStrong"
            isDisabled={!isFormValid()}
          />
        </div>
      </form>
    </div>
  );
};

export default CreateTrip;
