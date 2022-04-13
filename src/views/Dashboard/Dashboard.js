import React, { useState, useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';
import useStyles from './useStyles';
import MyButton from 'components/MyButton';
import authService from 'services/authService';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import ContractAbi from '../../config/StakeInPool.json';
import { ethers } from "ethers";
import CircularProgress from '@material-ui/core/CircularProgress';

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
  const [visibleIndicator, setVisibleIndicator] = useState(false);
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
                        onClick={handleClickWithdraw}
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
                        onClick={handleClickDistribute}
                    />
                </Grid>
                <Grid item style={{width: '50%'}}>
                {
                    visibleIndicator ? <div className={classes.div_indicator}> <CircularProgress className={classes.indicator} /> </div> : null
                }
                </Grid>
            </Grid>
        </Grid>
      </div>
      <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
    </div>
  );
};

export default Dashboard;
