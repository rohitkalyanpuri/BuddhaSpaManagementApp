import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../navbar/Spinner';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getAllEmployees,
  createEmployee,
  getEmployeeById,
  deleteEmployeeById,
  getEmployeeByFilter,
  editEmployee
} from '../../store/actions/employee.action';
import DataTable from 'react-data-table-component';
import { DeleteEmployee } from '../../store/actions/types';


const customStyles = {
  rows: {
    style: {
      minHeight: '72px', // override the row height
      minWidth:'100px'
    }
  },
  // headCells: {
  //   style: {
  //     paddingLeft: '8px', // override the cell padding for head cells
  //     paddingRight: '8px',
  //   },
  // },
  cells: {
    style: {
      paddingLeft: '8px', // override the cell padding for data cells
      paddingRight: '8px',
    },
  },
};



const Employees = ({
  getAllEmployees,
  createEmployee,
  getEmployeeById,
  deleteEmployeeById,
  getEmployeeByFilter,
  editEmployee,
  employee: { loading,employees },
  user: { userId, companyId, branchId },
}) => {
  useEffect(() => {
    getAllEmployees(companyId, userId);
  }, [getAllEmployees]);
 
  const [formData, setFormData] = useState({
    EmployeeId: 0,
    RoleId: 0,
    FirstName: '',
    LastName: '',
    Gender: '',
    MobileNumber: '',
    Address: '',
    UserName:'',
    Password:'',
    EmployeeName:'',
    Phone:'',
    CompanyId: companyId,
    BranchId: branchId,
  });
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const [editButton, setEditButton] = useState(false);
  const [isDisable, setDisable] = useState(false);
  const [isLabelHidden, setLabelHidden] = useState(true);
  const [modelTitle, setModelTit] = useState('Add Employee');

  const GetFilterResult= (e)=>{
    getEmployeeByFilter(formData.EmployeeName,formData.Phone,userId)
  }

  const AddEmployee = (e) => {
    e.preventDefault();
    setLabelHidden(false);
    setDisable(true);
    createEmployee(formData).then((res) => {
      setLabelHidden(true);
      setDisable(false);
      if(res){
      setFormData({
        EmployeeId: 0,
        RoleId: 0,
        FirstName: '',
        LastName: '',
        Gender: '',
        MobileNumber: '',
        Address: '',
        UserName:'',
        Password:'',
        CompanyId: companyId,
        BranchId: branchId,
      });
        var close = document.getElementById('closemodel');
        close.click();
      }
      
    });
  };

  const EditEmployee = (e) => {
    
    e.preventDefault();
    setLabelHidden(false);
    setDisable(true);
    editEmployee(formData).then((res)=>{
      setLabelHidden(true);
      setDisable(false);

      if(res){
      setFormData({
        EmployeeId: 0,
        RoleId: 0,
        FirstName: '',
        LastName: '',
        Gender: '',
        MobileNumber: '',
        Address: '',
        UserName:'',
        Password:'',
        CompanyId: companyId,
        BranchId: branchId,
      });
        var close = document.getElementById('closemodel');
        close.click();
      }
    });
  };
  const GetEmployeeDetails = (employeeId) => {
    setEditButton(true);
    setLabelHidden(false);
    setDisable(true);

    var open = document.getElementById('CreateEmployee');
    open.click();

    getEmployeeById(employeeId).then((resObject) => {
      setLabelHidden(true);
      setDisable(false);
      setFormData({
        EmployeeId: employeeId,
        RoleId: resObject.roleId,
        FirstName: resObject.firstName,
        LastName: resObject.lastName,
        Gender: resObject.gender,
        MobileNumber: resObject.mobileNumber,
        Address: resObject.address,
        UserName:resObject.userName,
        Password:resObject.password,
        CompanyId: companyId,
        BranchId: branchId,
      });
      
    });
  };

  const DeleteEmployee = (EmployeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
       deleteEmployeeById(EmployeeId);
    } 
  };
  const columns = [
    {
      name: 'EmployeeId',
      selector: 'employeeId',
      sortable: true,
    },
    {
      name: 'Name',
      cell: row=> <text>{row.firstName + ' '+row.lastName}</text>,
      sortable: true,
    },
    
    {
      name: 'Branch',
      selector: 'branchName',
      sortable: true,
    },
    
    {
      name: 'Role Name',
      selector: 'roleName',
      sortable: true,
    },
    {
      name: 'Mobile#',
      selector: 'mobileNumber',
      sortable: true
    },
    {
      name: 'IsActive',
      cell: row=> <text>{row.isActive ===true ? 'Active':'InActive'}</text>,
      sortable: true
    },
    {
      name: 'Action',
      button: true,
      cell: row => <div>
                      <a href="#" className="btn btn-sm" onClick={(e) => GetEmployeeDetails(row.employeeId)} data-toggle="tooltip" title="Edit">
                             <i className="fa fa-edit" ></i>
                      </a>
                      <a href="#" className="btn btn-sm" onClick={(e) => DeleteEmployee(row.employeeId)} data-toggle="tooltip" title="Delete">
                        <i className="fa fa-trash" ></i>
                      </a>
                    </div>,
    },
    ];

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <div className='wrapper'>
          {/* Content Wrapper. Contains page content */}
          <div className='content-wrapper'>
            {/* Content Header (Page header) */}
            <section className='content-header'>
              <div className='container-fluid'>
                <div className='row mb-2'>
                  <div className='col-sm-4'>
                    <h1>Employees</h1>
                  </div>
                  <div className='row col-sm-8'>
                    <div className='col-3'>
                      <input
                        type='text'
                        className='form-control'
                        placeholder='Employee Name'
                        name='EmployeeName'
                        value={formData.EmployeeName}
                        onChange={(e) => onChange(e)}
                      />
                    </div>
                    <div className='col-3'>
                      <input
                        type='text'
                        className='form-control'
                        placeholder='Phone Number'
                        name='Phone'
                        value={formData.Phone}
                        onChange={(e) => onChange(e)}
                      />
                    </div>
                    <div className='col-3'>
                      <button type='submit' className='btn btn-navbar' onClick={(e) => GetFilterResult(e)}>
                          Search
                        </button>
                    </div>
                    <div className='col-3'>
                      <Link
                        to='/create-employee'
                        className='btn btn-navbar'
                        data-backdrop='static'
                        id='CreateEmployee'
                        data-toggle='modal'
                        data-target='#modal-lg'
                        
                      >
                        Create Employee
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              {/* /.container-fluid */}
            </section>
            {/* Main content */}
            <section className='content'>
              {/* Default box */}
              <div className='card card-solid'>
                <div className='card-body pb-0'>
                  <div className='row d-flex align-items-stretch'>
                    <div className='invoiceTable'>
                      <DataTable
                        // title="Invoices"
                        columns={columns}
                        theme='solarized'
                        pagination
                        noHeader
                        data={employees}
                        //onSelectedRowsChange={GetEmployeeDetails}
                        //selectableRows
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <div className='modal fade' id='modal-lg' style={{ width: '100%' }}>
              <div className='modal-dialog modal-lg'>
                <div className='modal-content'>
                  <div className='modal-header'>
                    <h4 className='modal-title'>{modelTitle}</h4>
                    <button
                      type='button'
                      className='close'
                      data-dismiss='modal'
                      aria-label='Close'
                    >
                      {/* <span aria-hidden='true'>×</span> */}
                    </button>
                  </div>
                  <div className='modal-body'>
                    <form role='form'>
                      <div className='form-group'>
                        <div className='row col-md-12'>
                          <div className='col-md-4'>
                            <label htmlFor='ClientName' className='required'>
                              First Name
                            </label>
                            <input
                              type='text'
                              className='form-control'
                              id='FirstName'
                              placeholder='Enter First Name'
                              name='FirstName'
                              value={formData.FirstName}
                              onChange={(e) => onChange(e)}
                            />
                          </div>
                          <div className='col-md-4'>
                            <label htmlFor='MemberName'>Last Name</label>
                            <input
                              type='text'
                              className='form-control'
                              id='LastName'
                              placeholder='Enter Last Name'
                              name='LastName'
                              value={formData.LastName}
                              onChange={(e) => onChange(e)}
                            />
                          </div>
                          <div className='col-md-4'>
                            <label htmlFor='Gender' className='required'>
                              Gender
                            </label>
                            <select
                              className='form-control'
                              style={{ width: '100%' }}
                              name='Gender'
                              value={formData.Gender}
                              onChange={(e) => onChange(e)}
                            >
                              <option value=''>--Select--</option>
                              <option value='Male'>Male</option>
                              <option value='Female'>Female</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className='form-group'>
                        <div className='row col-md-12'>
                          <div className='col-md-4'>
                            <label htmlFor='MobileNumber' className='required'>
                              Mobile No.
                            </label>
                            <input
                              type='text'
                              className='form-control'
                              id='MobileNumber'
                              placeholder='Enter Phone No.'
                              pattern='[7-9]{1}[0-9]{9}'
                              title='Phone number with 7-9 and remaing 9 digit with 0-9'
                              name='MobileNumber'
                              value={formData.MobileNumber}
                              onChange={(e) => onChange(e)}
                            />
                          </div>
                          <div className='col-md-4'>
                            <label htmlFor='Address'>Address</label>
                            <input
                              type='text'
                              className='form-control'
                              id='Address'
                              placeholder='Enter Address'
                              name='Address'
                              value={formData.Address}
                              onChange={(e) => onChange(e)}
                            />
                          </div>
                          <div className='col-md-4'>
                            <label htmlFor='Gender' className='required'>
                              Role
                            </label>
                            <select
                              className='form-control'
                              style={{ width: '100%' }}
                              name='RoleId'
                              value={formData.RoleId}
                              onChange={(e) => onChange(e)}
                            >
                              <option value='0'>--Select--</option>
                              <option value='1'>Admin</option>
                              <option value='2'>Manager</option>
                              <option value='3'>Employee</option>
                              <option value='4'>Spa Therapist </option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className='form-group'>
                        <div className='row col-md-12'>
                          <div className='col-md-4'>
                            <label htmlFor='UserName' className='required'>
                              User Name
                            </label>
                            <input
                              type='text'
                              className='form-control'
                              id='UserName'
                              placeholder='User Name'
                              name='UserName'
                              value={formData.UserName}
                              onChange={(e) => onChange(e)}
                            />
                          </div>
                          <div className='col-md-4'>
                            <label htmlFor='Password' className='required'>Password</label>
                            <input
                              type='text'
                              className='form-control'
                              id='Password'
                              placeholder='Enter Password'
                              name='Password'
                              value={formData.Password}
                              onChange={(e) => onChange(e)}
                            />
                          </div>
                         
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className='modal-footer justify-content-between'>
                    <button
                      type='button'
                      className='btn btn-default'
                      data-dismiss='modal'
                      id='closemodel'
                      disabled={isDisable}
                      onClick={(e) =>setEditButton(false)}
                    >
                      Close
                    </button>
                    {!isLabelHidden ? (
                      <label
                        style={{
                          color: 'red',
                        }}
                      >
                        Processing... Please do not Refresh/Close the page
                      </label>
                    ) : null}

                    {editButton ? (
                      <button
                        type='button'
                        className='btn btn-primary'
                        disabled={isDisable}
                        onClick={(e) => EditEmployee(e)}
                      >
                        Edit Details
                      </button>
                    ) : (
                      <button
                        type='button'
                        className='btn btn-primary'
                        disabled={isDisable}
                        onClick={(e) => AddEmployee(e)}
                      >
                        Save Details
                      </button>
                    )}
                  </div>
                </div>
                {/* /.modal-content */}
              </div>
              {/* /.modal-dialog */}
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

Employees.propTypes = {
  getAllEmployees: PropTypes.func.isRequired,
  createEmployee: PropTypes.func.isRequired,
  getEmployeeById:PropTypes.func.isRequired,
  editEmployee:PropTypes.func.isRequired,
  deleteEmployeeById:PropTypes.func.isRequired,
  getEmployeeByFilter:PropTypes.func.isRequired,
  employee: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  employee: state.employee,
  user: state.auth.user,
});
export default connect(mapStateToProps, { getAllEmployees, createEmployee,getEmployeeById,editEmployee,deleteEmployeeById,getEmployeeByFilter})(
  Employees
);
