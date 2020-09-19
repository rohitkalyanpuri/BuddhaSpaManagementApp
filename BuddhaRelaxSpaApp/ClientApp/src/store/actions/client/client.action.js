import axios from "axios";
import { setAlert } from "../alert/alert.action";
import {Get_Clients
  ,PlusMinusRowNumber
  ,LoadingState
  ,ADDINVOICE
  ,GETCLIENT
  ,GetInvoicesByClient
  ,GetDashboardDetails
  ,GetTherapyLogs
  ,AsignMassageTherapist
  ,AssignRoomNo
  ,MarkCompleteMassage
  ,Setstartedmassagetime
  ,Deletemassage
} from "../types"

//Create Client
export const createClient =(
    formData,
    history
)=> async dispatch =>{
    try{
        const config = {
            headers: {
              "Content-Type": "application/json"
            }
          };
        const res = await axios.post("/api/client/createclient", formData, config);
         
        if(res.data.status!= 200){
            dispatch(setAlert(res.data.message, "error"));
        }else{
          dispatch({
            type: Get_Clients,
            payload: res.data.model
          });
          dispatch(setAlert(res.data.message, "success"));
          history.push("/clients");
        }
    }catch(err){
        const errors = err.response.data.errors;
        if (errors) {
          errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
        }
    }
}

