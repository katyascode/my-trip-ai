'use client';

import React, { useState, useEffect } from 'react';
import useTripsStore from '@/app/store/tripsStore';
import useProfileStore from '@/app/store/profileStore';
import InputField from "@/app/components/InputField";
import Button from '@/app/components/Button';
import { FaPlaneUp } from 'react-icons/fa6';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

const Register = () => {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const getProfileById = useProfileStore(state => state.getProfileById);
    const profileId = getProfileById(params.id);
    const addProfile = useProfileStore(state => state.addProfile);
    const interestOptions=['Hiking','Beaches','Shopping','Exploring Food','Museums','Sightseeing','Relaxation/Spas','Adventure Activities']
      const [profileData, setProfileData] = useState({
        username: '',
        budget: '',
        interests: ''
    });
    //if a pre-existing username already exists, just autofill it in form 
    useEffect(()=>{
      const username = searchParams.get('username');
      if (username){
        setProfileData(prev =>({...prev,username}));
      }
    }, [searchParams]);

const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting profile data:', profileData);

    try {
      const newProfileId = addProfile(profileData);
      console.log('Created profile with ID:', profileId);
      await router.push(`/trips/profile`);
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  const isFormValid = () => {
    const valid = profileData.username && profileData.budget && profileData.interests;
    console.log('Form valid:', valid, profileData);
    return valid;
  };


  return (
    <div className="max-w-[800px] mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-pink-800">Register New Profile</h1>
        <button
             className="text-2xl text-pink-600 hover:text-gray-600"
              onClick={() => router.back()}
        >
            ✕
        </button>
      </div>
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="max-w-[600px] mx-auto p-5 bg-white rounded-xl">
            <div className="space-y-2 mt-4">
                <InputField
                    type="text"
                    value={profileData.username}
                    label="Enter your username:"
                    onChange={(e) => {
                        console.log('username change:', e.target.value);
                        setProfileData({...profileData, username: e.target.value});
                     }}
                 placeholder="Create a username"
                />
             </div>
             <div className="space-y-2 mt-4">
                 <label className="block font-medium">What is your general budget?</label>
                      <select
                        value={profileData.budget}
                        onChange={(e) => setProfileData({ ...profileData, budget: e.target.value })}
                        className="w-full border px-3 py-2 rounded-md"
                      >
                        <option value="">Select Budget</option>
                        <option value="$">$ - Budget</option>
                        <option value="$$">$$ - Moderate</option>
                        <option value="$$$">$$$ - Luxury</option>
                      </select>
             </div>
             <div className="space-y-2">
                 <InputField
                    type="text"
                    value={profileData.interests}
                    label="What are your traveling interests?"
                    onChange={(e) => {
                        console.log('interests change:', e.target.value);
                        setProfileData({...profileData, interests: e.target.value});
                    }}
                    placeholder="Enter your interests comma separated"
                 />
             </div>
             <div className="flex justify-center pt-6 mt-10">
                 <Button
                    type="submit"
                    title="Register my profile!"
                     fontWeight="font-semibold"
                     colourClass="pinkStrong"
                     isDisabled={!isFormValid()}
                 />
            </div>
            </div>
        </form>

      </div>
  );
}

export default Register;
