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
    <div className="max-w-[900px] mx-auto px-8 py-12">
      <div className="mb-8">
        <Button
          title="Back to Trip"
          colourClass="green"
          onClick={() => router.back()}
        />
      </div>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-pink-800 mb-2">Budget for {trip.destination}</h1>
        <p className="text-gray-600 text-lg">
          {dayjs(trip.departureDate).format('MMM D')} - {dayjs(trip.returnDate).format('MMM D, YYYY')}
        </p>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-pink-600">
        <div className="flex flex-col items-center mb-10">
          <div className="text-center mb-8">
            {/* Total Budget & Budget Left side-by-side */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-12 mb-8">
              <div className="bg-pink-50 p-6 rounded-xl">
                <h2 className="text-xl font-semibold text-pink-800 mb-2">Total Budget</h2>
                <p className="text-4xl font-bold text-pink-600">${trip.budget}</p>
              </div>
              <div className="bg-green-50 p-6 rounded-xl">
                <h2 className="text-xl font-semibold text-green-800 mb-2">Budget Left</h2>
                <p className="text-4xl font-bold text-green-400">${budgetLeft.toFixed(2)}</p>
              </div>
            </div>

            {/* Total Spent below */}
            <div className="bg-pink-50 p-6 rounded-xl inline-block">
              <h2 className="text-xl font-semibold text-pink-800 mb-2">Total Spent</h2>
              <p className="text-4xl font-bold text-pink-600">${spent.toFixed(2)}</p>
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
            <p className="text-gray-500 text-center py-8 text-lg">Add an expense to display</p>
          )}
        </div>
      </div>

      <div className="mt-10 flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-pink-800">Recent Expenses</h1>
        <Button
          title="Add Expense"
          colourClass="green"
          onClick={() => router.push(`/trips/${params.id}/budget/addExpense`)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {expenses
          .filter(expense => expense.tripId === params.id)
          .map(expense => (
            <ExpenseInfo key={expense.id} expense={expense} />
          ))
        }

        {expenses.filter(expense => expense.tripId === params.id).length === 0 && (
          <p className="text-gray-500 col-span-2 text-center py-12 text-lg">
            No recent expenses
          </p>
        )}
      </div>
    </div>
  );
};

export default BudgetPage;