//Get Client
export const getClients=(RowNumber)=>async dispatch=>{
    try{
        dispatch({
            type: PlusMinusRowNumber,
            payload: RowNumber
        });
        const res = await axios.get(`/api/client/getclients/${RowNumber}`);
        if(res.data.status!= 200){
            dispatch(setAlert(res.data.message, "error"));
        }else{
            dispatch({
                type: Get_Clients,
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

//Get Filter Clients 
export const getClientsByFilter=(ClientName,Phone)=>async dispatch=>{
  try{
      dispatch({
        type: LoadingState,
        payload: true
      });
      const res = await axios.get(`/api/client/getclientbyfiler?ClientName=${ClientName}&Phone=${Phone}`);
      if(res.data.status!= 200){
          dispatch(setAlert(res.data.message, "error"));
      }else{
          dispatch({
              type: Get_Clients,
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


//Get Client By Id
export const getClientById=(clientid)=>async dispatch=>{
    try{
        dispatch({
            type: LoadingState,
            payload: true
          });
        const res = await axios.get(`/api/client/getclientbyid/${clientid}`);
        if(res.data.status!= 200){
            dispatch(setAlert(res.data.message, "error"));
            dispatch({
                type: LoadingState,
                payload: false
              });
              return null;
        }else{
          dispatch({
            type: GETCLIENT,
            payload: res.data.model
          });
            dispatch({
                type: LoadingState,
                payload: false
              });
            return res.data.model;
        }
    }catch(err){
        const errors = err.response.data.errors;
        if (errors) {
          errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
        }
        return null;
    }
}

//Update Client
export const updateClient =(
    formData,
    history
)=> async dispatch =>{
    try{
        const config = {
            headers: {
              "Content-Type": "application/json"
            }
          };
        const res = await axios.put("/api/client/updateclient", formData, config);
         
        if(res.data.status!= 200){
            dispatch(setAlert(res.data.message, "error"));
        }else{
          dispatch({
            type: Get_Clients,
            payload: res.data.model
          });
            dispatch(setAlert(res.data.message, "success"));
            history.push("/clients");
        }
        
    }catch(err){
        dispatch(setAlert("System Error!", "error"));
    }
}


//Delete Client
export const deleteClientById=(clientid,history)=>async dispatch=>{
    try{
        const res = await axios.delete(`/api/client/deleteclientbyid/${clientid}`);
        if(res.data.status!= 200){
            dispatch(setAlert(res.data.message, "error"));
        }else{
          dispatch(setAlert(res.data.message, "success"));
            history.push("/clients");
        }

    }catch(err){
        const errors = err.response.data.errors;
        if (errors) {
          errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
        }
    }
}

//Create Client Invoice
export const createInvoice=(formData)=>async dispatch=>{
  try{
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    const res = await axios.post("/api/client/createinvoice", formData, config);
         
        if(res.data.status!= 200){
            
            dispatch(setAlert(res.data.message, "error"));
            return false;
        }else{
          dispatch({
            type: ADDINVOICE,
            payload: res.data.model
          });
            dispatch(setAlert(res.data.message, "success"));
            return true;
        }
  }catch(err){
    dispatch(setAlert("System Error!", "error"));
    return false;
  }
}


//Create Client Invoice
export const createInvoiceFromQRUrl=(formData,history)=>async dispatch=>{
  try{
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    const res = await axios.post("/api/client/createinvoice", formData, config);
         
        if(res.data.status!= 200){
            dispatch(setAlert(res.data.message, "error"));
        }else{
            dispatch(setAlert(res.data.message, "success"));
            history.push(`/scanqrcode/${formData.MemberShipNo}`);
            
        }
  }catch(err){
    dispatch(setAlert("System Error!", "error"));
    
  }
}

//Get Invoices By ClientId
export const getInvoicesByClientId=(clientid)=>async dispatch=>{
  try{
      dispatch({
          type: LoadingState,
          payload: true
        });
      const res = await axios.get(`/api/client/getinvoicesbyclientid/${clientid}`);
      if(res.data.status!= 200){
          dispatch(setAlert(res.data.message, "error"));
          dispatch({
              type: LoadingState,
              payload: false
            });
            return null;
      }else{
        dispatch({
          type: GetInvoicesByClient,
          payload: res.data.model
        });
          dispatch({
              type: LoadingState,
              payload: false
            });
          return res.data.model;
      }
  }catch(err){
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
      }
      return null;
  }
}

//Create Client Invoice
export const scanQRCode=(clientid)=>async dispatch=>{
  try{
    const res = await axios.get(`/api/client/scanqrcode/${clientid}`);
    if(res.data.status!= 200){
            dispatch(setAlert(res.data.message, "error"));
            return false;
    }
    return res.data.model;
  }catch(err){
    return false;
  }
}

//Get DashBoard Details
//Get Client By Id
export const getDashboardDetails=(userId)=>async dispatch=>{
  try{
      dispatch({
          type: LoadingState,
          payload: true
        });
      const res = await axios.get(`/api/dashboard/getdashboard/${userId}`);
      if(res.data.status!= 200){
          dispatch(setAlert(res.data.message, "error"));
          dispatch({
              type: LoadingState,
              payload: false
            });
      }else{
        dispatch({
          type: GetDashboardDetails,
          payload: res.data.model
        });
        dispatch({
          type: GetTherapyLogs,
          payload: res.data.model.therapyLogs
        });
        // dispatch({
        //   type: GetInvoicesByClient,
        //   payload: res.data.model.clientInvoices
        // });
        dispatch({
            type: LoadingState,
             payload: false
        });
      }
  }catch(err){
    dispatch(setAlert("Error", "error"));
  }
}

//Get TherapyLogs
//Get Client
export const getTherapyLogs=(fromDate,toDate)=>async dispatch=>{
  try{
        dispatch({
          type: LoadingState,
          payload: true
        });
      const res = await axios.get(`/api/client/gettherapylogs?fromDate=${fromDate}&toDate=${toDate}`);
      if(res.data.status!= 200){
          dispatch(setAlert(res.data.message, "error"));
      }else{
          dispatch({
              type: GetTherapyLogs,
              payload: res.data.model
            });
      }

  }catch(err){
      const errors = err.response.data.errors;
      dispatch(setAlert("Error", "error"));
  }

  dispatch({
    type: LoadingState,
     payload: false
  });
}

//Assign Massage Therapist
export const assignMassageTherapist=(formData)=>async dispatch=>{
  try{
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    const res = await axios.put("/api/client/assignmassagetherapist", formData, config);
        if(res.data.status!= 200){
            dispatch(setAlert(res.data.message, "error"));
            
        }else{
          dispatch({
            type: AsignMassageTherapist,
             payload: formData
          });
            dispatch(setAlert(res.data.message, "success"));
        }
  }catch(err){
    dispatch(setAlert("System Error!", "error"));
    
  }
}

//Assign Room No
export const assignRoomNo=(formData)=>async dispatch=>{
  try{
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    const res = await axios.put("/api/client/assignroomno", formData, config);
        if(res.data.status!= 200){
         
            dispatch(setAlert(res.data.message, "error"));
            
        }else{
          dispatch({
            type: AssignRoomNo,
             payload: formData
          });
            dispatch(setAlert(res.data.message, "success"));
        }
  }catch(err){
    dispatch(setAlert("System Error!", "error"));
    
  }
}

export const markCompleteMassage=(formData)=>async dispatch=>{
  
  try{
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    const res = await axios.put("/api/client/completemassagesession", formData, config);
        if(res.data.status!= 200){
            dispatch(setAlert(res.data.message, "error"));
        }else{
          dispatch({
            type: MarkCompleteMassage,
             payload: formData
          });
            dispatch(setAlert(res.data.message, "success"));
        }
  }catch(err){
    dispatch(setAlert("System Error!", "error"));
    
  }
}

export const setStartedMassageTime=(formData)=>async dispatch=>{
  
  try{
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    const res = await axios.put("/api/client/setstartedmassagetime", formData, config);
        if(res.data.status!= 200){
            dispatch(setAlert(res.data.message, "error"));
        }else{
          dispatch({
            type: Setstartedmassagetime,
             payload: formData
          });
          
        }
  }catch(err){
    dispatch(setAlert("System Error!", "error"));
    
  }
}

export const deleteMassage=(formData)=>async dispatch=>{
  
  try{
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    const res = await axios.put("/api/client/deletemassage", formData, config);
        if(res.data.status!= 200){
            dispatch(setAlert(res.data.message, "error"));
        }else{
          dispatch({
            type: Deletemassage,
             payload: formData.LogId
          });
          
        }
  }catch(err){
    dispatch(setAlert("System Error!", "error"));
    
  }
}