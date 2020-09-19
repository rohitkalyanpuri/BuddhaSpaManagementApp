import {
  GetAllEmployees,
  LoadingState,
  AddEmployee,
  EditEmployee,
  DeleteEmployee
} from '../actions/types';

const initialState = {
  employees: [],
  employee: null,
  loading: true,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GetAllEmployees:
      return {
        ...state,
        employees: payload,
        loading: false,
      };
    case AddEmployee:
      return {
        ...state,
        employees: [payload, ...state.employees],
        loading: false,
      };
    case LoadingState:
      return {
        ...state,
        loading: payload,
      };
    case EditEmployee:
        return {
            ...state,
            employees:state.employees.map(emp=>
                emp.employeeId === payload.employeeId? payload : emp
            )
        };
    case DeleteEmployee:
        return {
            ...state,
             employees : state.employees.filter(emp => emp.employeeId !== payload)
        }
    default:
      return state;
  }
}
