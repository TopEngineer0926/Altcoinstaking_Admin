import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
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
import web3 from 'web3';
import NFTCard from 'components/NFTCard';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
    root: {
      [theme.breakpoints.up('xl')]: {
        paddingLeft: theme.spacing(5),
        paddingRight: theme.spacing(4),
      },
      [theme.breakpoints.down('lg')]: {
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(3),
      },
      [theme.breakpoints.down('md')]: {
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(2),
      },
      [theme.breakpoints.down('sm')]: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
      },
    },
    title:{
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2)
    },
    titleText: {
      [theme.breakpoints.up('xl')]: {
        fontSize :25
      },
      [theme.breakpoints.down('lg')]: {
        fontSize :25
      },
      [theme.breakpoints.down('md')]: {
        fontSize :18
      },
      [theme.breakpoints.down('sm')]: {
        fontSize :13
      },
      color: 'white'
    },
  
    modalTitle: {
      [theme.breakpoints.up('xl')]: {
        fontSize :28
      },
      [theme.breakpoints.down('lg')]: {
        fontSize :20
      },
      [theme.breakpoints.down('md')]: {
        fontSize :14
      },
      [theme.breakpoints.down('sm')]: {
        fontSize :10
      },
    },
    tool: {
      [theme.breakpoints.up('xl')]: {
        minHeight: 67
      },
      [theme.breakpoints.down('lg')]: {
        minHeight: 47
      },
      [theme.breakpoints.down('md')]: {
        minHeight: 33
      },
    },
    body:{
      [theme.breakpoints.up('xl')]: {
        marginTop: 42
      },
      [theme.breakpoints.down('lg')]: {
        marginTop: 29
      },
      [theme.breakpoints.down('md')]: {
        marginTop: 20
      },
    },
    div_indicator: {
      width: '100%',
      height: '100%',
      display: 'flex',
      position: 'fixed',
      paddingLeft: '50%',
      alignItems: 'center',
      marginTop: '-60px',
      zIndex: 999,
    },
    indicator: {
      color: 'gray'
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    padding: {
      padding: theme.spacing(2, 4, 3),
    },
    close: {
      cursor: 'pointer',
      color: 'gray'
    },
    cardList: {
        display:'flex',
        flexWrap: 'wrap',
        margin: 45,
        alignItems:'center',
        justifyContent: 'center',
        marginBottom: '100px',
    }
  }));

const MyAccount = props => {
  const { history } = props;
  const classes = useStyles();
  const [nftList, setNFTList] = useState([]);
  const [globalState, globalActions] = useGlobal();
  const [isRewardingPaused, setIsRewardingPauseed] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [rewards, setRewards] = useState(0);
  let tokenIds = [];

  const [visibleIndicator, setVisibleIndicator] = useState(false);

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

  // const handleClickWithdraw = async () => {
  //   setVisibleIndicator(true);
  //   try {
  //     await SIPContract.withdrawAll()
  //       .then(tx => {
  //         return tx.wait().then(
  //           receipt => {
  //             setVisibleIndicator(false);
  //             // This is entered if the transaction receipt indicates success
  //             console.log('receipt', receipt);
  //             ToastsStore.success('Withdraw Success!');
  //             return true;
  //           },
  //           error => {
  //             setVisibleIndicator(false);
  //             console.log('error', error);
  //             ToastsStore.error('Withdraw Fail!');
  //           }
  //         );
  //       })
  //       .catch(error => {
  //         console.log(error);
  //         setVisibleIndicator(false);
  //         if (error.message.indexOf('signature')) {
  //           ToastsStore.error('You canceled transaction!');
  //         } else {
  //           ToastsStore.error('Transaction Error!');
  //         }
  //       });
  //   } catch (error) {
  //     setVisibleIndicator(false);
  //     console.log('Withdraw error', error);
  //   }
  // };

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

    let ownerAddress = await SIPContract.owner();
    if (ownerAddress == walletAddress) {
      setIsOwner(true);
    }

    if (walletAddress != '') {
      let _total = await SIPContract.balanceOf(walletAddress);
      _total = web3.utils.toDecimal(_total);

      let _rewards = 0;
      for (let i = 0; i < _total; i++) {
          let _tokenId = await SIPContract.tokenByIndex(i);
          tokenIds[i] = web3.utils.toDecimal(_tokenId);
          
          let _reward = await SIPContract.rewards(tokenIds[i]);
          _reward = web3.utils.toDecimal(_reward);
          _rewards += _reward;
      }

      setRewards(_rewards);
    }

    let baseTokenURI = await SIPContract.baseTokenURI();
    let _nftList = [];
    for (let i = 0; i < tokenIds.length; i++) {
        let tokenURI = baseTokenURI + tokenIds[i];
        await fetch("https://gateway.pinata.cloud/ipfs/QmQE6gXUwy8tGvkba8rPVx3R9Ti2kPE3KVtvqiXcRpaLib/43").then(res => res.json())
        .then(data => {
            _nftList.push({...data, tokenId: tokenIds[i]});
        }) 
    }
    setNFTList(_nftList);
  };

  
  const handleClickClaim = async () => {
    if (rewards == 0) {
        ToastsStore.warning("execution reverted: You haven't rewards to claim");
        return;
    }

    setVisibleIndicator(true);
    try {
      await SIPContract.claimRewards()
        .then(tx => {
          return tx.wait().then(
            receipt => {
              // This is entered if the transaction receipt indicates success
              console.log('receipt', receipt);
              ToastsStore.success('Claimed rewards successfully!');
              setVisibleIndicator(false);
              return true;
            },
            error => {
              console.log('error', error);
              setVisibleIndicator(false);
              ToastsStore.error('Failed claiming rewards!');
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
    } catch (e) {
      setVisibleIndicator(false);
    }
  }

  return (
    <div className={classes.root}>
      {visibleIndicator ? (
        <div className={classes.div_indicator}>
          <CircularProgress className={classes.indicator} />
        </div>
      ) : null}
      <div className={classes.title}>
        <Grid item xs={12} sm={6} container>
          <Grid item>
            <Typography variant="h1" style={{ color: 'white' }}>
              <b>My Account</b>
            </Typography>
          </Grid>
        </Grid>
      </div>
      <div className={classes.body}>
        <Grid container direction="column" spacing={3}>
            <Grid item style={{ display: 'flex', alignItems: 'center' }}>
              <h3>Total Rewards :</h3>
              <span style={{ marginLeft: 10 }}>{rewards} Matic</span>
            </Grid>
            <Grid item>
                <MyButton name='Claim' color={'1'} onClick={handleClickClaim} />
            </Grid>
        </Grid>
        <div className={classes.cardList}>
            <Grid container alignItems='center' justify='center' spacing={2}>
                {
                    nftList.map((item,index) => {
                        return (
                            <Grid item key={index}>
                                <NFTCard
                                    name={item.name}
                                    image={item.image}
                                    description={item.description}
                                    attributes={item.attributes}
                                    tokenId={item.tokenId}
                                />
                            </Grid>
                        )
                    })
                }
            </Grid>
        </div>
      </div>
      <ToastsContainer
        store={ToastsStore}
        position={ToastsContainerPosition.TOP_RIGHT}
      />
    </div>
  );
};

export default MyAccount;
