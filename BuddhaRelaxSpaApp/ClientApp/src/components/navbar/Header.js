import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logout } from '../../store/actions/auth/auth.action';

const Header = ({ auth: { isAuthenticated, loading, user }, logout }) => {
  if (isAuthenticated) {
    return (
      <div className='wrapper'>
        {/* Navbar */}
        <nav className='main-header navbar navbar-expand-md navbar-light navbar-white '>
          <div className='container'>
            <a href='../../index3.html' className='navbar-brand'>
              <img
                src={user != null ? user.profileImg : '#!'}
                alt='AdminLTE Logo'
                className='brand-image img-circle elevation-3'
                style={{ opacity: '.8' }}
              />
              <span className='brand-text font-weight-light'>
                {user != null ? user.firstName : ''}{' '}
                {user != null ? user.lastName : ''}
              </span>
            </a>
            <button
              className='navbar-toggler order-1'
              type='button'
              data-toggle='collapse'
              data-target='#navbarCollapse'
              aria-controls='navbarCollapse'
              aria-expanded='false'
              aria-label='Toggle navigation'
            >
              <span className='navbar-toggler-icon' />
            </button>
            <div
              className='collapse navbar-collapse order-3'
              id='navbarCollapse'
            >
              {/* Left navbar links */}
              <ul className='navbar-nav'>
                <li className='nav-item'>
                  <Link to='/dashboard' className='nav-link'>
                    Dashboard
                  </Link>

                  {/* <a href='index3.html' className='nav-link'>
                    Home
                  </a> */}
                </li>
                <li className='nav-item'>
                  <Link to='/clients' className='nav-link'>
                    Clients
                  </Link>
                  {/* <a href='#' className='nav-link'>
                    Clients
                  </a> */}
                </li>
                {user.roleId === 1 && (
                  <li className='nav-item'>
                    <Link to='/employees' className='nav-link'>
                      Employees
                    </Link>
                  </li>
                )}

                <li className='nav-item dropdown'>
                  <a
                    id='dropdownSubMenu1'
                    href='#'
                    data-toggle='dropdown'
                    aria-haspopup='true'
                    aria-expanded='false'
                    className='nav-link dropdown-toggle'
                  >
                    Utilities
                  </a>
                  <ul
                    aria-labelledby='dropdownSubMenu1'
                    className='dropdown-menu border-0 shadow'
                  >
                    <li>
                      <Link to='/expenses' className='dropdown-item'>
                        Expenses
                      </Link>
                    </li>
                    {/* <li>
                      <a href='#' className='dropdown-item'>
                        Some other action
                      </a>
                    </li> */}
                    <li className='dropdown-divider' />
                  </ul>
                </li>
              </ul>
              {/* SEARCH FORM */}
              <form className='form-inline ml-0 ml-md-3'>
                <div className='input-group input-group-sm'>
                  <input
                    className='form-control form-control-navbar'
                    type='search'
                    placeholder='Search'
                    aria-label='Search'
                  />
                  <div className='input-group-append'>
                    <button className='btn btn-navbar' type='submit'>
                      <i className='fas fa-search' />
                    </button>
                  </div>
                </div>
              </form>
            </div>
            {/* Right navbar links */}
            <ul className='order-1 order-md-3 navbar-nav navbar-no-expand ml-auto'>
              {/* Messages Dropdown Menu */}
              <li>
                <a onClick={logout} href='/' className='nav-link'>
                  <i className='fas fa-sign-out-alt' />{' '}
                  <span className='hide-sm'>Logout</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    );
  } else {
    return null;
  }
};

Header.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Header);
