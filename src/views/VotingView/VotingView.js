import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router-dom';
import authService from 'services/authService';
import MyButton from 'components/MyButton';
import axios from 'axios';
import {
  ToastsContainer,
  ToastsContainerPosition,
  ToastsStore
} from 'react-toasts';

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
    '& .MuiOutlinedInput-multiline':{
      padding: 0,
      lineHeight: 'normal'
    },
    '& .MuiOutlinedInput-input': {
      [theme.breakpoints.up('xl')]: {
        padding: '17px 25px',
        fontSize: 22,
      },
      [theme.breakpoints.down('lg')]: {
        padding: '12px 18px',
        fontSize: 15,
      },
      [theme.breakpoints.down('md')]: {
        padding: '8px 13px',
        fontSize: 11,
      },
    },
    '& p': {
      marginBottom: 0
    }
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
  title: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  body: {
    [theme.breakpoints.up('xl')]: {
      borderRadius: 30,
    },
    [theme.breakpoints.down('lg')]: {
      borderRadius: 21,
    },
    [theme.breakpoints.down('md')]: {
      borderRadius: 15,
    },
    marginBottom: 40
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  itemTitle: {
    cursor: 'pointer',
    [theme.breakpoints.up('xl')]: {
      fontSize: 18,
    },
    [theme.breakpoints.down('lg')]: {
      fontSize: 13,
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 9,
    },
  },

}));
const VotingView = (props) => {
  const { history } = props;

  const token = authService.getToken();    
  if (!token) {
    window.location.replace("/login");
  }
  const classes = useStyles();

  const [yesCnt, setYesCnt] = useState(0);
  const [noCnt, setNoCnt] = useState(0);
  const [questionId, setQuestionId] = useState(0);
  const [voteQuestion, setVoteQuestion] = useState('');

  const handleClickYes = () => {
    setYesCnt(yesCnt + 1);
  }

  const handleClickNo = () => {
    setNoCnt(noCnt + 1);
  }

  const handleClickSubmit = () => {
    const URL = process.env.REACT_APP_BACKEND_API_URL + "api/admin/vote";

    const data = {
      vote_question: voteQuestion,
      yesCnt: yesCnt,
      noCnt: noCnt
    };
    axios.put(URL + "/" + questionId, data, {})
    .then(
      response => {
        console.log("==== res:", response);
      },
      error => {
        ToastsStore.error("Can't connect to the Server!");
      }
    );
  }

  useEffect(() => {
    const URL = process.env.REACT_APP_BACKEND_API_URL + "api/admin/vote";

    axios.get(URL)
    .then(
      response => {
        const data = response.data;
        setYesCnt(data.votes[0].yesCnt);
        setNoCnt(data.votes[0].noCnt);
        setVoteQuestion(data.votes[0].quiz);
        setQuestionId(data.votes[0]._id);
      },
      error => {
        ToastsStore.error("Can't connect to the Server!");
      }
    );
  }, []);

  return (
      <div className={classes.root}>
        <div className={classes.title}>
          <Typography variant="h1" className={classes.headerTitle} style={{color: 'white'}}>
            <b>Voting</b>
          </Typography>
        </div>
        <div className={classes.tool}>
        </div>
        <div className={classes.body}>
          <Grid item container xs={12} sm={6} md={6} lg={5} xl={4} justifyContent="flex-start" direction="column" spacing={4}>
            <Grid item>
              <p className={classes.headerTitle}>Q:{voteQuestion}</p>
            </Grid>
            <Grid item>
              <Grid container spacing={3}>
                <Grid item>
                  <MyButton
                    color={'1'}
                    name={`Yes (${yesCnt})`}
                    onClick={handleClickYes}
                  />
                </Grid>
                <Grid item>
                  <MyButton
                    color={'1'}
                    name={`No (${noCnt})`}
                    onClick={handleClickNo}
                  />
                </Grid>
                <Grid item>
                  <MyButton
                    color={'1'}
                    name='Submit'
                    onClick={handleClickSubmit}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
  );
};

export default withRouter(VotingView);
