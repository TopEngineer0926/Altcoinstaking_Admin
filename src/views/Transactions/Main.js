import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import useStyles from './useStyles';
import MyButton from 'components/MyButton';
import authService from 'services/authService';
import {
  ToastsContainer,
  ToastsContainerPosition,
  ToastsStore
} from 'react-toasts';
import ContractAbi from '../../config/StakeInPool.json';
import { ethers } from 'ethers';
import CircularProgress from '@material-ui/core/CircularProgress';
import useGlobal from 'Global/global';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const Main = props => {
  const { history } = props;
  const classes = useStyles();
  const cellList = [20, 50, 100, 200];
  const incomeDirection = 2;
  const incomeColor = '#FC5555'; //#2DCE9C
  const [globalState, globalActions] = useGlobal();
  const [isRewardingPaused, setIsRewardingPauseed] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [visibleIndicator, setVisibleIndicator] = useState(false);
  const [depositMoney, setDepositMoney] = useState('');
  const [teamWalletAddress, setTeamWalletAddress] = useState('');
  const [checkTeamWallet, setCheckTeamWallet] = useState(false);
  const [balance, setBalance] = useState(0);

  const handleChangeCheckTeamWallet = event => {
    setCheckTeamWallet(event.target.checked);
  };

  const token = authService.getToken();
  if (!token) {
    history.push('/login');
    window.location.reload();
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const SIPContract = new ethers.Contract(
    process.env.REACT_APP_NFT_ADDRESS,
    ContractAbi,
    provider.getSigner()
  );

  const handleChangeDepositMoney = e => {
    setDepositMoney(e.target.value);
  };

  const handleClickWithdraw = async () => {
    setVisibleIndicator(true);
    try {
      await SIPContract.withdrawAll()
        .then(tx => {
          return tx.wait().then(
            receipt => {
              setVisibleIndicator(false);
              // This is entered if the transaction receipt indicates success
              console.log('receipt', receipt);
              ToastsStore.success('Withdraw Success!');
              return true;
            },
            error => {
              setVisibleIndicator(false);
              console.log('error', error);
              ToastsStore.error('Withdraw Fail!');
            }
          );
        })
        .catch(error => {
          console.log(error);
          setVisibleIndicator(false);
          if (error.message.indexOf('signature')) {
            ToastsStore.error('You canceled transaction!');
          } else {
            ToastsStore.error('Transaction Error!');
          }
        });
    } catch (error) {
      setVisibleIndicator(false);
      console.log('Withdraw error', error);
    }
  };

  const handleClickDistribute = async () => {
    if (checkTeamWallet) {
      if (teamWalletAddress == '') {
        ToastsStore.warning('Please input the team wallet address!');
        return;
      }

      setVisibleIndicator(true);
      await SIPContract.setTeamWalletAddress(teamWalletAddress)
        .then(tx => {
          return tx.wait().then(
            receipt => {
              setVisibleIndicator(false);
              // This is entered if the transaction receipt indicates success
              console.log('receipt', receipt);
              return true;
            },
            error => {
              setVisibleIndicator(false);
              console.log('error', error);
              ToastsStore.error('Failed to set team wallet address!');
            }
          );
        })
        .catch(error => {
          setVisibleIndicator(false);
          console.log(error);
          if (error.message.indexOf('signature')) {
            ToastsStore.error('You canceled transaction!');
          } else {
            ToastsStore.error('Transaction Error!');
          }
        });
    }
    setVisibleIndicator(true);
    try {
      await SIPContract.distributeAll()
        .then(tx => {
          return tx.wait().then(
            receipt => {
              setVisibleIndicator(false);
              // This is entered if the transaction receipt indicates success
              console.log('receipt', receipt);
              ToastsStore.success('Distribute Success!');
              return true;
            },
            error => {
              setVisibleIndicator(false);
              console.log('error', error);
              ToastsStore.error('Distribute Fail!');
            }
          );
        })
        .catch(error => {
          setVisibleIndicator(false);
          console.log(error);
          if (error.message.indexOf('signature')) {
            ToastsStore.error('You canceled transaction!');
          } else {
            ToastsStore.error('Transaction Error!');
          }
        });
    } catch (error) {
      setVisibleIndicator(false);
      console.log('Distribute error', error);
    }
  };
  const handleClickDeposit = async () => {
    if (depositMoney == '') {
      ToastsStore.warning('Please input the deposit money!');
      return;
    }

    const depo_val = parseFloat(depositMoney) * Math.pow(10, 18);
    if (!depo_val || depo_val === 0) {
      ToastsStore.warning('Please input the correct value!');
      return;
    }
    setVisibleIndicator(true);
    await SIPContract.deposit({
      value: depo_val.toString()
    })
      .then(tx => {
        return tx.wait().then(
          receipt => {
            setVisibleIndicator(false);
            // This is entered if the transaction receipt indicates success
            console.log('receipt', receipt);
            return true;
          },
          error => {
            setVisibleIndicator(false);
            console.log('error', error);
            ToastsStore.error('Failed to deposit money!');
          }
        );
      })
      .catch(error => {
        setVisibleIndicator(false);
        console.log(error);
        if (error.message.indexOf('signature')) {
          ToastsStore.error('You canceled transaction!');
        } else {
          ToastsStore.error('Transaction Error!');
        }
      });
  };

  // If the wallet is connected, all three values will be set. Use to display the main nav below.
  const contractAvailable = !(
    !globalState.web3props.web3 &&
    !globalState.web3props.accounts &&
    !globalState.web3props.contract
  );
  // Grab the connected wallet address, if available, to pass into the Login component
  const walletAddress = globalState.web3props.accounts
    ? globalState.web3props.accounts[0]
    : '';

  useEffect(() => {
    setVisibleIndicator(true);
    async function getPrams() {
      await getParams();
    }
    getPrams();
    setVisibleIndicator(false);
  }, [globalState.web3props]);

  const getParams = async () => {
    let rewardingPauseVal = await SIPContract.REWARDING_PAUSED();
    setIsRewardingPauseed(rewardingPauseVal);

    let _balance = ethers.utils.formatEther(await SIPContract.balance());
    setBalance(parseFloat(parseInt(_balance * 100) / 100));

    let ownerAddress = await SIPContract.owner();
    if (ownerAddress == walletAddress) {
      setIsOwner(true);
    }
  };

  const handleChangeTeamWalletAddress = e => {
    setTeamWalletAddress(e.target.value);
  };
  return (
    <div className={classes.root}>
      {visibleIndicator ? (
        <div className={classes.div_indicator}>
          {' '}
          <CircularProgress className={classes.indicator} />{' '}
        </div>
      ) : null}
      <div className={classes.title}>
        <Grid item xs={12} sm={6} container>
          <Grid item>
            <Typography variant="h1">
              <b>Administrator</b>
            </Typography>
          </Grid>
        </Grid>
      </div>
      <div className={classes.body}>
        <Grid container direction="column" spacing={3}>
          <Grid item container alignItems="center" spacing={3}>
            <Grid item style={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                variant="outlined"
                fullWidth
                value={depositMoney}
                onChange={handleChangeDepositMoney}
                placeholder="Please input the deposit money..."
              />
              <span style={{ marginLeft: 20 }}>MATIC</span>
            </Grid>
            <Grid item>
              <MyButton
                name={'Deposit Money'}
                color={'1'}
                onClick={handleClickDeposit}
                disabled={!isOwner}
              />
            </Grid>
            <Grid item>
              <MyButton
                name={'WithDraw Money'}
                color={'1'}
                onClick={handleClickWithdraw}
                disabled={!isOwner}
              />
            </Grid>
          </Grid>
          <Grid item container direction="row-reverse">
            <Grid item style={{ display: 'flex', alignItems: 'center' }}>
              <h3>Contract Balance :</h3>
              <span style={{ marginLeft: 10 }}>{balance} Matic</span>
            </Grid>
          </Grid>
          <Grid item container alignItems="center" spacing={3}>
            {checkTeamWallet && (
              <Grid item>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={teamWalletAddress}
                  onChange={handleChangeTeamWalletAddress}
                  placeholder="Please input the team wallet address..."
                />
              </Grid>
            )}
            <Grid item>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkTeamWallet}
                    onChange={handleChangeCheckTeamWallet}
                    name="checkedB"
                    color="primary"
                  />
                }
                label="Set the Team Wallet Address"
              />
            </Grid>
            <Grid item>
              <MyButton
                name={'Distribute Money'}
                color={'1'}
                onClick={handleClickDistribute}
                disabled={isRewardingPaused || !isOwner}
              />
            </Grid>
            <Grid item>
              <span>
                * Please check this checkbox to set the new team wallet address.
                If you don't check this, you will use the old team wallet
                address that you set before
              </span>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <ToastsContainer
        store={ToastsStore}
        position={ToastsContainerPosition.TOP_RIGHT}
      />
    </div>
  );
};

export default Main;
