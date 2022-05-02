import React , {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

const useStyles = makeStyles((theme,props) => ({
  margin: {
    [theme.breakpoints.up('xl')]: {
      width: 160
    },
    [theme.breakpoints.between('lg','lg')]: {
      width: 112
    },
    [theme.breakpoints.down('md')]: {
      width: 78
    },
  },
  button1: {
    [theme.breakpoints.up('xl')]: {
      padding: '15px 30px',
      fontSize: 20
    },
    [theme.breakpoints.between('lg','lg')]: {
      padding: '10px 21px',
      fontSize: 14
    },
    [theme.breakpoints.down('md')]: {
      padding: '7px 15px',
      fontSize: 10
    },
    borderRadius: '16px',
    // background: 'linear-gradient(90deg, #00C9FF 10%, #0CC77C 90%)',
    // background: 'linear-gradient(0deg, #07071C 30%, #0937aC 100%)',
    background: '#0937aC',
    '&:hover': {
      background: '#0012B2',
    },
    color: 'white',
    textTransform: 'none',
    border: '1px solid',
  },
  button2: {
    [theme.breakpoints.up('xl')]: {
      padding: '15px 30px',
      fontSize: 20
    },
    [theme.breakpoints.between('lg','lg')]: {
      padding: '10px 21px',
      fontSize: 14
    },
    [theme.breakpoints.down('md')]: {
      padding: '7px 15px',
      fontSize: 10
    },
    borderRadius: '16px',
    border: '1px solid',
    borderColor: 'grey',
    color: 'grey !important',
    textTransform: 'none'
  },
}));

export default function MyButton(props) {
  const classes = useStyles(props);
  const btnClick = ()=>{
    if(props.onClick)
      props.onClick();
  };
  return (
      <Button onClick={btnClick} className={props.color ? classes.button1 : classes.button2} 
        disabled={props.disabled === true? true : false}
        style={props.style}
        >
          {props.name}
      </Button>
  );
}