'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

const ProfileInfo = ({ profile }) => {
  return (
    <div
      className="bg-white shadow-md rounded-xl p-3.5 border border-pink-600 cursor-pointer hover:shadow-lg transition-shadow"
    >
    <div className="flex justify-between items-center">
        <div>
          <p className="text-xl font-semibold">{[profile.username]}</p>
          <p className="text-sm text-pink-600 mt-1">My budget: {profile.budget}</p>
          <p className="text-sm text-pink-600 mt-1">My interests: {profile.interests}</p>
         </div>
    </div>
    </div>
  );
}

export default ProfileInfo;
