import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { scanQRCode} from '../../store/actions/client/client.action';
import { connect } from 'react-redux';
import Spinner from '../navbar/Spinner';

const ScanQRCode = ({  match, scanQRCode }) => {
  const [formData, setFormData] = useState({
    ClientId: 0,
    MassageLeftInPackage: -1,
    ClientName: '',
    Message:'',
    loadding: true,
  });

  const fnSetFormData = (data) => {
    setFormData({
      ClientId: data.clientId,
      ClientName: data.clientName,
      Message:data.message,
      MassageLeftInPackage: data.massageLeftInPackage,
      loadding:false
    });
  };

  useEffect(() => {
    scanQRCode(match.params.id).then((resObject) => {
      if (resObject !== null) {
        fnSetFormData(resObject);
      }
    });
  }, [scanQRCode, match.params.id]);

  if(formData.loadding){
        return (<Spinner />);
  }
  else if (formData.MassageLeftInPackage > 0 || formData.Message === 'Success') {
    return (
      <div className=' lockscreen' style={{ background: 'none' }}>
        <div className='lockscreen-wrapper'>
          <div className='lockscreen-logo'>
            <a href='fake_url'>
              <b>THANK YOU!</b>
            </a>
            <br />
            <b>{formData.ClientName}</b>, You Have{' '}
            <b>{formData.MassageLeftInPackage}</b> More Massage Left In Your Package For Your Next Visit.
          </div>
          {/* User name */}
          {/* <div className='lockscreen-name'></div> */}
          <div className='lockscreen-footer text-center'>
            Copyright © 2020-2021{' '}
            <b>
              <a href='fake_url' className='text-black'>
                BuddhaRelaxSpa
              </a>
            </b>
            <br />
            All rights reserved
          </div>
        </div>
      </div>
    );
  } else if (formData.MassageLeftInPackage == 0) {
    return (
      <div className=' lockscreen' style={{ background: 'none' }}>
        <div className='lockscreen-wrapper'>
          <div className='lockscreen-logo'>
            <b>{formData.ClientName}</b>, You have{' '}
            <b>{formData.MassageLeftInPackage} </b> Massages Left In Your Package.
            <br />
            <Link
              to={`/qr-create-invoice/${formData.ClientId}`}
              className='btn btn-navbar'
            >
              <b>Click here to purchase more Massage.</b>
            </Link>
          </div>
          {/* User name */}
          {/* <div className='lockscreen-name'></div> */}
          <div className='lockscreen-footer text-center'>
            Copyright © 2020-2021{' '}
            <b>
              <a href='fake_url' className='text-black'>
                BuddhaRelaxSpa
              </a>
            </b>
            <br />
            All rights reserved
          </div>
        </div>
      </div>
    );
  } 
  else if(formData.MassageLeftInPackage == -2){
    return (
        <div className=' lockscreen' style={{ background: 'none' }}>
          <div className='lockscreen-wrapper'>
            <div className='lockscreen-logo'>
              <b>No Payment Done Yet. Please make payment to continue.</b>
              <br />
            </div>
          </div>
        </div>
      );
  }
  else {
    return (
      <div className=' lockscreen' style={{ background: 'none' }}>
        <div className='lockscreen-wrapper'>
          <div className='lockscreen-logo'>
            <b>Not able to process the request, please contact Admin.</b>
            <br />
          </div>
        </div>
      </div>
    );
  }
};

ScanQRCode.propTypes = {
  scanQRCode: PropTypes.func.isRequired,
  client: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  client: state.client,
});
export default connect(mapStateToProps, {
  scanQRCode
})(ScanQRCode);
