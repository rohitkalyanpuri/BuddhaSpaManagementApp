import React from 'react';
import DataTable from 'react-data-table-component';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TimerComponent from './TimerComponent';
import {
  assignMassageTherapist,
  assignRoomNo,
  markCompleteMassage,
  setStartedMassageTime,
  deleteMassage
} from '../../store/actions/client/client.action';
import { LoadingState,UpdateMassageMinInState } from '../../store/actions/types';
import swal from 'sweetalert';

const TherapyLogs = ({
  client: { therapylogs },
  dashboard: { dashboard },
  assignMassageTherapist,
  markCompleteMassage,
  setStartedMassageTime,
  deleteMassage,
  assignRoomNo,
}) => {
  const AssignMassageTherapist = (logId, elm) => {
    var obj = {
      LogId: logId,
      EmployeeId: elm.target.value,
    };
    assignMassageTherapist(obj);
  };
  const AssignRoomNo = (logId, elm) => {
    var obj = {
      LogId: logId,
      RoomNo: elm.target.value,
    };
    assignRoomNo(obj);
  };
  const MarkCompleteMassage = (logId) => {
    var data = therapylogs.filter((item) => item.logId === logId);
    console.log(data);

    var obj = {
      LogId: logId,
      IsCompleted: true,
    };
    swal({
      title: 'Are you sure?',
      text: 'Are you sure that you want to complete this massage?',
      icon: 'warning',
      dangerMode: true,
    }).then((willComplete) => {
      if (willComplete) {
        markCompleteMassage(obj);
      }
    });
  };
 
  const SetStartedMassageTime=(logId,isStarted,Minutes)=>{
    var obj ={
      LogId: logId,
      IsStarted:isStarted,
      CompletedMassageTime:Minutes
    };
   setStartedMassageTime(obj);

  }
  
  const DeleteMassageLog=(logId)=>{
    
    swal("Reason for deleting this log:", {
      content: "input",
    })
    .then((value) => {
      var obj ={
        LogId: logId,
        IsDeleted:true,
        DeleteReason:value
      };
      deleteMassage(obj);
      // swal(`You typed: ${value}`);
    });
  }


  const columns = [
    {
      name: 'Log#',
      selector: 'logId',
      sortable: true,
    },
    {
      name: 'Client',
      selector: 'clientName',
      sortable: true,
    },
    {
      name: 'Employee',
      //selector: 'employeeName',
      cell: (row) => (
        <select
          onChange={(e) => AssignMassageTherapist(row.logId, e)}
          //  ref={`select-${row.logId}`}
          className='form-control'
          value={row.employeeId}
        >
          <option value='0'>--Select Employee--</option>
          {dashboard.massageTherapist.map((x) => (
            <option key={x.employeeId} value={x.employeeId}>
              {x.employeeName}
            </option>
          ))}
        </select>
      ),
    },
    {
      name: 'Room#',
      cell: (row) => (
        <select
          onChange={(e) => AssignRoomNo(row.logId, e)}
          className='form-control'
          value={row.roomNo}
        >
          <option value='0'>--Select Room--</option>
          <option value='1'>1</option>
          <option value='2'>2</option>
          <option value='3'>3</option>
        </select>
      ),
    },
    {
      name: 'Start Time',
      selector: 'startDatetime',
      sortable: true,
    },
    {
      name: 'End Time',
      selector: 'endDateTime',
      sortable: true,
    },
    {
      name: 'Max MassageTime',
      selector: 'massageTime',
      sortable: true,
    },
    {
      name: 'Massage Time',
      button: true,
      cell: (row) => (
        <TimerComponent
          MassageMinutes={row.massageTime}
          CompletedMassageTime={row.completedMassageTime}
          IsCompleted={row.isCompleted}
          IsStarted={row.isStarted}
          LogId={row.logId}
          SetStartedMassageTime={SetStartedMassageTime}
        />
      ),
      grow: 100,
    },
    {
      name: 'Action',
      button: true,
      cell: (row) => (
        <div>
          <a
            href='#'
            className='btn btn-sm'
            onClick={(e) => MarkCompleteMassage(row.logId)}
            data-toggle='tooltip'
            title='Mark Complete'
          >
            <i className='fa fa-th-list'></i>
          </a>
          <a
            href='#'
            className='btn btn-sm'
            onClick={(e) => DeleteMassageLog(row.logId)}
            data-toggle='tooltip'
            title='Delete'
          >
            <i className='fa fa-trash'></i>
          </a>
        </div>
      ),
    },
  ];
  return (
    <div className='invoiceTable'>
      <DataTable
        // title="Invoices"
        columns={columns}
        theme='solarized'
        pagination
        noHeader
        data={therapylogs}
      />
    </div>
  );
};

TherapyLogs.propTypes = {
  assignMassageTherapist: PropTypes.func.isRequired,
  assignRoomNo: PropTypes.func.isRequired,
  markCompleteMassage: PropTypes.func.isRequired,
  setStartedMassageTime:PropTypes.func.isRequired,
  deleteMassage:PropTypes.func.isRequired,
  client: PropTypes.object.isRequired,
  dashboard: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  client: state.client,
  dashboard: state.dashboard,
});
export default connect(mapStateToProps, {
  assignMassageTherapist,
  assignRoomNo,
  markCompleteMassage,
  setStartedMassageTime,
  deleteMassage
})(TherapyLogs);
