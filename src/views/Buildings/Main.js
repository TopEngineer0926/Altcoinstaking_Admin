import React, { useState } from 'react';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import MyButton from '../../components/MyButton';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import AddBuilding from './AddBuilding';
import { withRouter } from 'react-router-dom';
import authService from '../../services/authService.js';
import useStyles from './useStyles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import DeleteConfirmDialog from 'components/DeleteConfirmDialog';
import CircularProgress from '@material-ui/core/CircularProgress';
import AdminService from 'services/api.js';
import useGlobal from 'Global/global';
import SelectTable from '../../components/SelectTable';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box >
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};
function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}
const Main = (props) => {
    const { history } = props;
    const token = authService.getToken();
    if (!token) {
        window.location.replace("/login");
    }
    const [globalState, globalActions] = useGlobal();
    const accessBuildings = authService.getAccess('role_buildings');
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
    const [state, setState] = useState(false);
    const cellList = [
        { key: 'address', field: 'Address' },
        { key: 'level', field: 'Level' },
        { key: 'earned', field: 'Earned Money' },
    ];

    const columns = [];
    for (let i = 0; i < 3; i++)
        columns[i] = 'asc';

    // const [dataList, setDataList] = useState([]);

    const dataList = [
        {address: "0x483958305830384883930380", level: "Starter", earned: "$ 4830403"},
        {address: "0x729429472394729478382947", level: "Gold", earned: "$ 5838394829"},
        {address: "0x472948204204739472948293", level: "Silver", earned: "$ 28430203949"},
        {address: "0x262843927493840938503859", level: "Platinum", earned: "$ 2219281002920"},
        {address: "0x429583058058302840295038", level: "Bronze", earned: "$ 292042043"}
    ];

    const [footerItems, setFooterItems] = useState([]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleAdd = () => {
        ToastsStore.success("Added New Building successfully!");
        setRefresh(!refresh);
    };
    const handleClickAdd = () => {
        setOpen(true);
    };
    const handleClickEmptyTrashBuilding = () => {
        if(globalState.trash.type === 'building' && globalState.trash.ID.length != 0)
            setOpenDelete(true);
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
        history.push('/buildings/edit/' + id);
        window.location.reload();
    }
    const handleClickImport = (csvData) => {

    }

    const handleClickExport = (check) => {

    }
    const handleClickDelete = (id) => {

    }

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
                                <b>Administrator</b>
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
                            <Dialog
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
                            </Dialog>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
            <div className={classes.tool}>
                
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
                    access={accessBuildings}
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

export default withRouter(Main);
