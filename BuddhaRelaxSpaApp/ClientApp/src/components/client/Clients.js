import React, { Fragment, useEffect ,useState} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ClientCard from '../client/ClientCard';
import Spinner from '../navbar/Spinner';
import { getClients, getClientsByFilter } from '../../store/actions/client/client.action';

const Clients = ({ getClients,getClientsByFilter, client: { clients, loading, rownumber } }) => {
  useEffect(() => {
    getClients(rownumber);
  }, [getClients,rownumber]);
  

  const [formData, setFormData] = useState({ClientName: '',Phone: ''});
  const FetchNext = async (e) => {
    e.preventDefault();
    let rows = rownumber + 9;
    getClients(rows);
  };
  
  const FetchPervious = async (e) => {
    e.preventDefault();
    let rows = rownumber - 9;
    getClients(rows > 0 ? rows : 0);
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const GetFilterResult= (e)=>{
    getClientsByFilter(formData.ClientName,formData.Phone)
  }
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
                    <div className='col-sm-4'>
                      <h1>Contacts</h1>
                    </div>
                    <div className='row col-sm-8'>
                      <div className='col-3'>
                        <input
                          type='text'
                          className='form-control'
                          placeholder='Client Name'
                          name='ClientName'
                          value={formData.ClientName}
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
                        <Link to='/create-client' className='btn btn-navbar'>
                          Create Client
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
                      {clients.length > 0 ? (
                        clients.map((client) => (
                          <ClientCard key={client.clientId} client={client} />
                        ))
                      ) : (
                        <h4>No profiles found...</h4>
                      )}
                    </div>
                  </div>
                  {/* /.card-body */}
                  <div className='card-footer'>
                    <div className='row col-md-12'>
                      <div className='col-2'>
                        <button
                          type='button'
                          className='btn btn-block btn-outline-info'
                          onClick={(e) => FetchPervious(e)}
                        >
                          Previous
                        </button>
                      </div>
                      <div className='col-8'></div>
                      <div className='col-2'>
                        <button
                          type='button'
                          className='btn btn-block btn-outline-info'
                          onClick={(e) => FetchNext(e)}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* /.card-footer */}
                </div>
                {/* /.card */}
              </section>
              {/* /.content */}
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  getClients: PropTypes.func.isRequired,
  getClientsByFilter:PropTypes.func.isRequired,
  client: state.client,
});

export default connect(mapStateToProps, { getClients,getClientsByFilter })(Clients);
