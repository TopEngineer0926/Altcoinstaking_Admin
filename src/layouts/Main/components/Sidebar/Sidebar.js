import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {  Drawer } from '@material-ui/core';
import authService from '../../../../services/authService.js';
import { Profile, SidebarNav, UpgradePlan } from './components';

const useStyles = makeStyles(theme => ({
  drawer: {
    [theme.breakpoints.up('xl')]: {
      width: 333,
    },
    [theme.breakpoints.between('lg','lg')]: {
      width: 233,
    },
    [theme.breakpoints.down('md')]: {
      width: 163,
    },
    background:'transparent',
    borderTopRightRadius: 15,
    borderRight: 'none'
    // [theme.breakpoints.between('sm','sm')]: {
    //   width: 114,
    // },
    // [theme.breakpoints.down('sm')]: {
    //   width: 80,
    // },
  },
  icon: {
    '&:hover,&:focus': {
      // backgroundColor: 'white',
      color:'#00bf82',
    },
    [theme.breakpoints.up('xl')]: {
      width: 24,
      height: 24,
    },
    [theme.breakpoints.between('lg','lg')]: {
      width: 17,
      height: 17,
    },
    [theme.breakpoints.down('md')]: {
      width: 12,
      height: 12,
    },
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(2)
  },
  root: {
    background: 'linear-gradient(0deg, #00C9FF 30%, #0CC77C 100%)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflowX: 'hidden',
    justifyContent: 'space-between',
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  }
}));

const Sidebar = props => {
  const { open, variant, onClose, className, ...rest } = props;

  const classes = useStyles();

  const admin_pages = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      activeIcon: <img src='/images/ic_home_active.png' className={classes.icon}/>,
      inactiveIcon:<img src='/images/ic_home_inactive.png' className={classes.icon}/>,
      id:0,
      status: 'visible'
    },
    {
      title: 'Administrator',
      href: '/transactions',
      activeIcon: <img src='/images/ic_building_active.png' className={classes.icon}/>,
      inactiveIcon:<img src='/images/ic_building_inactive.png' className={classes.icon}/>,
      id:3,
      status: 'visible'
    },
  ];

  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}
    >
      <div
        {...rest}
        className={clsx(classes.root, className)}
      >
        <div>
          <Profile />
          <SidebarNav
            className={classes.nav}
            pages={admin_pages}
          />
        </div>
        <UpgradePlan />
      </div>
    </Drawer>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
};

export default Sidebar;
