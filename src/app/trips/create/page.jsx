'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import InputField from "@/app/components/InputField";
import Button from "@/app/components/Button";
import {FaUpload} from "react-icons/fa6";
import useTripsStore from '@/app/store/tripsStore';
import useUploadStore from '@/app/store/uploadStore';

// (Checklist) Todo - Form Validation -> End date cannot be before start date
// (Checklist) Todo - Upload documents mockup -> Allow user to upload documents
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

  const [dateError, setDateError] = useState('');
  const [budgetError, setBudgetError] = useState('');
  const [destinationError, setDestinationError] = useState('');

  const fileInputRef = useRef();
  const [pendingUploads, setPendingUploads] = useState([]);
  const addFileToStore = useUploadStore(state => state.addFile);

  const handleUpload = (file) => {
    const uploadWithTrip = {
      ...file,
      trip: tripData.destination || "New Trip",
      tripId: null, // will be assigned after trip is created
    };
  
    setPendingUploads(prev => [...prev, uploadWithTrip]);
    addFileToStore(uploadWithTrip);
  
    setSelectedFile(null);
    setPreviewURL('');
    setShowUploadPopUp(false);
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { departureDate, returnDate, isOneWay, budget, destination } = tripData;

    let valid = true;
    setDestinationError('');
    setDateError('');
    setBudgetError('');

    if (!destination) {
      setDestinationError('Destination is required.');
      valid = false;
    }
    
    if (!departureDate && !isOneWay && !returnDate) {
      setDateError('Both departure and return dates are required.');
      valid = false;
    } else if (!departureDate && returnDate) {
      setDateError('Departure date is required.');
      valid = false;
    } else if (departureDate && !isOneWay && !returnDate) {
      setDateError('Return date is required for round trips.');
      valid = false;
    } else if (
      !isOneWay &&
      departureDate &&
      returnDate &&
      new Date(returnDate) < new Date(departureDate)
    ) {
      setDateError('Return date cannot be earlier than departure date.');
      valid = false;
    }
    
    if (!budget) {
      setBudgetError('Budget is required.');
      valid = false;
    } else if (isNaN(parseFloat(budget)) || parseFloat(budget) < 0) {
      setBudgetError('Budget must be a non-negative number.');
      valid = false;
    }

    if (!valid) return;

    console.log('Submitting trip data:', tripData);

    try {
      const newTripId = addTrip(tripData);
      console.log('Created trip with ID:', newTripId);

      pendingUploads.forEach(file => {
        addFileToStore({
          ...file,
          tripId: newTripId,
        });
      });
      
      await router.push(`/trips/${newTripId}`);
    } catch (error) {
      console.error('Error creating trip:', error);
    }
  };

  const isFormValid = () => {
    const { destination, departureDate, returnDate, isOneWay, budget } = tripData;

    if (!destination || !departureDate || (!isOneWay && !returnDate) || !budget) {
      return false;
    }

    if (!isOneWay && new Date(returnDate) < new Date(departureDate)) {
      return false;
    }

    if (isNaN(parseFloat(budget)) || parseFloat(budget) < 0) {
      return false;
    }

    return true;
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
        {destinationError && (
          <p className="text-red-500 text-sm">{destinationError}</p>
        )}

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
          {dateError && (
            <p className="text-red-500 text-sm mt-1">{dateError}</p>
          )}
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
        {budgetError && (
          <p className="text-red-500 text-sm">{budgetError}</p>
        )}

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
            onClick={() => fileInputRef.current.click()}
          />
          </div>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const fileData = {
                  name: file.name,
                  url: URL.createObjectURL(file),
                  trip: tripData.destination || "New Trip",
                  tripId: null,
                };
                setPendingUploads(prev => [...prev, fileData]);
                addFileToStore(fileData);
              }
            }}            
          />
          {pendingUploads.length > 0 && (
            <div className="mt-4">
              <ul className="space-y-2">
                {pendingUploads.map((file, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-pink-50 rounded px-3 py-2"
                  >
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {file.name}
                    </a>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault(); // prevents form submission
                        const confirmed = window.confirm(`Are you sure you want to remove "${file.name}"?`);
                        if (confirmed) {
                          setPendingUploads(pendingUploads.filter((_, i) => i !== index));
                        }
                      }}
                      className="text-red-500 hover:text-red-700 ml-4 text-sm"
                    >
                      ✕ Remove File
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex justify-center pt-6 mt-10">
          <Button
            type="submit"
            title="Create my trip!"
            fontWeight="font-semibold"
            colourClass="pinkStrong"
          />
        </div>
      </form>
    </div>
  );
};

export default CreateTrip;
