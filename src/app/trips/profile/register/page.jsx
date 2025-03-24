'use client';

import React from 'react';
import useTripsStore from '@/app/store/tripsStore';
import useProfileStore from '@/app/store/profileStore';
import Button from '@/app/components/Button';
import { FaPlaneUp } from 'react-icons/fa6';
import { useParams, useRouter } from 'next/navigation';

const Register = () => {
    const router = useRouter();

  return (
    <div className="max-w-[800px] mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-pink-800">Register New Profile</h1>
        <button
             className="text-2xl text-pink-600 hover:text-gray-600"
              onClick={() => router.back()}
        >
            ✕
        </button>
      </div>

    </div>
  );
}

export default Register;
