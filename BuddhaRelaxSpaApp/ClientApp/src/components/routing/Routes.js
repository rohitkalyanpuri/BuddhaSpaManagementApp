import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Dashboard from '../../components/dashboard/Dashboard';
import Clients from '../client/Clients';
import EditClient from "../client/EditClient";
import Login from '../../components/auth/Login';
import Alert from '../../components/navbar/Alert';
import CreateClient from '../../components/client/CreateClient';
import ClientInvoice from '../../components/client/ClientInvoice';
import QRCreateInvoice from '../../components/client/QRCreateInvoice';
import ScanQRCode from '../../components/client/ScanQRCode';
import Employees from "../../components/employee/Employees";
import PrivateRoute from './PrivateRoute';
import ReduxToastr from 'react-redux-toastr';
import Expenses from '../../components/expenses/Expenses';


const Routes = (props) => {
  return (
    <section className=''>
      <Alert />
      <ReduxToastr
        timeOut={7000}
        newestOnTop={false}
        preventDuplicates
        position='top-right'
        getState={(state) => state.toastr} // This is the default
        transitionIn='bounceIn'
        transitionOut='bounceOut'
        progressBar
        closeOnToastrClick
      />
      <Switch>
        <Route exact path='/' component={Login} />
        <Route exact path='/scanqrcode/:id' component={ScanQRCode} />
        <Route exact path='/qr-create-invoice/:id' component={QRCreateInvoice} />
        <PrivateRoute exact path='/dashboard' component={Dashboard} />
        <PrivateRoute exact path='/clients' component={Clients} />
        <PrivateRoute exact path='/create-client' component={CreateClient} />
        <PrivateRoute exact path='/edit-client/:id' component={EditClient} />
        <PrivateRoute exact path='/invoices-client/:id' component={ClientInvoice} />
        <PrivateRoute exact path='/employees' component={Employees} />
        <PrivateRoute exact path='/expenses' component={Expenses} />
      </Switch>
    </section>
  );
};

Routes.propTypes = {};
export default Routes;
