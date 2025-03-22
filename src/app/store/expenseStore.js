import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useExpenseStore = create(
  persist(
    (set, get) => ({
      expenses: [],
      //to collect expense type categories
      expenseTypes: {},
      addExpense: (expense) => {
        const id = Math.random().toString(36).substr(2, 9);
        set((state) => {
          const updatedExpenses = [...state.expenses, { ...expense, id }];

          //update expenseTypes obj based on type
          const updatedExpenseTypes = { ...state.expenseTypes };
          console.log(updatedExpenseTypes[expense.title]);

          if (!updatedExpenseTypes[expense.title]) {
            updatedExpenseTypes[expense.title] = [];
          }
          updatedExpenseTypes[expense.title].push({ ...expense, id });

          return{
            //updated states
            expenses: updatedExpenses,
            expenseTypes: updatedExpenseTypes,
          };
        });
        return id;
      },

      //getting id method
      getExpenseById: (id) => get().expenses.find(expense => expense.id === id),

      //getting category info dynamically
      getExpenseData: ()=>{
        const expenseTypes = get().expenseTypes;
        const pieData = Object.keys(expenseTypes).map(type=>{
          const totalValue = expenseTypes[type.title].reduce((sum, expense) => sum + Number(expense.amount), 0);
          // const categoryName = expenseTypes[type];
          return {
            label: type.title, 
            value: totalValue, 
          };
        });
        return pieData;
      }
    }),
    {
      name: 'expense-storage',
    }
  )
);

export default useExpenseStore;
