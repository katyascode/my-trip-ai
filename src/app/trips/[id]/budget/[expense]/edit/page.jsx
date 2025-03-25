'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import InputField from "@/app/components/InputField";
import Button from "@/app/components/Button";
import useExpenseStore from '@/app/store/expenseStore';

const EditExpense = () => {
  const router = useRouter();
  const params = useParams();
  const getExpenseById = useExpenseStore(state => state.getExpenseById);
  const updateExpense = useExpenseStore(state => state.updateExpense);

  const expense = getExpenseById(params.expense);
  const [expenseData, setExpenseData] = useState({
    title: '',
    category: '',
    date: '',
    amount: '',
    currency: '',
    tripId: params.id
  });

  useEffect(() => {
    if (expense) {
      setExpenseData({
        title: expense.title || '',
        category: expense.category || '',
        date: expense.date || '',
        amount: expense.amount || '',
        currency: expense.currency || '',
        tripId: expense.tripId || params.id
      });
    }
  }, [expense, params.id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateExpense(params.expense, expenseData);
    router.push(`/trips/${params.id}/budget`);
  };

  const isFormValid = () => {
    return (
      expenseData.title &&
      expenseData.date &&
      expenseData.amount &&
      expenseData.currency &&
      expenseData.tripId
    );
  };

  if (!expense) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl text-gray-600">Expense not found.</h2>
        <Button
          title="Back to Budget"
          colourClass="green"
          onClick={() => router.push(`/trips/${params.id}/budget`)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-[600px] mx-auto p-5 bg-white rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit expense</h1>
        <button
          className="text-2xl text-pink-600 hover:text-gray-600"
          onClick={() => router.back()}
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <InputField
          type="text"
          value={expenseData.title}
          label="Title:"
          onChange={(e) => setExpenseData({ ...expenseData, title: e.target.value })}
          placeholder="Enter your expense title"
        />

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

        <InputField
          type="date"
          label="Date of expense"
          value={expenseData.date}
          onChange={(e) => setExpenseData({ ...expenseData, date: e.target.value })}
        />

        <InputField
          label="Amount:"
          type="number"
          placeholder="$ Amount"
          value={expenseData.amount}
          onChange={(e) => setExpenseData({ ...expenseData, amount: e.target.value })}
        />

        <InputField
          type="text"
          value={expenseData.currency}
          label="Currency:"
          onChange={(e) => setExpenseData({ ...expenseData, currency: e.target.value })}
          placeholder="Currency"
        />

        <div className="flex justify-center pt-6 mt-10">
          <Button
            type="submit"
            title="Save Changes"
            fontWeight="font-semibold"
            colourClass="green"
            isDisabled={!isFormValid()}
          />
        </div>
      </form>
    </div>
  );
};

export default EditExpense;