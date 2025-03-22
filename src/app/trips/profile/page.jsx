'use client';

import React from 'react';
import useTripsStore from '@/app/store/tripsStore';
import useProfileStore from '@/app/store/profileStore';
import Button from '@/app/components/Button';
import { FaPlaneUp } from 'react-icons/fa6';

const Profile = () => {
  const profiles = useProfileStore(state => state.profile);

  return (
    <div className="max-w-[800px] mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-pink-800">My Profile</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profiles.length === 0 && (
          <p className="text-gray-500 col-span-2 text-center py-8">
            No profile yet. Create your account!
          </p>
        )}
      </div>
    </div>
  );
}

export default Profile;
