'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

const ExpenseInfo = ({ expense }) => {
  return (
    <div
      className="bg-white shadow-md rounded-xl p-3.5 border border-pink-600 cursor-pointer hover:shadow-lg transition-shadow"
    >
    <div className="flex justify-between items-center">
        <div>
          <p className="text-xl font-semibold">{expense.title}</p>
          <p className="text-sm text-green-400">
            {dayjs(expense.date).format('MMM D, YYYY')}
          </p>
        </div>
          <div className="text-right">
          <p className="text-sm text-pink-600 mt-1">Amount: ${expense.amount}</p>
          <p className="text-sm text-pink-600 mt-1">{expense.currency}</p>
          </div>
    </div>
    <p>{expense.description}</p>
    </div>
  );
}

export default ExpenseInfo;
