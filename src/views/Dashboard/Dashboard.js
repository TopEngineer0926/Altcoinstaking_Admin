import React, { useState, useEffect } from 'react';
import {
  ToastsContainer,
  ToastsContainerPosition,
  ToastsStore
} from 'react-toasts';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router-dom';
import authService from '../../services/authService.js';
import useStyles from './useStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import AdminService from 'services/api.js';
import useGlobal from 'Global/global';
import SelectTable from '../../components/SelectTable';
import MyTableCard from '../../components/MyTableCard';
import ContractAbi from '../../config/StakeInPool.json';
import { ethers } from 'ethers';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import FormControl from '@material-ui/core/FormControl';
import web3 from 'web3';
import MyButton from 'components/MyButton';
import axios from 'axios';
import Web3 from "web3";

const Dashboard = props => {
  const { history } = props;
  const token = authService.getToken();
  if (!token) {
    window.location.replace('/login');
  }
  const [globalState, globalActions] = useGlobal();
  const classes = useStyles();
  const [visibleIndicator, setVisibleIndicator] = React.useState(false);

  const [totalpage, setTotalPage] = useState(1);
  const [row_count, setRowCount] = useState(20);
  const [page_num, setPageNum] = useState(1);
  const [sort_column, setSortColumn] = useState(-1);
  const [sort_method, setSortMethod] = useState('asc');
  const selectList = [20, 50, 100, 200, -1];
  const [isOwner, setIsOwner] = useState(false);
  const [state, setState] = useState(false);
  const [balance, setBalance] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const cellList = [
    { key: 'address', field: 'Address' },
    { key: 'transaction', field: 'Txn Hash' },
    { key: 'blockNumber', field: 'Block' },
    { key: 'date', field: 'Date' },
    { key: 'reward', field: 'Reward' },
  ];
  const STAGE = ['First Stage', 'Second Stage', 'Last Stage'];
  // const MAX_ELEMENTS = [3800, 2500, 1900, 1000, 800];
  const MAX_ELEMENTS = {
    0: [2923, 250, 100, 50, 10],
    1: [2633, 300, 150, 200, 50],
    2: [2000, 400, 300, 400, 233]
  };
  // UNITS_BATCH[0] = [2923, 250, 100, 50, 10];
  // UNITS_BATCH[1] = [2633, 300, 150, 200, 50];
  // UNITS_BATCH[2] = [2000, 400, 300, 400, 233];
  // _tokenIdTracker[0] = [0, 2923, 3173, 3273, 3323];
  // _tokenIdTracker[1] = [3333, 5966, 6266, 6416, 6616];
  // _tokenIdTracker[2] = [6666, 8666, 9066, 9366, 9766];
  // const LEVEL_MAX = [3800, 6300, 8200, 9200, 10000];
  const LEVEL_MAX = {
    0: [2923, 3173, 3273, 3323, 3333],
    1: [5966, 6266, 6416, 6616, 6666],
    2: [8666, 9066, 9366, 9766, 9999]
  }
  const [cardDataList, setCardDataList] = useState([
    { level: 'Starter', minted: `0 / ${MAX_ELEMENTS[0][0]}` },
    { level: 'Bronze', minted: `0 / ${MAX_ELEMENTS[0][1]}` },
    { level: 'Silver', minted: `0 / ${MAX_ELEMENTS[0][2]}` },
    { level: 'Gold', minted: `0 / ${MAX_ELEMENTS[0][3]}` },
    { level: 'Platinum', minted: `0 / ${MAX_ELEMENTS[0][4]}` }
  ]);
  const columns = [];
  for (let i = 0; i < 7; i++) columns[i] = 'asc';

  const [dataList, setDataList] = useState([]);
  const [stateSwitch, setStateSwitch] = React.useState({
    mint_state: false,
    distribute_state: false
  });

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const SIPContract = new ethers.Contract(
    process.env.REACT_APP_NFT_ADDRESS,
    ContractAbi,
    provider.getSigner()
  );

  const handleChangeSwitch = async event => {
    if (!contractAvailable) {
      ToastsStore.warning('Please connect your wallet!');
      return;
    }
    if (!isOwner) {
      ToastsStore.warning('You must be a owner!');
      return;
    }

    setVisibleIndicator(true);
    if (event.target.name == 'mint_state') {
      try {
        await SIPContract.setMintPaused(!event.target.checked)
          .then(tx => {
            return tx.wait().then(
              receipt => {
                // This is entered if the transaction receipt indicates success
                console.log('receipt', receipt);
                setStateSwitch({
                  ...stateSwitch,
                  mint_state: !stateSwitch.mint_state
                });
                ToastsStore.success('Updated status!');
                return true;
              },
              error => {
                console.log('error', error);
                ToastsStore.error('Failed updating status');
              }
            );
          })
          .catch(error => {
            console.log(error);
            if (error.message.indexOf('signature')) {
              ToastsStore.error('You canceled transaction!');
            } else {
              ToastsStore.error('Transaction Error!');
            }
          });
      } catch (e) {}
    } else if (event.target.name == 'distribute_state') {
      try {
        await SIPContract.setRewardingPaused(!event.target.checked)
          .then(tx => {
            return tx.wait().then(
              receipt => {
                // This is entered if the transaction receipt indicates success
                console.log('receipt', receipt);
                ToastsStore.success('Updated status!');
                setStateSwitch({
                  ...stateSwitch,
                  distribute_state: !stateSwitch.distribute_state
                });
                return true;
              },
              error => {
                console.log('error', error);
                ToastsStore.error('Failed updating status');
              }
            );
          })
          .catch(error => {
            console.log(error);
            if (error.message.indexOf('signature')) {
              ToastsStore.error('You canceled transaction!');
            } else {
              ToastsStore.error('Transaction Error!');
            }
          });
      } catch (e) {}
    }
    setVisibleIndicator(false);
  };

  const cardCellList = [
    { key: 'level', field: 'Level' },
    { key: 'minted', field: 'Minted Status' }
  ];

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

  useEffect(() => {
    async function getPrams() {
      await switchNetwork(process.env.REACT_APP_CHAIN_ID);
      await getParams();
    }
    getPrams();
  }, [globalState]);

  async function switchNetwork(chain) {
    console.log("window.ethereum", window.ethereum);
    if (window.ethereum) {
      await window.ethereum
        .request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: Web3.utils.toHex(chain) }],
        })
        .then((res) => {
          console.log("switch network success!");
          // setChainning(false);
        })
        .catch((err) => {
          console.log("switch network error: ", err.message);
          // setChainning(true);
        });
    }
  }
  
  const getParams = async () => {
    // setVisibleIndicator(true);
    let mintingPauseVal = await SIPContract.MINTING_PAUSED();
    let rewardingPauseVal = await SIPContract.REWARDING_PAUSED();
    setStateSwitch({
      mint_state: !mintingPauseVal,
      distribute_state: !rewardingPauseVal
    });

    let _currentStage = await SIPContract.CURRENT_STAGE();
    console.log("==== current stage: ", _currentStage);
    _currentStage = web3.utils.toDecimal(_currentStage);
    setCurrentStage(_currentStage);

    let ownerAddress = await SIPContract.owner();
    if (ownerAddress == walletAddress) {
      setIsOwner(true);
    }

    let _balance = ethers.utils.formatEther(await SIPContract.balance());
    setBalance(parseFloat(parseInt(_balance * 100) / 100));

    let _mintedCNT = await SIPContract.mintedCnt(_currentStage);
    let _tmp = [];
    for (let i = 0; i < _mintedCNT.length; i++) {
      _tmp[i] = web3.utils.toDecimal(_mintedCNT[i]);
    }

    setCardDataList([
      {
        level: 'Starter',
        minted: `${_tmp[0]} / ${MAX_ELEMENTS[_currentStage][0]}`
      },
      {
        level: 'Bronze',
        minted: `${_tmp[1]} / ${MAX_ELEMENTS[_currentStage][1]}`
      },
      {
        level: 'Silver',
        minted: `${_tmp[2]} / ${MAX_ELEMENTS[_currentStage][2]}`
      },
      {
        level: 'Gold',
        minted: `${_tmp[3]} / ${MAX_ELEMENTS[_currentStage][3]}`
      },
      {
        level: 'Platinum',
        minted: `${_tmp[4]} / ${MAX_ELEMENTS[_currentStage][4]}`
      }
    ]);

    setVisibleIndicator(false);

    getClaimList();
  };

  const getClaimList = () => {
    const URL = process.env.REACT_APP_POLYGONSCAN_API_URL + "?module=logs&action=getLogs&fromBlock=0&toBlock=99999999&" +
      "address=" + process.env.REACT_APP_NFT_ADDRESS + "&topic0=" + process.env.REACT_APP_CLAIM_TOPIC + 
      "&apikey=" + process.env.REACT_APP_POLYGONSCAN_API_KEY;
    axios.get(URL)
    .then(
      response => {
        if (response.data.status != 1) {
          ToastsStore.error(response.data.message);
        } else {
          if (response.data.message == "OK") {
            const result = response.data.result;
            let _dataList = [];

            for (let i = 0; i < result.length; i++) {
              const claimAddress = "0x" + result[i].topics[1].slice(result[i].topics[1].length - 40, result[i].topics[1].length);
              const data = {
                address: claimAddress.slice(0, 20) + "...",
                reward: parseFloat(parseInt(result[i].topics[2]) / Math.pow(10, 18)).toFixed(3) + " Matic",
                date: new Date(web3.utils.toDecimal(result[i].timeStamp) * 1000).toLocaleDateString("en-US"),
                blockNumber: web3.utils.toDecimal(result[i].blockNumber),
                transaction: result[i].transactionHash
              }

              _dataList.push(data);
            }

            setDataList(_dataList);
          }
        }
      },
      error => {
        ToastsStore.error("Can't connect to the Server!");
      }
    );;
  }

  const handleClickClaim = async () => {
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
        <Grid item container justify="space-around" alignItems="center">
          <Grid item xs={12} sm={6} container justify="flex-start">
            <Grid item>
              <Typography variant="h1" style={{color: 'white'}}>
                <b>Dashboard</b>
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6} container justify="flex-end"></Grid>
        </Grid>
      </div>
      <div className={classes.tool}>
        <Grid container justify="space-between">
          <Grid item>
            <FormControl component="fieldset">
              <FormGroup style={{ alignItems: 'flex-end' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FormControlLabel
                    value="start"
                    control={
                      <Switch
                        checked={stateSwitch.mint_state}
                        onChange={handleChangeSwitch}
                        name="mint_state"
                        color="primary"
                      />
                    }
                    label="Minting"
                    labelPlacement="start"
                    classes={{ label: classes.titleText }}
                  />
                  <span style={{ marginLeft: 10 }}>
                    {stateSwitch.mint_state ? 'Active' : 'Paused'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FormControlLabel
                    value="start"
                    control={
                      <Switch
                        checked={stateSwitch.distribute_state}
                        onChange={handleChangeSwitch}
                        name="distribute_state"
                        color="primary"
                      />
                    }
                    label="Claiming"
                    labelPlacement="start"
                    classes={{ label: classes.titleText }}
                  />
                  <span style={{ marginLeft: 10 }}>
                    {stateSwitch.distribute_state ? 'Active' : 'Paused'}
                  </span>
                </div>
              </FormGroup>
            </FormControl>
          </Grid>
          <Grid item>
            <Grid container direction="column" spacing={2}>
              <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                <h3>Current Stage :</h3>
                <span style={{ marginLeft: 10 }}>{STAGE[currentStage]}</span>
              </Grid>
              <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                <h3>Contract Balance :</h3>
                <span style={{ marginLeft: 10 }}>{balance} Matic</span>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item sm={7}>
            <MyTableCard products={cardDataList} cells={cardCellList} />
          </Grid>
        </Grid>
      </div>
      <div className={classes.body}>
        <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: 20}}>
          <MyButton name='Claim' color={'1'} onClick={handleClickClaim} />
        </div>
        <SelectTable
          onChangeSelect={handleChangeSelect}
          onChangePage={handleChangePagination}
          onSelectSort={handleSort}
          page={page_num}
          columns={columns}
          products={dataList}
          state={state}
          totalpage={totalpage}
          cells={cellList}
          tblFooter="true"
          footerItems={footerItems}
        />
      </div>
      <ToastsContainer
        store={ToastsStore}
        position={ToastsContainerPosition.TOP_RIGHT}
      />
    </div>
  );
};

export default withRouter(Dashboard);
