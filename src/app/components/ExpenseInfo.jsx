'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { Menu } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid'; 
import useExpenseStore from '@/app/store/expenseStore';

const ExpenseInfo = ({ expense }) => {
  const deleteExpense = useExpenseStore(state => state.deleteExpense);
  const router = useRouter();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this expense?")) {
      deleteExpense(expense.id);
    }
  };

  const handleEdit = () => {
    router.push(`/trips/${expense.tripId}/budget/${expense.id}/edit`);
  };

  return (
    <div className="relative bg-white shadow-md rounded-xl p-3.5 border border-pink-600 hover:shadow-lg transition-shadow">
      {/* ⋯ Dropdown Menu */}
      <Menu as="div" className="absolute top-2 right-2 z-10">
        <Menu.Button className="text-gray-500 hover:text-pink-600 focus:outline-none mt-1">
          <EllipsisVerticalIcon className="w-5 h-5" />
        </Menu.Button>
        <Menu.Items className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleEdit}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    active ? 'bg-gray-100' : ''
                  }`}
                >
                  Edit
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleDelete}
                  className={`block w-full text-left px-4 py-2 text-sm text-red-600 ${
                    active ? 'bg-red-100' : ''
                  }`}
                >
                  Delete
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Menu>

  
    <div className="flex justify-between items-center">
        <div>
          <p className="text-xl font-semibold">{expense.title}</p>
          <p className="text-sm text-black">{expense.description}</p>
          <p className="text-m text-pink-600 mt-1">{expense.category || 'Uncategorized'}</p>
          <p className="text-sm text-gray-600">
            {dayjs(expense.date).format('MMM D, YYYY')}
          </p>
        </div>

        <div className="text-right">
          <div className="absolute bottom-3 right-4 text-sm text-green-400 font-semibold text-right">
              ${expense.amount}<br />
              {expense.currency}
          </div>
        </div>

      </div>
    </div>
  );
}

export default ExpenseInfo;
