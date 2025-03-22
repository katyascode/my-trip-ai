import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useExpenseStore = create(
  persist(
    (set, get) => ({
      expenses: [],
      addExpense: (expense) => {
        const id = Math.random().toString(36).substr(2, 9);
        set((state) => {
          const updatedExpenses = [...state.expenses, { ...expense, id }];
          return{
            //updated states
            expenses: updatedExpenses,
          };
        });
        return id;
      },

      //getting id method
      getExpenseById: (id) => get().expenses.find(expense => expense.id === id),

      //getting category info 
      getExpenseData: (tripId) => {
        const expenses = get().expenses.filter(expense => expense.tripId === tripId);
        // group expenses by title and sum their amounts
        const categoryTotals = {};
        expenses.forEach(expense => {
          const title = expense.title || 'Uncategorized';
          const amount = parseFloat(expense.amount || 0);
          categoryTotals[title] = (categoryTotals[title] || 0) + amount;
        });

        // convert to pie data format
        const pieData = Object.entries(categoryTotals).map(([label, value]) => ({
          label,
          value
        }));
        
        console.log('Generated pie data:', pieData); // Debug log
        return pieData;
      }
    }),
    {
      name: 'expense-storage',
    }
  )
);

export default useExpenseStore;
