import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import useStyles from './useStyles';
import MyButton from 'components/MyButton';
import authService from 'services/authService';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import ContractAbi from '../../config/StakeInPool.json';
import { ethers } from "ethers";
import CircularProgress from '@material-ui/core/CircularProgress';
import useGlobal from 'Global/global';

const Main = (props) => {
  const { history } = props;
  const classes = useStyles();
  const cellList = [20, 50, 100, 200];
  const incomeDirection = 2;
  const incomeColor = "#FC5555";//#2DCE9C
  const [globalState, globalActions] = useGlobal();
  const [isRewardingPaused, setIsRewardingPauseed] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [visibleIndicator, setVisibleIndicator] = useState(false);
  const [withDrawMoney, setWithDrawMoney] = useState('$0');
  const [depositMoney, setDepositMoney] = useState('0');
  const [teamWalletAddress, setTeamWalletAddress] = useState('');
  const token = authService.getToken();
  if (!token) {
    history.push("/login");
    window.location.reload();
  }
  const handleChangeWithDrawMoney = (e) => {
    if (e.target.value == '')
        setWithDrawMoney('$');
    else
        setWithDrawMoney(e.target.value);
  }

  const handleChangeDepositMoney = (e) => {
    setDepositMoney(e.target.value);
  }

  const handleClickWithdraw = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const SIPContract = new ethers.Contract(
      process.env.REACT_APP_NFT_ADDRESS,
      ContractAbi,
      provider.getSigner()
    );
    setVisibleIndicator(true);
    try {
        await SIPContract.withdrawAll()
          .then((tx) => {
            return tx.wait().then(
              (receipt) => {
                setVisibleIndicator(false);
                // This is entered if the transaction receipt indicates success
                console.log("receipt", receipt);
                ToastsStore.success("Withdraw Success!");
                return true;
              },
              (error) => {
                setVisibleIndicator(false);
                console.log("error", error);
                ToastsStore.error("Withdraw Fail!");
              }
            );
          })
          .catch((error) => {
            console.log(error);
            setVisibleIndicator(false);
            if (error.message.indexOf("signature")) {
                ToastsStore.error("You canceled transaction!");
            } else {
                ToastsStore.error("Transaction Error!");
            }
          });
      } catch (error) {
        setVisibleIndicator(false);
        console.log("Withdraw error", error);
      }
  }

  const handleClickDistribute = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const SIPContract = new ethers.Contract(
      process.env.REACT_APP_NFT_ADDRESS,
      ContractAbi,
      provider.getSigner()
    );
    setVisibleIndicator(true);
    try {
        await SIPContract.distributeAll()
          .then((tx) => {
            return tx.wait().then(
              (receipt) => {
                setVisibleIndicator(false);
                // This is entered if the transaction receipt indicates success
                console.log("receipt", receipt);
                ToastsStore.success("Distribute Success!");
                return true;
              },
              (error) => {
                setVisibleIndicator(false);
                console.log("error", error);
                ToastsStore.error("Distribute Fail!");
              }
            );
          })
          .catch((error) => {
            setVisibleIndicator(false);
            console.log(error);
            if (error.message.indexOf("signature")) {
                ToastsStore.error("You canceled transaction!");
            } else {
                ToastsStore.error("Transaction Error!");
            }
          });
      } catch (error) {
        setVisibleIndicator(false);
        console.log("Distribute error", error);
      }
  }
  const handleClickDeposit = async () => {
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const SIPContract = new ethers.Contract(
    //   process.env.REACT_APP_NFT_ADDRESS,
    //   ContractAbi,
    //   provider.getSigner()
    // );
    // setVisibleIndicator(true);
    // try {
    //     await SIPContract.distributeAll()
    //       .then((tx) => {
    //         return tx.wait().then(
    //           (receipt) => {
    //             setVisibleIndicator(false);
    //             // This is entered if the transaction receipt indicates success
    //             console.log("receipt", receipt);
    //             ToastsStore.success("Distribute Success!");
    //             return true;
    //           },
    //           (error) => {
    //             setVisibleIndicator(false);
    //             console.log("error", error);
    //             ToastsStore.error("Distribute Fail!");
    //           }
    //         );
    //       })
    //       .catch((error) => {
    //         setVisibleIndicator(false);
    //         console.log(error);
    //         if (error.message.indexOf("signature")) {
    //             ToastsStore.error("You canceled transaction!");
    //         } else {
    //             ToastsStore.error("Transaction Error!");
    //         }
    //       });
    //   } catch (error) {
    //     setVisibleIndicator(false);
    //     console.log("Distribute error", error);
    //   }
  }

    // If the wallet is connected, all three values will be set. Use to display the main nav below.
    const contractAvailable = !(
        !globalState.web3props.web3 &&
        !globalState.web3props.accounts &&
        !globalState.web3props.contract
    );
    // Grab the connected wallet address, if available, to pass into the Login component
    const walletAddress = globalState.web3props.accounts ? globalState.web3props.accounts[0] : "";

  useEffect(() => {
    setVisibleIndicator(true);
    async function getPrams() {
        await getParams();
    }
    getPrams();
    setVisibleIndicator(false);
}, [globalState.web3props]);

  const getParams = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const SIPContract = new ethers.Contract(
      process.env.REACT_APP_NFT_ADDRESS,
      ContractAbi,
      provider.getSigner()
    );
    
    // provider.getBalance(walletAddress).then((balance) => {
    //   const balanceInMatic = ethers.utils.formatEther(balance);
    //   setBalMatic(balanceInMatic);
    // });

    let mintingPauseVal = await SIPContract.MINTING_PAUSED();
    let rewardingPauseVal = await SIPContract.REWARDING_PAUSED();
    setIsRewardingPauseed(rewardingPauseVal);

    let ownerAddress = await SIPContract.owner();
    if (ownerAddress == walletAddress) {
        setIsOwner(true);
    }
    // setIsPaused(pauseVal);

    // let _purLimit = web3.utils.toDecimal(await SIPContract.maxItemsPerWallet());
    // setPurLimit(_purLimit);
    // let totalSupply = web3.utils.toDecimal(await SIPContract.totalSupply());
    // let _balance = web3.utils.toDecimal(
    //   await SIPContract.balanceOf(walletAddress)
    // );
    // setBalance(_balance);
    // let _mintedCNT = await SIPContract.mintedCnt();
    // let _tmp = [];
    // for (let i = 0; i < _mintedCNT.length; i++) {
    //   _tmp[i] = web3.utils.toDecimal(_mintedCNT[i]);
    // }
    // setMintedCNT(_tmp);

    // if (totalSupply === MAX_ELEMENTS) {
    //   console.log("Sold Out");
    // }
  };

  const handleChangeTeamWalletAddress = (e) => {
      setTeamWalletAddress(e.target.value);
  }
  return (
    <div className={classes.root}>
        {
            visibleIndicator ? <div className={classes.div_indicator}> <CircularProgress className={classes.indicator} /> </div> : null
        }
      <div className={classes.title}>
        <Grid item xs={12} sm={6} container>
          <Grid item>
            <Typography variant="h2" className={classes.titleText}>
              <b>Administrator</b>
            </Typography>
          </Grid>
        </Grid>
      </div>
      <div className={classes.body}>
        <Grid container direction="column" spacing={3}>
            <Grid item container alignItems='center' spacing={3}>
                <Grid item style={{width: '60%', display: 'flex', alignItems: 'center'}}>
                    <TextField
                        variant="outlined"
                        fullWidth
                        value={depositMoney}
                        onChange={handleChangeDepositMoney}
                        placeholder="Please input the team wallet address..."
                    />
                    <span style={{marginLeft: 20}}>MATIC</span>
                </Grid>
                <Grid item>
                    <MyButton
                        name={"Deposit Money"}
                        color={"1"}
                        onClick={handleClickDeposit}
                        disabled={isRewardingPaused || !isOwner}
                    />
                </Grid>
            </Grid>
            <Grid item container alignItems='center' spacing={3}>
                <Grid item>
                    <MyButton
                        name={"WithDraw Money"}
                        color={"1"}
                        onClick={handleClickWithdraw}
                        disabled={isRewardingPaused || !isOwner}
                    />
                </Grid>
                <Grid item>
                    <TextField
                        variant="outlined"
                        fullWidth
                        value={withDrawMoney}
                        onChange={handleChangeWithDrawMoney}
                    />
                </Grid>
            </Grid>
            <Grid item container alignItems='center' spacing={3}>
                <Grid item style={{width: '60%'}}>
                    <TextField
                        variant="outlined"
                        fullWidth
                        value={teamWalletAddress}
                        onChange={handleChangeTeamWalletAddress}
                        placeholder="Please input the team wallet address..."
                    />
                </Grid>
                <Grid item>
                    <MyButton
                        name={"Distribute Money"}
                        color={"1"}
                        onClick={handleClickDistribute}
                        disabled={isRewardingPaused || !isOwner}
                    />
                </Grid>
            </Grid>
        </Grid>
      </div>
      <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
    </div>
  );
};

export default Main;
