import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import useStyles from './useStyles';
import Grid from '@material-ui/core/Grid';
import authService from 'services/authService.js';
import Subscribe from 'components/Subscribe';
import MyButton from 'components/MyButton';

const Login = (props) => {
  const classes = useStyles();
  const { history } = props;
  const logo = {
    url: '/images/Login.png',
  };

  // Callback function for the Login component to give us access to the web3 instance and contract functions
  const OnLogin = async function () {
      localStorage.clear();
      localStorage.setItem("token", JSON.stringify("success"));
      localStorage.setItem("select", JSON.stringify(0));
      history.push('/dashboard');
  };


  return (
    <div>
      <Grid container direction="column" justifyContent="flex-start" className={classes.root}>
        <Grid item container justifyContent="center">
          <img src={logo.url} className={classes.logo} alt="" />
        </Grid>
        <Grid item container justifyContent="center">
          <p className={classes.title}>Welcome to your personal login area.<br/> Please click on Login button.</p>
        </Grid>
        <Grid item container justifyContent="center">
          <Grid item container xs={1} sm={2} md={4}></Grid>
          <Grid xs={10} sm={7} md={4} item container direction="column" className={classes.body}>
            <Grid item></Grid>
            <Grid item container justifyContent="center">
            </Grid>
            <br></br>
            <Grid item container justifyContent="center">
              <MyButton
                color="1"
                name="Login"
                onClick={OnLogin}
              />
            </Grid>
          </Grid>
          <Grid item container xs={1} sm={2} md={4}></Grid>
        </Grid>
        <Grid item container style={{marginTop: 100, marginBottom: 100}}>
          <Subscribe />
        </Grid>
      </Grid>
    </div>
  );
};
export default withRouter(Login);
