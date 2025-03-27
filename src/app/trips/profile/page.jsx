'use client';

import React from 'react';
import useTripsStore from '@/app/store/tripsStore';
import useProfileStore from '@/app/store/profileStore';
import Button from '@/app/components/Button';
import { FaPlaneUp } from 'react-icons/fa6';
import { useParams, useRouter } from 'next/navigation';
import ProfileInfo from '@/app/components/ProfileInfo';

const Profile = () => {
    const params = useParams();
    const router = useRouter();
    const profiles = useProfileStore(state => state.profiles);
    const deleteProfile = useProfileStore(state => state.deleteProfile); //for testing purposes
    const lastProfile = profiles.length > 0 ? profiles[profiles.length - 1] : null;

    const handleDeleteProfile=()=>{
      if (lastProfile){
        deleteProfile(lastProfile.id);
        router.push('/trips/profile');
      }
    };

  return (
    <div className="max-w-[800px] mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-pink-800">My Profile</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profiles.length === 0 && (
          <>
            <p className="text-gray-500 col-span-2 text-center py-8">
              No profile yet. Register your account!
            </p>
            <div className="flex justify-center mt-40">
              <Button
                title="Register"
                colourClass="green"
                onClick={() => router.push(`/trips/profile/register`)}
              />
            </div>
          </>
        )}
        {lastProfile && (
            <>
            <ProfileInfo key={lastProfile.id} profile={lastProfile} />
            <div className="flex flex-col justify-center items-center gap-4 mt-40">
                <Button
                   title="Edit Profile"
                   colourClass="green"
                   onClick={() => router.push(`/trips/profile/register?username=${lastProfile.username}`)}
                />
                <Button
                  title="Delete profile"
                  colourClass="red"
                  onClick={handleDeleteProfile}
                />
              </div>
            </>
            )}
        </div>
    </div>
  );
}

export default Profile;
