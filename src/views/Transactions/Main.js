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
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Tooltip from '@material-ui/core/Tooltip';
import axios from 'axios';

const Main = props => {
  const { history } = props;
  const classes = useStyles();
  const [globalState, globalActions] = useGlobal();
  const [isRewardingPaused, setIsRewardingPauseed] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [visibleIndicator, setVisibleIndicator] = useState(false);
  const [depositMoney, setDepositMoney] = useState('');
  const [teamWalletAddress, setTeamWalletAddress] = useState('');
  const [donationWalletAddress, setDonationWalletAddress] = useState('');
  const [voteQuestion, setVoteQuestion] = useState('');
  const [balance, setBalance] = useState(0);

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

  const handleClickSetTeamWallet = async () => {
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

  const handleChangeDonationWalletAddress = e => {
    setDonationWalletAddress(e.target.value);
  };

  
  const handleClickSetDonationWallet = async () => {
    if (donationWalletAddress == '') {
      ToastsStore.warning('Please input the donation wallet address!');
      return;
    }

    setVisibleIndicator(true);
    await SIPContract.setDonationWalletAddress(donationWalletAddress)
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
            ToastsStore.error('Failed to set donation wallet address!');
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

  const handleChangeVoteQuestion = e => {
    setVoteQuestion(e.target.value);
  };

  const handleClickSaveVoteQuestion = () => {
    const URL = process.env.REACT_APP_BACKEND_API_URL + "api/admin/vote";
    const data = {
        vote_question: voteQuestion
    };

    axios.post(URL, data, {})
    .then(
      response => {
        console.log("==== res:", response);
      },
      error => {
        ToastsStore.error("Can't connect to the Server!");
      }
    );
  }

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
            <Typography variant="h1" style={{color: 'white'}}>
              <b>Administrator</b>
            </Typography>
          </Grid>
        </Grid>
      </div>
      <div className={classes.body}>
        <Grid container direction="column" spacing={3}>
          <Grid item container alignItems="center" spacing={3}>
            <Grid item style={{ display: 'flex', alignItems: 'center' }} xs={12} md={6} lg={4}>
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
                color={'1'}
                name={
                  <>
                    Deposit Money
                    <Tooltip title="Please deposit the money." arrow placement="top" classes={{tooltip : classes.tooltip, arrow: classes.arrow}}>
                      <HelpOutlineIcon style={{marginLeft: 10, cursor: 'pointer'}} />
                    </Tooltip>
                  </>
                }
                onClick={handleClickDeposit}
                disabled={!isOwner}
                style={{color: !isOwner ? 'grey' : 'white'}}
              />
            </Grid>
            <Grid item>
              <MyButton
                color={'1'}
                name={
                  <>
                    WithDraw All
                    <Tooltip title="Please withdraw the money." arrow placement="top" classes={{tooltip : classes.tooltip, arrow: classes.arrow}}>
                      <HelpOutlineIcon style={{marginLeft: 10, cursor: 'pointer'}} />
                    </Tooltip>
                  </>
                }
                onClick={handleClickWithdraw}
                disabled={!isOwner}
                style={{color: !isOwner ? 'grey' : 'white'}}
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
            <Grid item xs={12} md={6} lg={4}>
              <TextField
                variant="outlined"
                fullWidth
                value={teamWalletAddress}
                onChange={handleChangeTeamWalletAddress}
                placeholder="Please input the team wallet address..."
                className={classes.textField}
              />
            </Grid>
            <Grid item>
              <MyButton
                color={'1'}
                name={
                  <>
                    Set Team Wallet
                    <Tooltip title="Pleasee set the team wallet address." arrow placement="top" classes={{tooltip : classes.tooltip, arrow: classes.arrow}}>
                      <HelpOutlineIcon style={{marginLeft: 10, cursor: 'pointer'}} />
                    </Tooltip>
                  </>
                }
                onClick={handleClickSetTeamWallet}
                disabled={!isOwner}
                style={{color: !isOwner ? 'grey' : 'white'}}
              />
            </Grid>
          </Grid>
          <Grid item container alignItems="center" spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <TextField
                variant="outlined"
                fullWidth
                value={donationWalletAddress}
                onChange={handleChangeDonationWalletAddress}
                placeholder="Please input the donation wallet address..."
                className={classes.textField}
              />
            </Grid>
            <Grid item>
              <MyButton
                color={'1'}
                name={
                  <>
                    Set Donation Wallet 
                    <Tooltip title="Please set the donation wallet address." arrow placement="top" classes={{tooltip : classes.tooltip, arrow: classes.arrow}}>
                      <HelpOutlineIcon style={{marginLeft: 10, cursor: 'pointer'}} />
                    </Tooltip>
                  </>
                }
                onClick={handleClickSetDonationWallet}
                disabled={!isOwner}
                style={{color: !isOwner ? 'grey' : 'white'}}
              />
            </Grid>
          </Grid>
          <Grid item container alignItems="center" spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <TextField
                variant="outlined"
                fullWidth
                value={voteQuestion}
                onChange={handleChangeVoteQuestion}
                placeholder="Please input the question text to vote."
                className={classes.textField}
              />
            </Grid>
            <Grid item>
              <MyButton
                color={'1'}
                name={
                  <>
                    Save
                    <Tooltip title="Save the vote question." arrow placement="top" classes={{tooltip : classes.tooltip, arrow: classes.arrow}}>
                      <HelpOutlineIcon style={{marginLeft: 10, cursor: 'pointer'}} />
                    </Tooltip>
                  </>
                }
                onClick={handleClickSaveVoteQuestion}
                disabled={!isOwner}
                style={{color: !isOwner ? 'grey' : 'white'}}
              />
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
