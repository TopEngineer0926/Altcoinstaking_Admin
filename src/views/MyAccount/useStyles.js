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
    '& .MuiTab-root':{
      paddingLeft: 0,
      paddingRight: 30,
      minWidth: 0,
      fontWeight:'bold'
    },
    '& .MuiTab-wrapper':{
      flexDirection: 'row',
      justifyContent: 'flex-start',
      textTransform: 'none',
      color: '#363636',
      [theme.breakpoints.up('xl')]: {
        fontSize :20
      },
      [theme.breakpoints.down('lg')]: {
        fontSize :14
      },
      [theme.breakpoints.down('md')]: {
        fontSize :10
      },
    },
    '& .MuiTab-textColorInherit.Mui-selected':{
      textDecoration: 'underline',
      textUnderlinePosition: 'under'
    },
    '& .MuiOutlinedInput-input': {
      color: 'white'
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'white !important'
    },
    '& .MuiTypography-body1': {
      color: 'white'
    }

  },
  title:{
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  titleText: {
    [theme.breakpoints.up('xl')]: {
      fontSize :35
    },
    [theme.breakpoints.down('lg')]: {
      fontSize :25
    },
    [theme.breakpoints.down('md')]: {
      fontSize :18
    },
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
  },
  subTitle: {
    [theme.breakpoints.up('xl')]: {
      fontSize :18
    },
    [theme.breakpoints.down('lg')]: {
      fontSize :13
    },
    [theme.breakpoints.down('md')]: {
      fontSize :9
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
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    borderRadius: 15,
    width: 500
  },
  padding: {
    padding: theme.spacing(2, 4, 3),
  },
  close: {
    cursor: 'pointer',
    color: 'gray'
  },
  div_indicator: {
    width: '100%',
    height: '100%',
    display: 'flex',
    position: 'fixed',
    paddingLeft: '35%',
    alignItems: 'center',
    marginTop: '-60px',
    zIndex: 999,
  },
  indicator: {
    color: 'gray'
  },
  textField: {
    color: 'white'
  }
}));

  export default useStyles;