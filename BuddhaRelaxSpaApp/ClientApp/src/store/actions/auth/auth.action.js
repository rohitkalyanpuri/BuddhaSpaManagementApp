import axios from "axios";
import {LOGIN_FAIL,LOGIN_SUCCESS,LOG_OUT} from "../types"
import setAuthToken from "../../../utils/setAuthToken";
import { setAlert } from "../alert/alert.action";

//Login User
export const login = (email, password) => async dispatch => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
  
    const body = JSON.stringify({ email, password });
  
    try {
      const res = await axios.post("/api/auth/login", body, config);
      console.log(res);
      if(!res.data.isAuthenticated){
        dispatch({
          type: LOGIN_FAIL,
          payload: res.data
        });
        dispatch(setAlert(res.data.message, "error"));

      }else{
        dispatch({
          type: LOGIN_SUCCESS,
          payload: res.data
        });
        if (localStorage.token) {
          setAuthToken(localStorage.token);
        }
      }
      
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
      }
      dispatch({
        type: LOGIN_FAIL
      });
    }
  };

//Logout Clear profile
export const logout = () => dispatch => {
  dispatch({ type: LOG_OUT });
};
