import {combineReducers} from "redux";
import auth from "./auth/auth.reducer";
import alert from "./alert/alert.reducer";
import client from "./client.reducer";
import employee from "./employee.reducer";
import dashboard from "./dashboard.reducer";
import expenses from "./expenses.reducer";
import {reducer as toastrReducer} from 'react-redux-toastr'

export default combineReducers({
    auth,
    alert,
    client,
    dashboard,
    employee,
    expenses,
    toastr: toastrReducer 
})