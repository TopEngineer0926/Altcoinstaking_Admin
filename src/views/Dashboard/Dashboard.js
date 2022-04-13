import React, { useState, useEffect } from 'react';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router-dom';
import authService from '../../services/authService.js';
import useStyles from './useStyles';
import DeleteConfirmDialog from 'components/DeleteConfirmDialog';
import CircularProgress from '@material-ui/core/CircularProgress';
import AdminService from 'services/api.js';
import useGlobal from 'Global/global';
import SelectTable from '../../components/SelectTable';
import MyTableCard from '../../components/MyTableCard';
import ContractAbi from '../../config/StakeInPool.json';
import { ethers } from "ethers";
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import FormControl from '@material-ui/core/FormControl';
import web3 from "web3";

const Dashboard = (props) => {
    const { history } = props;
    const token = authService.getToken();
    if (!token) {
        window.location.replace("/login");
    }
    const [globalState, globalActions] = useGlobal();
    const [value, setValue] = React.useState(0);
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [refresh, setRefresh] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    const [visibleIndicator, setVisibleIndicator] = React.useState(false);

    const [totalpage, setTotalPage] = useState(1);
    const [row_count, setRowCount] = useState(20);
    const [page_num, setPageNum] = useState(1);
    const [sort_column, setSortColumn] = useState(-1);
    const [sort_method, setSortMethod] = useState('asc');
    const selectList = [20, 50, 100, 200, -1];
    const [isOwner, setIsOwner] = useState(false);
    const [state, setState] = useState(false);
    const cellList = [
        { key: 'address', field: 'Address' },
        { key: 'level', field: 'Level' },
        { key: 'earned', field: 'Earned Money' },
    ];
    const [mintedCNT, setMintedCNT] = useState([0, 0, 0, 0, 0]);
    const MAX_ELEMENTS = [3800, 2500, 1900, 1000, 800];
    const [cardDataList, setCardDataList] = useState([
        { level: "Starter", minted: `0 / ${MAX_ELEMENTS[0]}`},
        { level: "Bronze", minted: `0 / ${MAX_ELEMENTS[1]}`},
        { level: "Silver", minted: `0 / ${MAX_ELEMENTS[2]}`},
        { level: "Gold", minted: `0 / ${MAX_ELEMENTS[3]}`},
        { level: "Platinum", minted: `0 / ${MAX_ELEMENTS[4]}`}
    ]);
    const columns = [];
    for (let i = 0; i < 3; i++)
        columns[i] = 'asc';

    // const [dataList, setDataList] = useState([]);
    const [stateSwitch, setStateSwitch] = React.useState({
        mint_state: false,
        distribute_state: false,
      });
    
    const handleChangeSwitch = async (event) => {
        if (!contractAvailable) {
            ToastsStore.warning("Please connect your wallet!");
            return;
        }
        if (!isOwner) {
            ToastsStore.warning("You must be a owner!");
            return;
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const SIPContract = new ethers.Contract(
          process.env.REACT_APP_NFT_ADDRESS,
          ContractAbi,
          provider.getSigner()
        );

        setVisibleIndicator(true);
        if (event.target.name == "mint_state") {
            try{
                await SIPContract.setMintPaused(!event.target.checked)
                .then((tx) => {
                    return tx.wait().then(
                      (receipt) => {
                        // This is entered if the transaction receipt indicates success
                        console.log("receipt", receipt);
                        ToastsStore.success("Updated status!");
                        setStateSwitch({ ...stateSwitch, [event.target.name]: event.target.checked });
                        return true;
                      },
                      (error) => {
                        console.log("error", error);
                        ToastsStore.error("Failed updating status");
                      }
                    );
                })
                .catch((error) => {
                    console.log(error);
                    if (error.message.indexOf("signature")) {
                        ToastsStore.error("You canceled transaction!");
                    } else {
                        ToastsStore.error("Transaction Error!");
                    }
                });
            } catch(e) {
            }
        } else if (event.target.name == "distribute_state") {
            try {
                await SIPContract.setRewardingPaused(!event.target.checked)
                .then((tx) => {
                    return tx.wait().then(
                      (receipt) => {
                        // This is entered if the transaction receipt indicates success
                        console.log("receipt", receipt);
                        ToastsStore.success("Updated status!");
                        setStateSwitch({ ...stateSwitch, [event.target.name]: event.target.checked });
                        return true;
                      },
                      (error) => {
                        console.log("error", error);
                        ToastsStore.error("Failed updating status");
                      }
                    );
                })
                .catch((error) => {
                    console.log(error);
                    if (error.message.indexOf("signature")) {
                        ToastsStore.error("You canceled transaction!");
                    } else {
                        ToastsStore.error("Transaction Error!");
                    }
                });
            } catch(e) {
            }
        }
        setVisibleIndicator(false);
    };
    
    const dataList = [
        {address: "0x483958305830384883930380", level: "Starter", earned: "$ 4830403"},
        {address: "0x729429472394729478382947", level: "Gold", earned: "$ 5838394829"},
        {address: "0x472948204204739472948293", level: "Silver", earned: "$ 28430203949"},
        {address: "0x262843927493840938503859", level: "Platinum", earned: "$ 2219281002920"},
        {address: "0x429583058058302840295038", level: "Bronze", earned: "$ 292042043"}
    ];
    const cardCellList = [
        { key: 'level', field: 'Level' },
        { key: 'minted', field: 'Minted Status' },
    ];

    // If the wallet is connected, all three values will be set. Use to display the main nav below.
    const contractAvailable = !(
        !globalState.web3props.web3 &&
        !globalState.web3props.accounts &&
        !globalState.web3props.contract
    );
    // Grab the connected wallet address, if available, to pass into the Login component
    const walletAddress = globalState.web3props.accounts ? globalState.web3props.accounts[0] : "";

    const [footerItems, setFooterItems] = useState([]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
    };
    const handleDelete = () => {
        handleCloseDelete();
        setVisibleIndicator(true);
        let data = {
            'status': 'trash',
            'list' : globalState.trash.ID
        }
        AdminService.emptyTrashBuilding(data)
            .then(
                response => {
                    setVisibleIndicator(false);
                    switch (response.data.code) {
                        case 200:
                            ToastsStore.success("Deleted Successfully!");
                            const data = response.data.data;
                            localStorage.setItem("token", JSON.stringify(data.token));
                            setRefresh(!refresh);
                            break;
                        case 401:
                            authService.logout();
                            history.push('/login');
                            window.location.reload();
                            break;
                        default:
                            ToastsStore.error(response.data.message);
                    }
                },
                error => {
                    ToastsStore.error("Can't connect to the server!");
                    setVisibleIndicator(false);
                }
            );
    }
    const handleChangeSelect = (value) => {
        setRowCount(selectList[value]);
    }
    const handleChangePagination = (value) => {
        setPageNum(value);
    }
    const handleSort = (index, direct) => {
        setSortColumn(index);
        setSortMethod(direct);
    }
    const handleClickEdit = (id) => {
        history.push('/edit/' + id);
        window.location.reload();
    }
    const handleClickImport = (csvData) => {

    }

    const handleClickExport = (check) => {

    }
    const handleClickDelete = (id) => {

    }

    useEffect(() => {
        setVisibleIndicator(true);
        async function getPrams() {
            await getParams();
        }
        getPrams();
        setVisibleIndicator(false);
    }, [globalState]);
    
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
        setStateSwitch({
            mint_state: !mintingPauseVal,
            distribute_state: !rewardingPauseVal,
        });
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
        let _mintedCNT = await SIPContract.mintedCnt();
        let _tmp = [];
        for (let i = 0; i < _mintedCNT.length; i++) {
          _tmp[i] = web3.utils.toDecimal(_mintedCNT[i]);
        }
        setMintedCNT(_tmp);
    
        setCardDataList([
            { level: "Starter", minted: `${_tmp[0]} / ${MAX_ELEMENTS[0]}`},
            { level: "Bronze", minted: `${_tmp[1]} / ${MAX_ELEMENTS[1]}`},
            { level: "Silver", minted: `${_tmp[2]} / ${MAX_ELEMENTS[2]}`},
            { level: "Gold", minted: `${_tmp[3]} / ${MAX_ELEMENTS[3]}`},
            { level: "Platinum", minted: `${_tmp[4]} / ${MAX_ELEMENTS[4]}`}
        ])
        // if (totalSupply === MAX_ELEMENTS) {
        //   console.log("Sold Out");
        // }
      };
    return (
        <div className={classes.root}>
            {
                visibleIndicator ? <div className={classes.div_indicator}> <CircularProgress className={classes.indicator} /> </div> : null
            }
            <div className={classes.title}>
                <Grid item container justify="space-around" alignItems="center">
                    <Grid item xs={12} sm={6} container justify="flex-start" >
                        <Grid item>
                            <Typography variant="h2" className={classes.titleText}>
                                <b>Dashboard</b>
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6} container justify="flex-end" >
                        <Grid>
                            {/* <MyButton
                                name={value === 0 ? "Nouvel immeuble" : "Vider la Poubelle"}
                                color={"1"}
                                onClick={handleClickAdd}
                            /> */}
                            {/* <Dialog
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                                classes={{ paper: classes.paper }}
                            >
                                <Grid item container className={classes.padding} >
                                    <Grid xs={12} item container direction="row-reverse"><CloseIcon onClick={handleClose} className={classes.close} /></Grid>
                                    <Grid xs={12} item ><p id="transition-modal-title" className={classes.modalTitle}><b>Nouvel immmeuble</b></p></Grid>
                                </Grid>
                                <AddBuilding onCancel={handleClose} onAdd={handleAdd} />
                            </Dialog> */}
                        </Grid>
                    </Grid>
                </Grid>
            </div>
            <div className={classes.tool}>
                <FormControl component="fieldset">
                    <FormGroup >
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
                            classes={{label: classes.titleText}}
                        />
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
                            label="Distributing"
                            labelPlacement="start"
                            classes={{label: classes.titleText}}
                        />
                    </FormGroup>
                </FormControl>
                <Grid container>
                    <Grid item sm={7}>
                        <MyTableCard
                            products={cardDataList}
                            cells={cardCellList}
                        />
                    </Grid>
                </Grid>
            </div>
            <div className={classes.body}>
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
                    onClickEdit={handleClickEdit}
                    onClickDelete={handleClickDelete}
                    onImport={handleClickImport}
                    onExport={handleClickExport}
                    tblFooter="true"
                    footerItems={footerItems}
                    err="You must select a company"
                />
            </div>
            <DeleteConfirmDialog
                openDelete={openDelete}
                handleCloseDelete={handleCloseDelete}
                handleDelete={handleDelete}
                account={'building'}
            />
            <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
        </div>
    );
};

export default withRouter(Dashboard);
