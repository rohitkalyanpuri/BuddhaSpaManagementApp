import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../navbar/Spinner';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DataTable from 'react-data-table-component';
import {
  getExpenses,
  createExpenses,
  getExpensesGroupByEmployee
} from '../../store/actions/expenses.action';
import { getAllEmployees } from '../../store/actions/employee.action';

const customStyles = {
  rows: {
    style: {
      minHeight: '72px', // override the row height
      minWidth: '100px',
    },
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

const Expenses = ({
  getExpenses,
  getAllEmployees,
  createExpenses,
  getExpensesGroupByEmployee,
  expenses: { loading, expenses,expensesGroupByEmployee },
  user: { userId, companyId, branchId, roleId },
  employee: { employees },
}) => {
  useEffect(() => {
    getExpenses(companyId, userId, 30,branchId);
    getAllEmployees(companyId, userId);
    if(roleId===1){
      getExpensesGroupByEmployee(companyId,branchId)
    }
  }, [getExpenses, getAllEmployees]);
  const [formData, setFormData] = useState({
    EmployeeId: 0,
    RoleId: roleId,
    Amount: '',
    TransactionType: '',
    Note: '',
    CompanyId: companyId,
    BranchId: branchId,
    CreatedbyEmployeeId: userId,
    ExpensesId: 0,
    LastDays:30
  });
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const [editButton, setEditButton] = useState(false);
  const [isDisable, setDisable] = useState(false);
  const [isLabelHidden, setLabelHidden] = useState(true);
  const [modelTitle, setModelTit] = useState('Add Employee');

  const AddExpenses = (e) => {
    e.preventDefault();
    setLabelHidden(false);
    setDisable(true);
    createExpenses(formData).then((res) => {
      setLabelHidden(true);
      setDisable(false);
      if (res) {
        setFormData({
          EmployeeId: 0,
          RoleId: roleId,
          Amount: '',
          TransactionType: '',
          Note: '',
          CompanyId: companyId,
          BranchId: branchId,
          CreatedbyEmployeeId: userId,
          ExpensesId: 0,
          LastDays:30
        });
        var close = document.getElementById('closemodel');
        close.click();
      }
    });
  };

  const columns = [
    {
      name: 'Note',
      selector: 'note',
      sortable: true,
    },
    {
      name: 'Amount',
      selector: 'amount',
      sortable: true,
    },

    {
      name: 'Transaction Type',
      selector: 'transactionType',
      sortable: true,
    },

    {
      name: 'Employee Name',
      selector: 'employeeName',
      sortable: true,
    },
    {
      name: 'Created by Employee Name',
      selector: 'createdbyEmployeeName',
      sortable: true,
    },
    {
      name: 'Created Date',
      selector: 'createdDate',
      sortable: true,
    },
    // {
    //   name: 'Action',
    //   button: true,
    //   cell: row => <div>
    //                   <a href="#" className="btn btn-sm" onClick={(e) => GetEmployeeDetails(row.employeeId)} data-toggle="tooltip" title="Edit">
    //                          <i className="fa fa-edit" ></i>
    //                   </a>
    //                   <a href="#" className="btn btn-sm" onClick={(e) => DeleteEmployee(row.employeeId)} data-toggle="tooltip" title="Delete">
    //                     <i className="fa fa-trash" ></i>
    //                   </a>
    //                 </div>,
    // },
  ];
  const columnsGroupByEmployee = [
    {
      name: 'Employee Name',
      selector: 'employeeName',
      sortable: true,
    },
    {
      name: 'Total Credit',
      selector: 'totalCredit',
      sortable: true,
    },
    {
      name: 'Total Debit',
      selector: 'totalDebit',
      sortable: true,
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
                    <h1>Expenses</h1>
                  </div>
                  <div className='col-sm-8'>
                    <ol className='breadcrumb float-sm-right'>
                      <p className='mr-3 p-1 h5'>Filter (In Days)</p>
                      <li className='breadcrumb-item'>
                        <select
                          className='form-control'
                          style={{ width: '100%' }}
                          name='LastDays'
                          value={formData.LastDays}
                          onChange={(e) => {onChange(e) ;getExpenses(companyId, userId, e.target.value,branchId)}}
                        >
                          <option value='30'>30</option>
                          <option value='60'>60</option>
                          <option value='90'>90</option>
                          <option value='120'>120</option>
                          <option value='180'>180</option>
                          <option value='360'>360</option>
                        </select>
                      </li>
                      <Link
                        to='/create-expenses'
                        className='btn btn-navbar'
                        data-backdrop='static'
                        id='CreateExpenses'
                        data-toggle='modal'
                        data-target='#modal-lg'
                      >
                        Create Expenses
                      </Link>
                    </ol>
                  </div>
                </div>
              </div>
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
                        data={expenses}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {roleId === 1 && (
                <div className='card card-solid'>
                  <div className='card-body pb-0'>
                    <div className='row d-flex align-items-stretch'>
                      <div className='invoiceTable'>
                        <DataTable
                          // title="Invoices"
                          columns={columnsGroupByEmployee}
                          theme='solarized'
                          pagination
                          noHeader
                          data={expensesGroupByEmployee}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
                    ></button>
                  </div>
                  <div className='modal-body'>
                    <form role='form'>
                      <div className='form-group'>
                        <div className='row col-md-12'>
                          <div className='col-md-4'>
                            <label htmlFor='Amount' className='required'>
                              Amount
                            </label>
                            <input
                              type='text'
                              className='form-control'
                              id='Amount'
                              placeholder='Enter Amount'
                              name='Amount'
                              value={formData.Amount}
                              onChange={(e) => onChange(e)}
                            />
                          </div>
                          <div className='col-md-4'>
                            <label htmlFor='MemberName'>Transaction Type</label>
                            <select
                              className='form-control'
                              style={{ width: '100%' }}
                              name='TransactionType'
                              value={formData.TransactionType}
                              onChange={(e) => onChange(e)}
                            >
                              <option value=''>--Select--</option>
                              <option value='Credit'>Credit</option>
                              <option value='Debit'>Debit</option>
                            </select>
                          </div>
                          <div className='col-md-4'>
                            <label htmlFor='Note'>Note</label>
                            <input
                              type='text'
                              className='form-control'
                              id='Note'
                              placeholder='Enter Note'
                              name='Note'
                              value={formData.Note}
                              onChange={(e) => onChange(e)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className='form-group'>
                        <div className='row col-md-12'>
                          <div className='col-md-4'>
                            <label htmlFor='MobileNumber'>Employee</label>
                            <select
                              onChange={(e) => onChange(e)}
                              className='form-control'
                              name='EmployeeId'
                              value={formData.EmployeeId}
                            >
                              <option value='0'>--Select Employee--</option>
                              {employees.map((x) => (
                                <option key={x.employeeId} value={x.employeeId}>
                                  {x.firstName} {x.lastName}
                                </option>
                              ))}
                            </select>
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
                      onClick={(e) => setEditButton(false)}
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
                        // onClick={(e) => EditEmployee(e)}
                      >
                        Edit Details
                      </button>
                    ) : (
                      <button
                        type='button'
                        className='btn btn-primary'
                        disabled={isDisable}
                        onClick={(e) => AddExpenses(e)}
                      >
                        Save Details
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

Expenses.propTypes = {
  getExpenses: PropTypes.func.isRequired,
  getAllEmployees: PropTypes.func.isRequired,
  createExpenses: PropTypes.func.isRequired,
  getExpensesGroupByEmployee:PropTypes.func.isRequired,
  expenses: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  employee: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  expenses: state.expenses,
  user: state.auth.user,
  employee: state.employee,
});
export default connect(mapStateToProps, {
  getExpenses,
  getAllEmployees,
  createExpenses,
  getExpensesGroupByEmployee
})(Expenses);
