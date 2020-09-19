import React, { Fragment, useEffect, Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation,
} from 'react-router-dom';
import Header from './components/navbar/Header';
import Menu from './components/navbar/Menu';
import Footer from './components/navbar/Footer';
import test from './components/test/test';
import Login from './components/auth/Login';
import Routes from './components/routing/Routes';

//Redux
import { Provider } from 'react-redux';
import store from './store/store';
import setAuthToken from './utils/setAuthToken';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  // useEffect(() => {
  //   store.dispatch(loadUser());
  // }, []);
  return (
      <Provider store={store}>
        <Router>
          <Fragment>
            <Header />
            {/* <Menu /> */}

            <Switch>
              <Route component={Routes} />
            </Switch>
          </Fragment>
        </Router>
      </Provider>
  );
};

export default App;
