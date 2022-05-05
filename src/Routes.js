import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import { RouteWithLayout } from './components';
import {
  Main as MainLayout,
  Minimal as MinimalLayout,
  Normal as NormalLayout
} from './layouts';

import {
  Dashboard as DashboardView,
  Transactions as TransactionsView,
  MyAccount as MyAccountView,
  SignUp as SignUpView,
  NotFound
} from './views';

//Admin import
import Login from './views/SignIn/Login';
import AdminMyAccount from './views/MyAccount';
import ForgotPassword from 'views/ForgotPassword';
import ResetPassword from 'views/ResetPassword';
import SMSAuth from 'views/SMSAuth';
import VotingView from 'views/VotingView';

const Routes = () => {
  return (
    <Switch>
      {/**
       * ADMIN PART
       */}
      <Redirect exact from="/" to={'/login'} />
      <RouteWithLayout
        component={Login}
        exact
        layout={NormalLayout}
        path="/login"
      />
      <RouteWithLayout
        component={SMSAuth}
        exact
        layout={NormalLayout}
        path="/smsauth"
      />
      <RouteWithLayout
        component={ForgotPassword}
        exact
        layout={NormalLayout}
        path="/forgotpassword"
      />
      <RouteWithLayout
        component={ResetPassword}
        exact
        layout={NormalLayout}
        path="/resetpassword"
      />
      <RouteWithLayout
        component={AdminMyAccount}
        exact
        layout={MainLayout}
        path="/myaccount"
      />
      <RouteWithLayout
        component={DashboardView}
        exact
        layout={MainLayout}
        path="/dashboard"
      />
      <RouteWithLayout
        component={TransactionsView}
        exact
        layout={MainLayout}
        path="/administrator"
      />
      <RouteWithLayout
        component={MyAccountView}
        exact
        layout={MainLayout}
        path="/my-account"
      />
      <RouteWithLayout
        component={SignUpView}
        exact
        layout={MinimalLayout}
        path="/register"
      />
      <RouteWithLayout
        component={VotingView}
        exact
        layout={MainLayout}
        path="/voting"
      />
      <RouteWithLayout
        component={NotFound}
        exact
        layout={NormalLayout}
        path="/not-found"
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;
