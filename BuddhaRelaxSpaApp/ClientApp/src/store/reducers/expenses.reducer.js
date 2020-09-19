import {
    GetExpenses
    ,LoadingState
    ,AddExpenses
    ,GetExpensesGroupByEmployee
  } from '../actions/types';

  const initialState = {
    expenses: [],
    expensesGroupByEmployee:[],
    loading: true
  };

  export default function (state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case GetExpenses:
        return {
          ...state,
          expenses: payload,
          loading: false,
        };
      case GetExpensesGroupByEmployee:
      return {
        ...state,
        expensesGroupByEmployee: payload,
        loading: false,
      };
      case AddExpenses:
        return {
          ...state,
          expenses: [payload, ...state.expenses],
          loading: false,
        };
      case LoadingState:
        return {
          ...state,
          loading: payload,
        };
      
      default:
        return state;
    }
  }
  