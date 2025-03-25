'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useTripsStore from '@/app/store/tripsStore';
import Button from '@/app/components/Button';
import dayjs from 'dayjs';
import useExpenseStore from '@/app/store/expenseStore';
import ExpenseInfo from '@/app/components/ExpenseInfo';
import styles from "./pieChartStyles.module.css"
import PieChart from '@/app/components/pieChart';

const BudgetPage = () => {
  const params = useParams();
  const router = useRouter();
  const getTripById = useTripsStore(state => state.getTripById);
  const expenses = useExpenseStore(state => state.expenses);
  const getExpenseData = useExpenseStore(state => state.getExpenseData);
  
  // Add state to handle client-side rendering
  const [mounted, setMounted] = useState(false);
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    setMounted(true);
    if (params.id) {
      setTrip(getTripById(params.id));
    }
  }, [params.id, getTripById]);

  // Memoize the pie data calculation
  const pieData = useMemo(() => {
    if (!mounted || !params.id) return [];
    return getExpenseData(params.id);
  }, [getExpenseData, params.id, expenses, mounted]);

  const spent = useMemo(() => {
    if (!mounted || !params.id) return 0;
    return expenses
      .filter(expense => expense.tripId === params.id)
      .reduce((total, expense) => total + parseFloat(expense.amount || 0), 0);
  }, [expenses, params.id, mounted]);

  const budgetLeft = useMemo(() => {
    return trip?.budget ? trip.budget - spent : 0;
  }, [trip, spent]);
  

  // Show loading state while mounting
  if (!mounted) {
    return (
      <div className="max-w-[800px] mx-auto px-6 py-8">
        <div className="bg-white rounded-xl p-6 shadow-md border border-pink-600 text-center">
          <h1 className="text-2xl font-bold text-pink-800 mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  // Show not found state
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
        <div className="flex flex-col items-center mb-8">
          <div className="text-center mb-6">
            {/* Total Budget & Budget Left side-by-side */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">Total Budget</h2>
                <p className="text-3xl font-bold text-pink-600">${trip.budget}</p>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">Budget Left</h2>
                <p className="text-3xl font-bold text-green-400">${budgetLeft.toFixed(2)}</p>
              </div>
            </div>

            {/* Total Spent below */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Total Spent</h2>
              <p className="text-3xl font-bold text-pink-600">${spent.toFixed(2)}</p>
            </div>
          </div>

          {/*pie chart visual*/}
          {pieData.length > 0 ? (
            <div className={styles.pieChartWrapper}>
              <div className={styles.pieChartPie}>
                <PieChart data={pieData} />
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Add an expenses to display</p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h1 className="text-3xl font-bold">Recent Expenses</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {expenses
          .filter(expense => expense.tripId === params.id)
          .map(expense => (
            <ExpenseInfo key={expense.id} expense={expense} />
          ))
        }

        {expenses.filter(expense => expense.tripId === params.id).length === 0 && (
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
