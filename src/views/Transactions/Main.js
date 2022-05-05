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
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Tooltip from '@material-ui/core/Tooltip';
import axios from 'axios';
import { useEthers } from "@usedapp/core";
import VoteTable from 'components/VoteTable';

const Main = props => {
  const { history } = props;
  const classes = useStyles();
  const { account } = useEthers();
  const [isRewardingPaused, setIsRewardingPauseed] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [visibleIndicator, setVisibleIndicator] = useState(false);
  const [depositMoney, setDepositMoney] = useState('');
  const [teamWalletAddress, setTeamWalletAddress] = useState('');
  const [donationWalletAddress, setDonationWalletAddress] = useState('');
  const [voteQuestion, setVoteQuestion] = useState('');
  const [balance, setBalance] = useState(0);

  const [totalpage, setTotalPage] = useState(1);
  const [row_count, setRowCount] = useState(20);
  const [page_num, setPageNum] = useState(1);
  const [sort_column, setSortColumn] = useState(-1);
  const [sort_method, setSortMethod] = useState('asc');
  const [dataList, setDataList] = useState([]);
  const [state, setState] = useState(false);
  const selectList = [20, 50, 100, 200, -1];
  const cellList = [
    { key: 'quiz', field: 'Vote Question' },
    { key: 'yesCnt', field: 'Yes State' },
    { key: 'noCnt', field: 'No State' },
  ];
  const columns = [];
  for (let i = 0; i < 3; i++) columns[i] = 'asc';
  const [footerItems, setFooterItems] = useState([]);

  const handleChangeSelect = value => {
    setRowCount(selectList[value]);
  };
  const handleChangePagination = value => {
    setPageNum(value);
  };
  const handleSort = (index, direct) => {
    setSortColumn(index);
    setSortMethod(direct);
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

  useEffect(() => {
    setVisibleIndicator(true);
    async function getPrams() {
      await getParams();
    }
    getPrams();
    setVisibleIndicator(false);
  }, [account]);

  const getVoteList = () => {
    const URL = process.env.REACT_APP_BACKEND_API_URL + "api/admin/vote";

    axios.get(URL)
    .then(
      response => {
        const data = response.data;
        setDataList(data.votes);
      },
      error => {
        ToastsStore.error("Can't connect to the Server!");
      }
    );
  }
  
  useEffect(() => {
    getVoteList();
  }, []);

  const getParams = async () => {
    let rewardingPauseVal = await SIPContract.REWARDING_PAUSED();
    setIsRewardingPauseed(rewardingPauseVal);

    let _balance = ethers.utils.formatEther(await SIPContract.balance());
    setBalance(parseFloat(parseInt(_balance * 100) / 100));

    let ownerAddress = await SIPContract.owner();
    if (ownerAddress == account) {
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
        const data = response.data;
        if (data.success) {
            getVoteList();
        } else {
            ToastsStore.error("Can't save the new vote!");
        }
      },
      error => {
        ToastsStore.error("Can't connect to the Server!");
      }
    );
  }
  
  const handleClickDelete = (id) => {
    const URL = process.env.REACT_APP_BACKEND_API_URL + "api/admin/vote";

    axios.delete(URL + "/" + id, {})
    .then(
      response => {
        const data = response.data;
        if (data.success) {
            getVoteList();
        } else {
            ToastsStore.error("Can't delete the selected vote!");
        }
      },
      error => {
        ToastsStore.error("Can't connect to the Server!");
      }
    );
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
          <Grid item>
              <VoteTable
                onChangeSelect={handleChangeSelect}
                onChangePage={handleChangePagination}
                onSelectSort={handleSort}
                onClickDelete={handleClickDelete}
                page={page_num}
                columns={columns}
                products={dataList}
                state={state}
                totalpage={totalpage}
                cells={cellList}
                tblFooter="true"
                footerItems={footerItems}
              />
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
