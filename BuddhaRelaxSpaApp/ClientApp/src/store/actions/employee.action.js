import axios from "axios";
import { setAlert } from "../actions/alert/alert.action";
import {GetAllEmployees,LoadingState,AddEmployee,EditEmployee,DeleteEmployee} from "./types"

//GetAllEmployees
export const getAllEmployees=(companyId,userId)=>async dispatch=>{
    try{
        
        dispatch({
            type: LoadingState,
            payload: true
          });
          const res = await axios.get(`/api/employee/getallemployee?companyId=${companyId}&userId=${userId}`);
          if(res.data.status!== 200){
              dispatch(setAlert(res.data.message, "error"));
          }else{
              dispatch({
                  type: GetAllEmployees,
                  payload: res.data.model
                });
          }
    }catch(err){
        const errors = err.response.data.errors;
        if (errors) {
          errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
        }
    }
}

//Get Employees By Filter
export const getEmployeeByFilter=(employeeName,phone,UserId)=>async dispatch=>{
    try{
        
        dispatch({
            type: LoadingState,
            payload: true
          });
          const res = await axios.get(`/api/employee/getemployeebyfiler?EmployeeName=${employeeName}&Phone=${phone}&UserId=${UserId}`);
          if(res.data.status!== 200){
              dispatch(setAlert(res.data.message, "error"));
          }else{
              let employees = res.data.model.filter(emp=>emp.employeeId !== UserId);
              dispatch({
                  type: GetAllEmployees,
                  payload: employees
                });
          }
    }catch(err){
        const errors = err.response.data.errors;
        if (errors) {
          errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
        }
    }
}

//Get Employees By Id
export const getEmployeeById=(employeeId)=>async dispatch=>{
    try{
          const res = await axios.get(`/api/employee/getemployeebyid/${employeeId}`);
          if(res.data.status!== 200){
              dispatch(setAlert(res.data.message, "error"));
              return [];
          }else{
              return res.data.model;
          }
    }catch(err){
        const errors = err.response.data.errors;
        dispatch(setAlert("Error", "error"));
        return [];
    }
}



//Create Employee
export const createEmployee =(
    formData
)=> async dispatch =>{
    try{
        const config = {
            headers: {
              "Content-Type": "application/json"
            }
          };
        const res = await axios.post("/api/employee/addemployee", formData, config);
         
        if(res.data.status!== 200){
            dispatch(setAlert(res.data.message, "error"));
            return false;
        }else{
          dispatch({
            type: AddEmployee,
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

//Edit Employee
export const editEmployee =(
    formData
)=> async dispatch =>{
    try{
        const config = {
            headers: {
              "Content-Type": "application/json"
            }
          };
        const res = await axios.put("/api/employee/updateemployee", formData, config);
         
        if(res.data.status!== 200){
            dispatch(setAlert(res.data.message, "error"));
            return false;
        }else{
            dispatch({
                type: EditEmployee,
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

//delete Employee
//GetAllEmployees
export const deleteEmployeeById=(employeeId)=>async dispatch=>{
    try{
          const res = await axios.delete(`/api/employee/deleteemployeebyid/${employeeId}`);
          if(res.data.status!== 200){
              dispatch(setAlert(res.data.message, "error"));
          }else{
            dispatch({
                type: DeleteEmployee,
                payload: employeeId
              });
            dispatch(setAlert(res.data.message, "success"));
          }
    }catch(err){
        const errors = err.response.data.errors;
        dispatch(setAlert("Error", "error"));
    }
}


