'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import InputField from "@/app/components/InputField";
import Button from "@/app/components/Button";
import {FaUpload} from "react-icons/fa6";
import useExpenseStore from '@/app/store/expenseStore';
import useTripsStore from '@/app/store/tripsStore';

// Todo - Form Validation -> End date cannot be before start date
// Todo - Upload documents mockup
const CreateExpense = () => {
  const router = useRouter();
  const params = useParams();
  const getTripById = useTripsStore(state => state.getTripById);
  const tripId = getTripById(params.id);
  const addExpense = useExpenseStore(state => state.addExpense);
  const [expenseData, setExpenseData] = useState({
    title: '',
    category: '',
    date: '',
    amount: '',
    currency: '',
    tripId: params.id //NOTE changed to this from trip: tripId
  });


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting expense data:', expenseData);

    try {
      const newExpenseId = addExpense(expenseData);
      console.log('Created expense with ID:', newExpenseId);
      await router.push(`/trips/${params.id}/budget`);
    } catch (error) {
      console.error('Error creating expense:', error);
    }
  };

  const isFormValid = () => {
    const valid = expenseData.title &&
           expenseData.date &&
           expenseData.amount &&
           expenseData.currency &&
           expenseData.tripId;
    console.log('Form valid:', valid, expenseData);
    return valid;
  };

  return (
    <div className="max-w-[600px] mx-auto p-5 bg-white rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create a new expense</h1>
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
            value={expenseData.title}
            label="Title:"
            onChange={(e) => {
              console.log('Title change:', e.target.value);
              setExpenseData({...expenseData, title: e.target.value});
            }}
            placeholder="Enter your expense title"
          />
        </div>

        <div className="space-y-2">
            <InputField
               type="text"
               value={expenseData.description}
               label="Description:"
               onChange={(e) => {
                   console.log('Description change:', e.target.value);
                   setExpenseData({...expenseData, description: e.target.value});
               }}
                placeholder="Enter a short description"
            />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-black">Category:</label>
          <div className="relative w-full">
            <select
              value={expenseData.category}
              onChange={(e) => setExpenseData({ ...expenseData, category: e.target.value })}
              className="w-full border border-pink-600 rounded-xl px-4 py-2 pr-10 text-base text-black bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm appearance-none"
            >
              <option value="">Select a category</option>
              <option value="flight">Flight</option>
              <option value="accommodation">Accommodation</option>
              <option value="food">Food</option>
              <option value="activities">Activities</option>
              <option value="transportation">Transportation</option>
              <option value="shopping">Shopping</option>
              <option value="other">Other</option>
            </select>

            {/* Dropdown Icon */}
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          </div>

          <div className="flex flex-row justify-between gap-4">
            <InputField
              type="date"
              label="Date of expense"
              value={expenseData.date}
              onChange={(e) => setExpenseData({...expenseData, date: e.target.value})}
            />
          </div>

        <div className="space-y-2">
          <InputField
            label="Amount:"
            type="number"
            placeholder="$ Amount"
            value={expenseData.amount}
            onChange={(e) => setExpenseData({...expenseData, amount: e.target.value})}
          />
        </div>

        <div className="space-y-2">
            <InputField
               type="text"
               value={expenseData.currency}
               label="Currency:"
               onChange={(e) => {
                   console.log('Currency change:', e.target.value);
                   setExpenseData({...expenseData, currency: e.target.value});
               }}
                    placeholder="Currency "
                  />
        </div>

        <div className="flex justify-center pt-6 mt-10">
          <Button
            type="submit"
            title="Create my expense!"
            fontWeight="font-semibold"
            colourClass="pinkSolid"
            isDisabled={!isFormValid()}
          />
        </div>
      </form>
    </div>
  );
};

export default CreateExpense;
