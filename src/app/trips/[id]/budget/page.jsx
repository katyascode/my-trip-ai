'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import useTripsStore from '@/app/store/tripsStore';
import Button from '@/app/components/Button';
import dayjs from 'dayjs';
import useExpenseStore from '@/app/store/expenseStore';
import ExpenseInfo from '@/app/components/ExpenseInfo';

const BudgetPage = () => {
  const params = useParams();
  const router = useRouter();
  const getTripById = useTripsStore(state => state.getTripById);
  const trip = getTripById(params.id);
  const expenses = useExpenseStore(state => state.expenses);
  // Todo - deuglify this lol
  if (!trip) {
    return (
      <div className="max-w-[800px] mx-auto px-6 py-8">
        <div className="bg-white rounded-xl p-6 shadow-md border border-pink-600 text-center">
          <h1 className="text-2xl font-bold text-pink-800 mb-4">Trip not found</h1>
          <Button
            title="Back to Trips"
            colourClass="green"
            onClick={() => router.push('/trips')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Budget for {trip.destination}</h1>
          <p className="text-gray-600">
            {dayjs(trip.departureDate).format('MMM D')} - {dayjs(trip.returnDate).format('MMM D, YYYY')}
          </p>
        </div>
        <Button
          title="Back to Trip"
          colourClass="green"
          onClick={() => router.back()}
        />
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md border border-pink-600">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Total Budget</h2>
            <p className="text-3xl font-bold text-pink-600">${trip.budget}</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h1 className="text-3xl font-bold">Recent Expenses</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {expenses.map(expense => (
                <ExpenseInfo key={expense.id} expense={expense} />
              ))}
          {expenses.length === 0 && (
                           <p className="text-gray-500 col-span-2 text-center py-8">
                             No recent expenses
                           </p>
                         )}
      </div>
      <div className="flex justify-center mt-40">
        <Button
          title="Add an Expense"
          colourClass="green"
          onClick={() => router.push(`/trips/${params.id}/budget/addExpense`)}
        />
      </div>


    </div>
  );
};

export default BudgetPage;
