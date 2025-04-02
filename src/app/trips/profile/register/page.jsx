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
    const updateProfile = useProfileStore(state => state.updateProfile);
    const addProfile = useProfileStore(state => state.addProfile);
    const profiles = useProfileStore(state => state.profiles);
    const profileId = getProfileById(params.id);
    const defaultInterests=['Hiking','Beaches','Shopping','Exploring Food','Museums','Sightseeing','Relaxation/Spas','Adventure Activities']
    const [interestOptions, setInterestOptions] = useState(defaultInterests);      const [profileData, setProfileData] = useState({
        username: '',
        budget: '',
        interests: []
    });

     //to dynamically allow users to add additional interests
     const [newInterest, setNewInterest] = useState('');
     const [showAddedInterest, setShowAddedInterest] = useState(false);
 
     //check if we're editing or creating a new user profile
    const [isEditMode, setIsEditMode] = useState(false);

    
    //if a pre-existing username already exists, just autofill it in form 
    useEffect(()=>{
      const username = searchParams.get('username');
      if (username){
        setIsEditMode(true);
        //load up the existing profile
        const existingProfile = profiles.find(p => p.username === username);
        if (existingProfile){
          const interestsArray = existingProfile.interests ? existingProfile.interests.split(', ') :[];

          //add interests only if not in list yet
          const updatedInterestOptions = [...interestOptions];
          interestsArray.forEach(interest =>{
            if (!updatedInterestOptions.includes(interest)){
              updatedInterestOptions.push(interest);
            }
          });
          setInterestOptions(updatedInterestOptions);

          setProfileData({
            username: existingProfile.username,
            budget: existingProfile.budget,
            interests: interestsArray
          });
        }
      }
    }, [searchParams, profiles]);
   
    //logic for interacting with interest buttons
    const toggleInterest = (interest) =>{
      setProfileData(prev => {
        const currentInterests = prev.interests;
        const newInterests = currentInterests.includes(interest)
          ? currentInterests.filter(i => i !== interest)
          :[...currentInterests, interest];
        return {...prev, interests:newInterests};
      });
    };

    const handleAddedNewInterest = (e) =>{
      e.preventDefault();
      if (newInterest.trim()){
        const trimmedInterest = newInterest.trim();
        if (!interestOptions.includes(trimmedInterest)){
          setInterestOptions(prev => [...prev, trimmedInterest]);
        }
        setNewInterest('');
        setShowAddedInterest(false);
      }
    };

const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting profile data:', profileData);
      try {
        if (isEditMode){
          const existingProfile = profiles.find(p =>p.username === profileData.username);
          if (existingProfile){
            updateProfile(existingProfile.id, {
              ...profileData,
              interests: profileData.interests.join(', ')
            });
          }
        }
        else{
          addProfile({
            ...profileData,
            interests: profileData.interests.join(', ')
          });
        }
          console.log('Created profile with ID:', profileId);
          await router.push(`/trips/profile`);
      } catch (error) {
          console.error('Error saving profile:', error);
      }
    };

  const isFormValid = () => {
    const valid = profileData.username && profileData.budget && profileData.interests;
    console.log('Form valid:', valid, profileData);
    return valid;
  };


  return (
    <div className="max-w-[800px] mx-auto px-6 py-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-pink-800">
          {isEditMode ? 'Edit Profile' : 'Register New Profile'}
        </h1>
        <button
             className="text-2xl text-pink-600 hover:text-gray-600"
              onClick={() => router.back()}
        >
            ✕
        </button>
      </div>
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="max-w-[600px] mx-auto rounded-xl">
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
                 <label className="block font-medium font-semibold">What is your general budget?</label>
                      <select
                        value={profileData.budget}
                        onChange={(e) => setProfileData({ ...profileData, budget: e.target.value })}
                        className="w-full border px-4 py-3 shadow-md rounded-lg border-pink-600 focus:outline-none focus:border-pink-600 focus:bg-pink-200 transition-all duration-300"
                      >
                        <option value="">Select Budget</option>
                        <option value="$">$ - Budget</option>
                        <option value="$$">$$ - Moderate</option>
                        <option value="$$$">$$$ - Luxury</option>
                      </select>
             </div>
             <div className="space-y-2 mt-4">
                <div className='flex justify-between items-center'>
                <label className='block font-semibold w-3/4'>What are your traveling interests?</label>
                  <button
                    type="button"
                    onClick={()=> setShowAddedInterest(!showAddedInterest)}
                    className='text-sm text-pink-600 hover:text-pink-700 font-medium'
                  >
                    + Add More
                  </button>
                </div>
                {showAddedInterest && (
                  <div className='flex gap-2 mb-4 items-center'>
                    <input
                      type='text'
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      placeholder='Enter another interest'
                      className='flex-1 border border-pink-600 px-4 py-2 rounded-lg shadow-md text-sm'
                    />
                    <button
                      type='button'
                      onClick={handleAddedNewInterest}
                      className='px-3 py-2 bg-pink-600 text-white h-fit rounded-md text-sm hover:bg-pink-700'
                    >
                      Add
                    </button>
                  </div>
                )}
                <div className='grid grid-cols-2 md:grid-cols-4 gap-2 mt-2'>
                  {interestOptions.map((interest)=>(
                    <button 
                      key={interest}
                      type='button'
                      onClick={()=>toggleInterest(interest)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
                        ${profileData.interests.includes(interest)
                          ? 'bg-pink-600 text-white hover:bg-pink-700'
                          : 'bg-pink-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
                </div>
             <div className="flex justify-center pt-6 mt-10">
                 <Button
                    type="submit"
                    title={isEditMode ? "Update Profile!" : "Register my profile!"}
                     fontWeight="font-semibold"
                     colourClass="pinkSolid"
                     isDisabled={!isFormValid()}
                 />
            </div>
            </div>
        </form>

      </div>
  );
}
export default Register;