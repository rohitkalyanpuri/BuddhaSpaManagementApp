import React, { Fragment, useState, useEffect } from 'react';
import Moment from 'react-moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../navbar/Spinner';
import {
  createInvoiceFromQRUrl,
  getClientById,
} from '../../store/actions/client/client.action';
import Invoices from '../client/Invoices';

const QRCreateInvoice = ({
  client: { loading, invoices, client },
  createInvoiceFromQRUrl,
  getClientById,
  match,
  history
}) => {
  const moment = require('moment');
  const today = moment();
  const [isDisable, setDisable] = useState(false);
  const [isLabelHidden, setLabelHidden] = useState(true);
  const [formData, setFormData] = useState({
    MemberShipNo: 0,
    ReceiptNo: '',
    ReceiptDate: today.format('YYYY-MM-DD'),
    ClientName: '',
    Mobile: '',
    PaymentMode: '',
    Amount: 0,
    AmountInWord: '',
    MassageCount :'0'
  });
  const fnSetFormData = (data) => {
    setFormData({
      MemberShipNo: data.clientId,
      ClientName: data.clientName,
      Mobile: data.phone,
      ReceiptDate: today.format('YYYY-MM-DD'),
      PaymentMode: 'Cash',
    });
  };
  useEffect(() => {
    getClientById(match.params.id).then((resObject) => {
      if (resObject !== null) {
        fnSetFormData(resObject);
      }
    });
  }, [getClientById, match.params.id]);
  const onSubmit = (e) => {
    e.preventDefault();
    setLabelHidden(false);
    setDisable(true);
    createInvoiceFromQRUrl(formData,history);
  };
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <Fragment>
      {client == null && loading ? (
        <Spinner />
      ) : (
        <div className='wrapper'>
          {/* <section className='content-header'>
            <div className='container-fluid'>
              <div className='row mb-2'>
                <div className='col-sm-6'>
                  <h1>Client's Invoice</h1>
                </div>
              </div>
            </div>
          </section> */}
          <div className='content-wrapper'>
            <section className='content'>
              <div className='container-fluid'>
                <div className='row'>
                  {/* left column */}
                  <div
                    className='col-md-6'
                    style={{ padding: 30, marginLeft: 300 }}
                  >
                    {/* general form elements */}
                    <div className='card card-info'>
                      <div className='card-header'>
                        <h3 className='card-title'>Generate Invoice</h3>
                      </div>
                      <div className=''>
                        <label style={{ float: 'left', marginLeft: 20 }}>
                          Receipt# :-
                        </label>
                        <label style={{ float: 'right', marginRight: 100 }}>
                          Date :- {formData.ReceiptDate}
                        </label>
                      </div>
                      <form role='form' onSubmit={(e) => onSubmit(e)}>
                        <div className='card-body'>
                          <div className='form-group'>
                            <div className='row col-md-12'>
                              <div className='col-md-6'>
                                <label htmlFor='exampleInputEmail1'>
                                  Client Name
                                </label>
                                <input
                                  type='text'
                                  className='form-control'
                                  disabled={true}
                                  value={formData.ClientName}
                                  placeholder='Client Name'
                                  onChange={(e) => onChange(e)}
                                />
                              </div>
                              <div className='col-md-6'>
                                <label htmlFor='exampleInputPassword1'>
                                  MemberShip#
                                </label>
                                <input
                                  type='text'
                                  className='form-control'
                                  disabled={true}
                                  value={formData.MemberShipNo}
                                  placeholder='MemberShip Number'
                                  onChange={(e) => onChange(e)}
                                />
                              </div>
                            </div>
                          </div>
                          {/* <div className='form-group'>
                            
                          </div> */}
                          <div className='form-group'>
                              <div className="row col-md-12">
                                 <div className="col-md-6">
                                 <label htmlFor='exampleInputFile'>Mobile</label>
                            <input
                              type='text'
                              className='form-control'
                              disabled={true}
                              name='Mobile'
                              value={formData.Mobile}
                              onChange={(e) => onChange(e)}
                              onChange={(e) => onChange(e)}
                              placeholder='Mobile'
                            />
                                 </div>
                                 <div className="col-md-6">
                                 <label>Payment Mode</label>
                            <select
                              className='form-control'
                              style={{ width: '100%' }}
                              name='PaymentMode'
                              value={formData.PaymentMode}
                              onChange={(e) => onChange(e)}
                            >
                              <option value='Cash'>Cash</option>
                              <option value='UPI'>UPI</option>
                              <option value='Card'>Card</option>
                              <option value='Internet Banking'>
                                Internet Banking
                              </option>
                            </select>
                                 </div>
                              </div>
                            
                          </div>
                          <div className='form-group'>
                             <div className='row col-md-12'>
                               <div className='col-md-6'>
                               <label htmlFor='exampleInputFile'>Amount</label>
                                <input
                                  type='number'
                                  className='form-control'
                                  name='Amount'
                                  placeholder='Amount'
                                  value={formData.Amount}
                                  onChange={(e) => onChange(e)}
                                />
                               </div>
                               <div className='col-md-6'>
                               <label>Number Of Massage In Package</label>
                               <select
                                    className='form-control'
                                    style={{ width: '100%' }}
                                    name='MassageCount'
                                    value={formData.MassageCount}
                                    onChange={(e) => onChange(e)}
                                  >
                                    <option value='0'>0</option>
                                    <option value='1'>1</option>
                                    <option value='2'>2</option>
                                    <option value='3'>3</option>
                                    <option value='4'>4</option>
                                    <option value='5'>5</option>
                                    <option value='6'>6</option>
                                    <option value='7'>7</option>
                                    <option value='8'>8</option>
                                    <option value='9'>9</option>
                                    <option value='10'>10</option>
                                    <option value='11'>11</option>
                                    <option value='12'>12</option>
                                  </select>
                              </div>

                              </div>
                              
                          </div>
                          <div className='form-group'>
                            <label>Amount In words</label>
                            <input
                              type='text'
                              className='form-control'
                              name='AmountInWord'
                              placeholder='Amount In Words'
                              value={formData.AmountInWord}
                              onChange={(e) => onChange(e)}
                            />
                          </div>
                        </div>
                        {/* /.card-body */}
                        <div className='card-footer'>
                          {!isLabelHidden ? (
                            <label
                              style={{
                                color: 'red',
                              }}
                            >
                              Creating... Please do not Refresh/Close the page
                            </label>
                          ) : null}

                          <button
                            type='submit'
                            className='btn btn-info '
                            disabled={isDisable}
                            style={{
                              padding: 5,
                              float: 'right',
                              paddingLeft: 8,
                              paddingRight: 8,
                              marginRight: 15,
                            }}
                          >
                            Create
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
    </Fragment>
  );
};
QRCreateInvoice.propTypes = {
  createInvoiceFromQRUrl: PropTypes.func.isRequired,
  getClientById: PropTypes.func.isRequired,
  client: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  client: state.client,
});

export default connect(mapStateToProps, {
  createInvoiceFromQRUrl,
  getClientById,
})(QRCreateInvoice);
