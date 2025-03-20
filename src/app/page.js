'use client';

import React from 'react';
import TripCard from "@/app/components/TripCard";
import Button from "@/app/components/Button";
import {FaCloudSun, FaLocationPin, FaMapLocation, FaMapLocationDot, FaPlaneUp} from "react-icons/fa6";
import useTripsStore from "@/app/store/tripsStore";

function Home() {
  const trips = useTripsStore(state => state.trips);
  const latestTrip = trips[trips.length - 1];

  return (
    <div className="mx-auto px-6 py-8 flex flex-col space-y-8">
      {/* Name & current location */}
      <div className="flex flex-row justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-semibold text-pink-800">Welcome,</h1>
          <h1 className="text-5xl font-semibold text-pink-800">Team 5</h1>
        </div>
        <div className="flex flex-col bg-green-200 text-lg text-green-400 rounded-xl justify-between p-4">
          <div className="flex flex-row gap-2 items-center">
            <FaMapLocationDot/>
            <p className="text-lg font-semibold">YVR</p>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <FaCloudSun/>
            <p className="text-lg">12º C</p>
          </div>
        </div>
      </div>

      {/* Upcoming trips */}
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-medium">Upcoming Trips</h1>
        {latestTrip && <TripCard trip={latestTrip} />}
        {!latestTrip && (
          <p className="text-gray-500 text-center py-4">No upcoming trips. Create your first trip!</p>
        )}
        <div className="flex flex-row justify-center">
          <Button
            title="Create Itinerary"
            icon={<FaPlaneUp/>}
            colourClass="green"
            link="/trips/create"
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
