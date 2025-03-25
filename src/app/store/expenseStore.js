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

      //delete an expense
      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
        }));
      },

      //update an expense
      updateExpense: (id, updatedData) => {
        set((state) => ({
          expenses: state.expenses.map(expense =>
            expense.id === id ? { ...expense, ...updatedData } : expense
          ),
        }));
      },

      //getting id method
      getExpenseById: (id) => get().expenses.find(expense => expense.id === id),

      //getting category info for pie chart
      getExpenseData: (tripId) => {
        const expenses = get().expenses.filter(expense => expense.tripId === tripId);
        // group expenses by category and sum their amounts
        const categoryTotals = {};
        expenses.forEach(expense => {
          const category = expense.category || 'Uncategorized';
          const amount = parseFloat(expense.amount || 0);
          categoryTotals[category] = (categoryTotals[category] || 0) + amount;
        });

        // convert to pie data format
        const pieData = Object.entries(categoryTotals).map(([label, value]) => ({
          label,
          value
        }));
        
        console.log('Generated pie data:', pieData); // debug
        return pieData;
      }
    }),
    {
      name: 'expense-storage',
    }
  )
);

export default useExpenseStore;
