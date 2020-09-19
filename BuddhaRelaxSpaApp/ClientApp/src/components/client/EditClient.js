import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../navbar/Spinner';
import MultiSelect from 'react-multiple-select-dropdown-lite';
import 'react-multiple-select-dropdown-lite/dist/index.css';
import {setAlert} from '../../store/actions/alert/alert.action';
import {
  getClientById,
  updateClient,
  deleteClientById,
} from '../../store/actions/client/client.action';

const EditClient = ({
  client: { loading },
  getClientById,
  updateClient,
  deleteClientById,
  setAlert,
  match,
  history,
}) => {
  const [formData, setFormData] = useState({
    ClientId: 0,
    ClientName: '',
    MemberName: '',
    CardNo: '',
    DateOfBirth: '',
    Gender: '',
    Phone: '',
    Address: '',
    City: 'Jodhpur',
    State: 'Rajasthan',
    TherapyPreference: '',
    InjuryOrDisease: '',
    MassagePreference: '',
    PainingArea: '',
    IsFromEditPage:true,
    MassageCount: 0,
    MassageBalance:0,
    MassageTime:30
  });
  const Therapyoptions = [
    { value: 'Strong', label: 'Strong' },
    { value: 'Standard', label: 'Standard' },
    { value: 'Soft', label: 'Soft' },
  ];

  const Injuryoptions = [
    { value: 'Heart Diease', label: 'Heart Diease' },
    { value: 'Hepatitis', label: 'Hepatitis' },
    { value: 'Diabetes', label: 'Diabetes' },
    { value: 'Lung Disease', label: 'Lung Disease' },
    { value: 'Hypotension', label: 'Hypotension' },
    { value: 'Skin Diseases', label: 'Skin Diseases' },
    { value: 'High Blood Pressure', label: 'High Blood Pressure' },
    { value: 'Arthritis', label: 'Arthritis' },
    { value: 'Pregnant', label: 'Pregnant' },
  ];

  const Massageoptions = [
    {
      value: 'Traditional Thai Massage (Dry Massage)',
      label: 'Traditional Thai Massage (Dry Massage)',
    },
    { value: 'Foot Reflexology', label: 'Foot Reflexology' },
    { value: 'Herbal Ball Compression', label: 'Herbal Ball Compression' },
    {
      value: 'Aroma Therapy Massage (Oil Massage)',
      label: 'Aroma Therapy Massage (Oil Massage)',
    },
    {
      value: 'Specific Massage: Back Shoulder',
      label: 'Specific Massage: Back Shoulder',
    },
    {
      value: 'Specific Massage Head & Shoulder',
      label: 'Specific Massage Head & Shoulder',
    },
  ];

  const PainingAreaoptions = [
    { value: 'Head', label: 'Head' },
    { value: 'Neck', label: 'Neck' },
    { value: 'Shoulder', label: 'Shoulder' },
    { value: 'Back', label: 'Back' },
    { value: 'Arm', label: 'Arm' },
    { value: 'Waist', label: 'Waist' },
    { value: 'Thigh', label: 'Thigh' },
    { value: 'Sole', label: 'Sole' },
    { value: 'Calf', label: 'Calf' },
  ];
  const [selectedTherapyOption, setTherapySelectedOption] = useState('');
  const [selectedInjuryoptions, setInjurySelectedOption] = useState('');
  const [selectedMassageoptions, setMassageSelectedOption] = useState('');
  const [selectedPainingAreaoptions, setPainingAreaSelectedOption] = useState(
    ''
  );
  const handleTherapyOnchange = (val) => {
    setTherapySelectedOption(val);
  };
  const handleInjuryOnchange = (val) => {
    setInjurySelectedOption(val);
  };
  const handleMassageOnchange = (val) => {
    setMassageSelectedOption(val);
  };
  const handlePainingAreaOnchange = (val) => {
    setPainingAreaSelectedOption(val);
  };
  const fnSetFormdata=(data)=>{
    setFormData({
      ClientId:  data.clientId,
      ClientName: data.clientName,
      MemberName: data.memberName,
      CardNo:  data.cardNo,
      DateOfBirth: data.dateOfBirth,
      Gender:  data.gender,
      Phone:  data.phone,
      Address:  data.address,
      City:  data.city,
      State:  data.state,
      TherapyPreference:handleTherapyOnchange(data.therapyPreference),
      InjuryOrDisease: handleInjuryOnchange(data.injuryOrDisease),
      MassagePreference: handleMassageOnchange(data.massagePreference),
      PainingArea: handlePainingAreaOnchange(data.painingArea),
      MassageCount: data.massageCount,
      MassageBalance: data.massageBalance,
      MassageTime:data.massageTime,
      IsFromEditPage:true
    });
  }
  useEffect(() => {
    getClientById(match.params.id).then((resObject) => {
      if (resObject !== null) {
        fnSetFormdata(resObject);
      }
    });
  }, [getClientById, match.params.id]);

  const {
    ClientName,
    MemberName,
    CardNo,
    DateOfBirth,
    Gender,
    Phone,
    Address,
    City,
    State,
    MassageCount,
    MassageTime
  } = formData;
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const onSubmit = (e) => {
    e.preventDefault();
    formData.TherapyPreference = selectedTherapyOption;
    formData.InjuryOrDisease = selectedInjuryoptions;
    formData.MassagePreference = selectedMassageoptions;
    formData.PainingArea = selectedPainingAreaoptions;
    
    let Count = formData.MassageCount;
    if(Count < formData.MassageBalance){
      setAlert("Massage Count Can not be less then its balance count.", "warning")
    }else{
      updateClient(formData, history);
    }
  };
  const deleteClient = (e) => {
    e.preventDefault();
    deleteClientById(formData.ClientId, history);
  };
  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <div className='wrapper'>
            {/* Content Wrapper. Contains page content */}
            <div className='content-wrapper'>
              {/* Content Header (Page header) */}
              <section className='content-header'>
                <div className='container-fluid'>
                  <div className='row mb-2'>
                    <div className='col-sm-6'>
                      <h1>Edit Client</h1>
                    </div>
                  </div>
                </div>
                {/* /.container-fluid */}
              </section>
              {/* Main content */}
              <section className='content'>
                <div className='container-fluid'>
                  <div className='row'>
                    {/* left column */}
                    <div className='col-md-12'>
                      {/* general form elements */}
                      <div className='card card-primary'>
                        {/* <div className='card-header'>
                    <h3 className='card-title'>Quick Example</h3>
                  </div> */}
                        {/* /.card-header */}
                        {/* form start */}
                        <form role='form' onSubmit={(e) => onSubmit(e)}>
                          <div className='card-body'>
                            <div className='form-group'>
                              <div className='row col-md-12'>
                                <div className='col-md-4'>
                                  <label
                                    htmlFor='ClientName'
                                    className='required'
                                  >
                                    Client Name
                                  </label>
                                  <input
                                    type='text'
                                    className='form-control'
                                    id='ClientName'
                                    placeholder='Enter Client Name'
                                    name='ClientName'
                                    value={ClientName}
                                    onChange={(e) => onChange(e)}
                                  />
                                </div>
                                <div className='col-md-4'>
                                  <label htmlFor='MemberName'>
                                    Member Name
                                  </label>
                                  <input
                                    type='text'
                                    className='form-control'
                                    id='MemberName'
                                    placeholder='Enter Member Name'
                                    name='MemberName'
                                    value={MemberName}
                                    onChange={(e) => onChange(e)}
                                  />
                                </div>
                                <div className='col-md-4'>
                                  <label htmlFor='CardNumber'>Card No.</label>
                                  <input
                                    type='text'
                                    className='form-control'
                                    id='CardNumber'
                                    placeholder='Enter Card Number'
                                    name='CardNo'
                                    value={CardNo}
                                    onChange={(e) => onChange(e)}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className='form-group'>
                              <div className='row col-md-12'>
                                <div className='col-md-4'>
                                  <label
                                    htmlFor='DateOfBirth'
                                    className='required'
                                  >
                                    Date Of Birth
                                  </label>

                                  <div
                                    className='input-group date'
                                    id='reservationdate'
                                    data-target-input='nearest'
                                  >
                                    <input
                                      type='date'
                                      className='form-control datetimepicker-input'
                                      data-target='#reservationdate'
                                      name='DateOfBirth'
                                      value={DateOfBirth}
                                      onChange={(e) => onChange(e)}
                                    />
                                  </div>
                                </div>
                                <div className='col-md-4'>
                                  <label htmlFor='Gender' className='required'>
                                    Gender
                                  </label>
                                  <select
                                    className='form-control'
                                    style={{ width: '100%' }}
                                    name='Gender'
                                    value={Gender}
                                    onChange={(e) => onChange(e)}
                                  >
                                    <option value=''>--Select--</option>
                                    <option value='Male'>Male</option>
                                    <option value='Female'>Female</option>
                                  </select>
                                </div>
                                <div className='col-md-4'>
                                  <label
                                    htmlFor='PhoneNumber'
                                    className='required'
                                  >
                                    Phone No.
                                  </label>
                                  <input
                                    type='text'
                                    className='form-control'
                                    id='PhoneNumber'
                                    placeholder='Enter Phone No.'
                                    name='Phone'
                                    value={Phone}
                                    onChange={(e) => onChange(e)}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className='form-group'>
                              <div className='row col-md-12'>
                                <div className='col-md-4'>
                                  <label htmlFor='Address'>Address</label>
                                  <input
                                    type='text'
                                    className='form-control'
                                    id='Address'
                                    placeholder='Enter Address'
                                    name='Address'
                                    value={Address}
                                    onChange={(e) => onChange(e)}
                                  />
                                </div>
                                <div className='col-md-4'>
                                  <label htmlFor='City'>City</label>
                                  <select
                                    className='form-control'
                                    style={{ width: '100%' }}
                                    name='City'
                                    value={City}
                                    onChange={(e) => onChange(e)}
                                  >
                                    <option value='Jodhpur'>Jodhpur</option>
                                    <option value='Other'>Other</option>
                                  </select>
                                </div>
                                <div className='col-md-4'>
                                  <label htmlFor='State'>State</label>
                                  <select
                                    className='form-control'
                                    style={{ width: '100%' }}
                                    name='State'
                                    value={State}
                                    onChange={(e) => onChange(e)}
                                  >
                                    <option value='Rajasthan'>Rajasthan</option>
                                    <option value='Other'>Other</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div className='form-group'>
                              <div className='row col-md-12'>
                                <div className='col-md-4'>
                                  <label>
                                    Therapy Preference:- {selectedTherapyOption}
                                  </label>
                                  <MultiSelect
                                    onChange={handleTherapyOnchange}
                                    options={Therapyoptions}
                                    defaultValue={selectedTherapyOption}
                                    width={400}
                                  />
                                </div>
                                <div className='col-md-4'>
                                  <label>
                                    Any Injury/Disease:- {selectedInjuryoptions}
                                  </label>
                                  <MultiSelect
                                    onChange={handleInjuryOnchange}
                                    options={Injuryoptions}
                                    defaultValue={selectedInjuryoptions}
                                    width={400}
                                  />
                                </div>
                                <div className='col-md-4'>
                                  <label>
                                    Massage Preference:-{' '}
                                    {selectedMassageoptions}
                                  </label>
                                  <MultiSelect
                                    onChange={handleMassageOnchange}
                                    options={Massageoptions}
                                    defaultValue={selectedMassageoptions}
                                    width={400}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className='form-group'>
                              <div className='row col-md-12'>
                                <div className='col-md-4'>
                                  <label>
                                    Paining Area:- {selectedPainingAreaoptions}
                                  </label>
                                  <MultiSelect
                                    onChange={handlePainingAreaOnchange}
                                    options={PainingAreaoptions}
                                    defaultValue={selectedPainingAreaoptions}
                                    width={400}
                                  />
                                </div>
                                <div className='col-md-4'>
                                  <label>Number Of Massage In Package</label>
                                  <select
                                    className='form-control'
                                    style={{ width: '100%' }}
                                    name='MassageCount'
                                    value={MassageCount}
                                    onChange={(e) => onChange(e)}
                                  >
                                    <option value={0}>0</option>
                                    <option value={1}>1</option>
                                    <option value={2}>2</option>
                                    <option value={3}>3</option>
                                    <option value={4}>4</option>
                                    <option value={5}>5</option>
                                    <option value={6}>6</option>
                                    <option value={7}>7</option>
                                    <option value={8}>8</option>
                                    <option value={9}>9</option>
                                    <option value={10}>10</option>
                                    <option value={11}>11</option>
                                    <option value={12}>12</option>
                                  </select>
                                </div>
                                <div className='col-md-4'>
                                  <label htmlFor='Address'>Massage Balance</label>
                                  <input
                                    type='number'
                                    className='form-control'
                                    disabled={true}
                                    name='MassageBalance'
                                    value={formData.MassageBalance}
                                    onChange={(e) => onChange(e)}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className='form-group'>
                              <div className='row col-md-12'>
                                <div className='col-md-4'>
                                  <label>Massage Time</label>
                                  <select
                                  className='form-control'
                                  style={{ width: '100%' }}
                                  name='MassageTime'
                                  value={MassageTime}
                                  onChange={(e) => onChange(e)}
                                  >
                                  <option value='30'>30</option>
                                  <option value='45'>45</option>
                                  <option value='60'>60</option>
                                  <option value='70'>70</option>
                                </select>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* /.card-body */}
                          <div className='card-footer'>
                            <small>* = required field</small>

                            <button
                              type='button'
                              className='btn btn-danger '
                              style={{
                                padding: 5,
                                float: 'right',
                                paddingLeft: 12,
                                paddingRight: 12,
                                marginRight: 15,
                              }}
                              onClick={(e) => deleteClient(e)}
                            >
                              Delete
                            </button>
                            <button
                              type='submit'
                              className='btn btn-info '
                              style={{
                                padding: 5,
                                float: 'right',
                                paddingLeft: 12,
                                paddingRight: 12,
                                marginRight: 15,
                              }}
                            >
                              Edit
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
        </Fragment>
      )}
    </Fragment>
  );
};

EditClient.propTypes = {
  getClientById: PropTypes.func.isRequired,
  updateClient: PropTypes.func.isRequired,
  deleteClientById: PropTypes.func.isRequired,
  setAlert:PropTypes.func.isRequired,
  client: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  client: state.client,
});
export default connect(mapStateToProps, {
  getClientById,
  updateClient,
  deleteClientById,
  setAlert
})(EditClient);
