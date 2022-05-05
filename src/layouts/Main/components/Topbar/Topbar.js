import React, { useState, useEffect } from 'react';
import {
  ToastsContainer,
  ToastsContainerPosition,
  ToastsStore
} from 'react-toasts';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Hidden, IconButton, Grid } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import useGlobal from 'Global/global';
import { withRouter } from 'react-router-dom';
import ConnectWallet from '../../../../components/ConnectWallet';
import ContractAbi from '../../../../config/StakeInPool.json';
import { ethers } from 'ethers';
import { useEthers } from "@usedapp/core";

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none',
    display: 'flex',
    [theme.breakpoints.up('lg')]: {
      width: 'calc(100% - 233px)',
      height: 146
    },
    [theme.breakpoints.up('xl')]: {
      width: 'calc(100% - 333px)',
      height: 209
    },
    '& .MuiButton-root': {
      textTransform: 'none'
    },
    backgroundColor: '#07071C',
    '& .MuiInputBase-root': {
      [theme.breakpoints.up('xl')]: {
        fontSize: 20
      },
      [theme.breakpoints.down('lg')]: {
        fontSize: 14
      },
      [theme.breakpoints.down('md')]: {
        fontSize: 10
      }
    }
  },
  paper: {
    '& .MuiInputBase-root': {
      [theme.breakpoints.up('xl')]: {
        fontSize: 20
      },
      [theme.breakpoints.down('lg')]: {
        fontSize: 14
      },
      [theme.breakpoints.down('md')]: {
        fontSize: 10
      }
    }
  },
  flexGrow: {
    flexGrow: 1
  },
  signOutButton: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(2)
  },
  alertButton: {
    color: 'lightgrey'
  },
  avatar: {
    [theme.breakpoints.up('xl')]: {
      fontSize: 21,
      width: 50,
      height: 50
    },
    [theme.breakpoints.down('lg')]: {
      fontSize: 15,
      width: 35,
      height: 35
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 11,
      width: 25,
      height: 25
    }
  },
  down: {
    color: '#707070',
    [theme.breakpoints.up('xl')]: {
      width: 55,
      height: 20
    },
    [theme.breakpoints.down('lg')]: {
      width: 35,
      height: 14
    },
    [theme.breakpoints.down('md')]: {
      width: 25,
      height: 10
    }
  },
  toolbar: {
    flex: 1
  },
  menuIcon: {
    color: 'grey'
  },
  menu_item: {
    [theme.breakpoints.up('xl')]: {
      fontSize: 18,
      minHeight: 0,
      lineHeight: 0
    },
    [theme.breakpoints.down('lg')]: {
      fontSize: 13,
      minHeight: 0,
      lineHeight: 0
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 9,
      minHeight: 0,
      lineHeight: 0
    },

    justifyContent: 'center'
  },
  menuProps: {
    textAlign: 'center',
    borderColor: '#707070',
    paddingBottom: 0,
    borderRadius: 8,
    boxShadow: '5px 5px 19px #b6acf8',
    maxWidth: 270,
    [theme.breakpoints.up('xl')]: {
      marginTop: 90
    },
    [theme.breakpoints.down('lg')]: {
      marginTop: 80
    },
    [theme.breakpoints.down('md')]: {
      marginTop: 45
    }
  },
  searchInput: {
    [theme.breakpoints.up('xl')]: {
      borderRadius: 50,
      height: 50,
      width: 308
    },
    [theme.breakpoints.down('lg')]: {
      borderRadius: 35,
      height: 35,
      width: 215
    },
    [theme.breakpoints.down('md')]: {
      borderRadius: 25,
      height: 25,
      width: 151
    },
    marginRight: theme.spacing(2),
    boxShadow: '0px 3px 5px 2px rgba(182, 172, 251, .42)'
  },
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center'
  },
  logo_size: {
    [theme.breakpoints.up('xl')]: {
      height: 209,
      padding: 30
    },
    [theme.breakpoints.down('lg')]: {
      height: 146,
      padding: 20
    },
    [theme.breakpoints.down('md')]: {
      height: 102,
      padding: 10
    },
    display: 'flex',
    alignItems: 'center'
  }
}));

const Topbar = props => {
  const { className, onSidebarOpen } = props;
  const classes = useStyles();
  const { account } = useEthers();
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    async function getPrams() {
      await getParams();
    }
    getPrams();
  }, [account]);

  const getParams = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const SIPContract = new ethers.Contract(
      process.env.REACT_APP_NFT_ADDRESS,
      ContractAbi,
      provider.getSigner()
    );

    let ownerAddress = await SIPContract.owner();
    if (ownerAddress == account) {
      setIsOwner(true);
    } else {
      setIsOwner(false);
    }
  };
  return (
    <AppBar className={clsx(classes.root, className)}>
      <Toolbar className={classes.toolbar}>
        <Grid container>
          <Grid item container xs={12} sm={5} alignItems="center">
            <Hidden lgUp>
              <IconButton color="inherit" onClick={onSidebarOpen}>
                <MenuIcon className={classes.menuIcon} />
              </IconButton>
            </Hidden>
          </Grid>
          <Grid
            item
            xs={12}
            sm={7}
            style={{ display: 'flex', alignItems: 'center' }}>
            <div className={classes.flexGrow} />
            <div className={classes.row}>
              {/* <NativeBalance /> */}
              <ConnectWallet />
            </div>
            {
              isOwner ? 
                <span
                  style={{
                    color: 'white',
                    fontSize: 25,
                    fontWeight: 'bold',
                    marginLeft: 20
                  }}>
                  Admin
                </span>
              :
                <></>
            }
          </Grid>
        </Grid>
      </Toolbar>
      <ToastsContainer
        store={ToastsStore}
        position={ToastsContainerPosition.TOP_RIGHT}
      />
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func
};

export default withRouter(Topbar);
