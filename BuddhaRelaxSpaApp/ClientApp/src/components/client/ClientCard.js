import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const ClientCard = ({
  client: {
    clientId,
    clientName,
    memberName,
    cardNo,
    dateOfBirth,
    gender,
    address,
    city,
    state,
    phone,
    customerImage,
    customerQRCode,
  },
}) => {
  return (
    <div className='col-12 col-sm-3 col-md-4 d-flex align-items-stretch'>
      <div className='card bg-light FullWidthInPercentage'>
        {/* <div className='card-header text-muted border-bottom-0'>
                      Digital Strategist
                    </div> */}
        <div className='card-body pt-0 '>
          <div className='row'>
            <div className='col-7'>
              <h2 className='lead'>
                <b>{clientName}</b>
              </h2>
              <p className='text-muted text-sm'>
                <b>Member Name: </b> {memberName}
              </p>
              <p className='text-muted text-sm'>
                <b>Gender: </b> {gender}
              </p>
              <ul className='ml-4 mb-0 fa-ul text-muted'>
                <li className='small'>
                  <span className='fa-li'>
                    <i className='fas fa-lg fa-building' />
                  </span>{' '}
                  Address: {address} {city} {state}
                </li>
                <li className='small'>
                  <span className='fa-li'>
                    <i className='fas fa-lg fa-phone' />
                  </span>{' '}
                  Phone #: {phone}
                </li>
              </ul>
            </div>
            <div className='col-5 text-center'>
              <img
                src={`data:image/png;base64,${customerQRCode}`}
                alt='No Image'
                className='img-circle img-fluid'
              />
            </div>
          </div>
        </div>
        <div className='card-footer'>
          <div className='text-right'>
            {/* <Link to={`/scanqrcode/${clientId}`} className='btn btn-sm ' data-toggle="tooltip" title="Add Massage Log">
                           <i class="fas fa-history fa-2x" ></i>
                        </Link> */}
            <Link
              to={`/scanqrcode/${clientId}`}
              className='btn btn-sm '
              data-toggle='tooltip'
              title='Add Massage Log'
              target="_blank"
            >
              <i class='fas fa-history fa-2x'></i>
            </Link>
            <Link
              to={`/invoices-client/${clientId}`}
              className='btn btn-sm '
              data-toggle='tooltip'
              title='Invoices'
            >
              <i className='fas fa-file-invoice fa-2x invoiceIconcss' />
            </Link>
            <Link
              to={`/edit-client/${clientId}`}
              className='btn btn-sm btn-primary'
            >
              <i className='fas fa-user' /> View Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

ClientCard.propTypes = {
  client: PropTypes.object.isRequired,
};

export default ClientCard;
