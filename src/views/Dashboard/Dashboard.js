import React, { useState, useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';
import useStyles from './useStyles';
import MyButton from 'components/MyButton';
import authService from 'services/authService';

import ContractAbi from '../../config/StakeInPool.json';
import { ethers } from "ethers";

const BorderLinearProgress = withStyles((theme) => ({
    root: {
      height: 30,
      borderRadius: 5,
    },
    colorPrimary: {
      backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    //   background: 'linear-gradient(0deg, #00C9FF 30%, #0CC77C 100%)',
    },
    bar: {
      borderRadius: 5,
      backgroundColor: '#1a90ff',
    },
}))(LinearProgress);

const Dashboard = (props) => {
  const { history } = props;
  const classes = useStyles();
  const cellList = [20, 50, 100, 200];
  const incomeDirection = 2;
  const incomeColor = "#FC5555";//#2DCE9C
  const [withDrawMoney, setWithDrawMoney] = useState('$0');
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

  useEffect(async () => {
    await getParams();
  },[]);

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

    // let pauseVal = await SIPContract.MINTING_PAUSED();
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

  return (
    <div className={classes.root}>
      <div className={classes.title}>
        <Grid item xs={12} sm={6} container>
          <Grid item>
            <Typography variant="h2" className={classes.titleText}>
              <b>Dashboard</b>
            </Typography>
          </Grid>
        </Grid>
      </div>
      <div className={classes.body}>
        <Grid container direction="column" spacing={3}>
            <Grid item container alignItems='center' spacing={3}>
                <Grid item>
                    <MyButton
                        name={"WithDraw Money"}
                        color={"1"}
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
                <Grid item>
                    <MyButton
                        name={"Distribute Money"}
                        color={"1"}
                    />
                </Grid>
                <Grid item style={{width: '50%'}}>
                    <BorderLinearProgress variant="determinate" value={50} />
                </Grid>
            </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Dashboard;
