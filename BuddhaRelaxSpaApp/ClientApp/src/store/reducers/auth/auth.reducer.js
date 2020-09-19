import {LOGIN_FAIL,LOGIN_SUCCESS,LOG_OUT} from "../../actions/types"

const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: localStorage.getItem("isAuthenticated"),
    loading: false,
    message:null,
    user: JSON.parse(localStorage.getItem('user'))
  };

  export default function(state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case LOGIN_SUCCESS:
        localStorage.setItem("token", payload.token);
        localStorage.setItem("isAuthenticated", payload.isAuthenticated);
        localStorage.setItem('user', JSON.stringify(payload.model));
        return {
          ...state,
          user: payload.model,
          isAuthenticated: payload.isAuthenticated,
          loading: false,
          token:payload.token
        };
      case LOG_OUT:
      case LOGIN_FAIL:
        localStorage.removeItem("token");
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem('user');
        localStorage.clear();
        return {
          ...state,
          token: null,
          isAuthenticated: false,
          loading: false,
          message:payload.message,
          user:null
        };
  
      default:
        return state;
    }
  }