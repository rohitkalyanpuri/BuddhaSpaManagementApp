import axios from "axios";
import { setAlert } from "../actions/alert/alert.action";
import {GetExpenses,LoadingState,AddExpenses,GetExpensesGroupByEmployee} from "./types";


//GetAllExpenses
export const getExpenses=(companyId,userId,lastDays,branchId)=>async dispatch=>{
    try{
        
        dispatch({
            type: LoadingState,
            payload: true
          });
          const res = await axios.get(`/api/employee/getexpenses?companyId=${companyId}&userId=${userId}&branchId=${branchId}&lastdays=${lastDays}`);
          if(res.data.status!== 200){
              dispatch(setAlert(res.data.message, "error"));
          }else{
              dispatch({
                  type: GetExpenses,
                  payload: res.data.model
                });
          }
    }catch(err){
        dispatch(setAlert("Error", "danger"))
    }
}

//Create Expenses
export const createExpenses =(
    formData
)=> async dispatch =>{
    try{
        const config = {
            headers: {
              "Content-Type": "application/json"
            }
          };
        const res = await axios.post("/api/employee/addexpenses", formData, config);
         
        if(res.data.status!== 200){
            dispatch(setAlert(res.data.message, "error"));
            return false;
        }else{
          dispatch({
            type: AddExpenses,
            payload: res.data.model
          });
          dispatch(setAlert(res.data.message, "success"));
          return true;
        }
    }catch(err){
        dispatch(setAlert("Error While Processing.", "error"));
        return false;
    }
}

//GetAllExpenses
export const getExpensesGroupByEmployee=(companyId,branchId)=>async dispatch=>{
    try{
        
        dispatch({
            type: LoadingState,
            payload: true
          });
          const res = await axios.get(`/api/employee/getexpensesgroupbyemployee?companyId=${companyId}&branchId=${branchId}`);
          if(res.data.status!== 200){
              dispatch(setAlert(res.data.message, "error"));
          }else{
              dispatch({
                  type: GetExpensesGroupByEmployee,
                  payload: res.data.model
                });
          }
    }catch(err){
        dispatch(setAlert("Error", "danger"))
    }
}