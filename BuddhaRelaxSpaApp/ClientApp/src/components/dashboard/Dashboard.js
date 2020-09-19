import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../navbar/Spinner';
import { getDashboardDetails} from '../../store/actions/client/client.action';
import TherapyLogs from "../client/TherapyLogs";
// import Invoices from '../client/Invoices';
const Dashboard = ({
  getDashboardDetails,
  dashboard: { loading, dashboard },
  user: { userId, companyId, branchId ,roleId}
}) => {
  
  useEffect(() => {
    getDashboardDetails(userId);
  }, [getDashboardDetails]);

  return (
    <Fragment>
      { (dashboard === null  && loading)  ? (
        <Spinner />
      ) : (
        <div className='wrapper'>
          <div className='content-wrapper'>
            {/* Content Header (Page header) */}
            <div className='content-header'>
              <div className='container-fluid'>
                <div className='row mb-2'>
                  <div className='col-sm-6'>
                    <h1 className='m-0 text-dark'>Dashboard</h1>
                  </div>
                </div>
              </div>
            </div>
            {/* Main content */}
            {(roleId ==1 ? (
              <section className='content'>
              <div className='container-fluid'>
                {/* Small boxes (Stat box) */}
                <div className='row'>
                  <div className='col-lg-3 col-6'>
                    {/* small box */}
                    <div className='small-box bg-info'>
                      <div className='inner'>
                        <h3>{dashboard.last24HoursTrax}</h3>
                        <p>Last 24 Hours Transaction</p>
                      </div>
                      <div className='icon'>
                        <i className='ion ion-bag' />
                      </div>
                      {/* <a href='#' className='small-box-footer'>
                    More info <i className='fas fa-arrow-circle-right' />
                  </a> */}
                    </div>
                  </div>
                  {/* ./col */}
                  <div className='col-lg-3 col-6'>
                    {/* small box */}
                    <div className='small-box bg-success'>
                      <div className='inner'>
                        <h3>
                          {dashboard.businessRate}
                          <sup style={{ fontSize: 20 }}>%</sup>
                        </h3>
                        <p>Business Rate</p>
                      </div>
                      <div className='icon'>
                        <i className='ion ion-stats-bars' />
                      </div>
                      {/* <a href='#' className='small-box-footer'>
                    More info <i className='fas fa-arrow-circle-right' />
                  </a> */}
                    </div>
                  </div>
                  {/* ./col */}
                  <div className='col-lg-3 col-6'>
                    {/* small box */}
                    <div className='small-box bg-warning'>
                      <div className='inner'>
                        <h3>{dashboard.totalCustomers}</h3>
                        <p>Total Customer</p>
                      </div>
                      <div className='icon'>
                        <i className='ion ion-person-add' />
                      </div>
                      {/* <a href='#' className='small-box-footer'>
                    More info <i className='fas fa-arrow-circle-right' />
                  </a> */}
                    </div>
                  </div>
                  <div className='col-lg-3 col-6'>
                    <div className='small-box bg-danger'>
                      <div className='inner'>
                        <h3>{dashboard.lastMonthSales}</h3>
                        <p>Last Month Sales</p>
                      </div>
                      <div className='icon'>
                        <i className='ion ion-pie-graph' />
                      </div>
                      {/* <a href='#' className='small-box-footer'>
                    More info <i className='fas fa-arrow-circle-right' />
                  </a> */}
                    </div>
                  </div>
                </div>
              </div>
            </section>
            ): null)}
            
            <div className='row '>
              {/* Left col */}
              <section className='col-md-12 connectedSortable'>
                {/* Custom tabs (Charts with tabs)*/}
                <div className='card'>
                  <div className='card-header'>
                    <h3 className='card-title'>
                      <i className='fas fa-file-invoice fa mr-1' />
                      Therapy Logs.
                    </h3>
                    {/* <div className='card-tools'>
                      <ul className='nav nav-pills ml-auto'>
                        <li className='nav-item'>
                          <a
                            className='nav-link active'
                            href='#revenue-chart'
                            data-toggle='tab'
                          >
                            Area
                          </a>
                        </li>
                        <li className='nav-item'>
                          <a
                            className='nav-link'
                            href='#sales-chart'
                            data-toggle='tab'
                          >
                            Donut
                          </a>
                        </li>
                      </ul>
                    </div> */}
                  </div>
                  {/* /.card-header */}
                  <div className='card-body'>
                    <div className='tab-content p-0'>
                        <TherapyLogs/>
                    </div>
                  </div>
                  {/* /.card-body */}
                </div>
                
              </section>
              
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

Dashboard.propTypes = {
  getDashboardDetails: PropTypes.func.isRequired,
  dashboard: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};
const mapStateToProps = (state) => ({
  dashboard: state.dashboard,
  user: state.auth.user
});
export default connect(mapStateToProps, {
  getDashboardDetails
})(Dashboard);
