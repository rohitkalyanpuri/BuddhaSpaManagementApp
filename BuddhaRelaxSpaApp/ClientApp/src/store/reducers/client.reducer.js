import {
  Get_Clients,
  PlusMinusRowNumber,
  LoadingState,
  ADDINVOICE,
  GETCLIENT,
  GetInvoicesByClient,
  GetTherapyLogs,
  AsignMassageTherapist,
  AssignRoomNo,
  MarkCompleteMassage,
  Setstartedmassagetime,
  Deletemassage
} from '../actions/types';

const initialState = {
  clients: [],
  client: null,
  loading: true,
  rownumber: 0,
  invoices: [],
  therapylogs:[]
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case Get_Clients:
      return {
        ...state,
        clients: payload,
        loading: false,
      };
    case ADDINVOICE:
      return {
        ...state,
        invoices: [payload, ...state.invoices],
      };
    case GETCLIENT:
      return {
        ...state,
        client: payload,
      };
    case PlusMinusRowNumber:
      return {
        ...state,
        loading: true,
        rownumber: payload,
      };
    case GetInvoicesByClient:
      return {
        ...state,
        invoices: payload,
      };
    case GetTherapyLogs:
        return {
            ...state,
            therapylogs:payload
        }
    case AsignMassageTherapist:
      return {
        ...state,
        therapylogs:state.therapylogs.map((log)=>
            log.logId === payload.LogId? {...log, employeeId:payload.EmployeeId} : log
        )
    };
    case AssignRoomNo:
      return {
        ...state,
        therapylogs:state.therapylogs.map((log)=>
            log.logId === payload.LogId? {...log, roomNo:payload.RoomNo} : log
        )
    };
    case AssignRoomNo:
      return {
        ...state,
        therapylogs:state.therapylogs.map((log)=>
            log.logId === payload.LogId? {...log, roomNo:payload.RoomNo} : log
        )
    };
    case MarkCompleteMassage:
      return {
        ...state,
        therapylogs:state.therapylogs.map((log)=>
            log.logId === payload.LogId? {...log, isCompleted:payload.IsCompleted} : log
        )
    };
    
    case Setstartedmassagetime:
      return {
        ...state,
        therapylogs:state.therapylogs.map((log)=>
            log.logId === payload.LogId? {...log, isStarted:payload.IsStarted,completedMassageTime:payload.CompletedMassageTime} : log
        )
    };
    case Deletemassage:
      return {
        ...state,
        therapylogs : state.therapylogs.filter(log => log.logId !== payload)
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
