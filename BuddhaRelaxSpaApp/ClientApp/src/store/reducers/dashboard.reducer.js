import {
  GetDashboardDetails,
  LoadingState
} from '../actions/types';

const initialState = {
    dashboard:null,
    loading: true
  };

  export default function(state=initialState,action){
    const{type,payload}=action;

    switch(type){
        case GetDashboardDetails:
            return{
                ...state,
                dashboard:payload
            };
          case LoadingState:
              return{
                  ...state,
                  loading:payload
              };
            default:
              return state;
    }
}