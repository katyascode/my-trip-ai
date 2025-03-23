import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useExpenseStore = create(
  persist(
    (set, get) => ({
      expenses: [],
      addExpense: (expense) => {
        const id = Math.random().toString(36).substr(2, 9);
        set((state) => ({
          expenses: [...state.expenses, { ...expense, id }]
        }));
        return id;
      },
      getExpenseById: (id) => get().expenses.find(expense => expense.id === id),
    }),
    {
      name: 'expense-storage',
    }
  )
);

export default useExpenseStore;
