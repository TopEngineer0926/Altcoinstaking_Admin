import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Drawer } from '@material-ui/core';
import authService from '../../../../services/authService.js';
import { Profile, SidebarNav, UpgradePlan } from './components';
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';

const useStyles = makeStyles(theme => ({
  drawer: {
    [theme.breakpoints.up('xl')]: {
      width: 333
    },
    [theme.breakpoints.between('lg', 'lg')]: {
      width: 233
    },
    [theme.breakpoints.down('md')]: {
      width: 163
    },
    background: 'transparent',
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
      color: '#0937aC'
    },
    [theme.breakpoints.up('xl')]: {
      width: 24,
      height: 24
    },
    [theme.breakpoints.between('lg', 'lg')]: {
      width: 17,
      height: 17
    },
    [theme.breakpoints.down('md')]: {
      width: 12,
      height: 12
    },
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(2)
  },
  root: {
    background: 'linear-gradient(0deg, #07071C 30%, #0937aC 100%)',
    // background: '#07071C',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflowX: 'hidden',
    justifyContent: 'space-between'
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
      activeIcon: (
        <HomeIcon className={classes.icon} />
        // <img src="/images/ic_home_active.png" className={classes.icon} />
      ),
      inactiveIcon: (
        // <img src="/images/ic_home_inactive.png" className={classes.icon} />
        <HomeIcon className={classes.icon} />
      ),
      id: 0,
      status: 'visible'
    },
    {
      title: 'Administrator',
      href: '/administrator',
      activeIcon: (
        <PersonIcon className={classes.icon}/>
        // <img src="/images/ic_building_active.png" className={classes.icon} />
      ),
      inactiveIcon: (
        // <img src="/images/ic_building_inactive.png" className={classes.icon} />
        <PersonIcon className={classes.icon}/>
      ),
      id: 1,
      status: 'visible'
    },
    {
      title: 'My Account',
      href: '/my-account',
      activeIcon: (
        <PersonIcon className={classes.icon}/>
        // <img src="/images/ic_building_active.png" className={classes.icon} />
      ),
      inactiveIcon: (
        // <img src="/images/ic_building_inactive.png" className={classes.icon} />
        <PersonIcon className={classes.icon}/>
      ),
      id: 2,
      status: 'visible'
    }
  ];

  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}>
      <div {...rest} className={clsx(classes.root, className)}>
        <div>
          <Profile />
          <SidebarNav className={classes.nav} pages={admin_pages} />
        </div>
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
