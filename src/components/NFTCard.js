import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import Grid from '@material-ui/core/Grid';
import theme from 'theme';
import { Scrollbars } from 'react-custom-scrollbars';

const useStyles = makeStyles({
  root: {
    maxWidth: 545,
  },
  media: {
    height: 140,
    marginTop: 16,
    backgroundSize: 'contain'
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
});

export default function NFTCard({ name, image, description, attributes, tokenId }) {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const handleClickDetail = () => {
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={image}
          title={name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        {/* <Button size="small" color="primary"  onClick={handleClickDetail}>
          Share
        </Button> */}
        <Button size="small" color="primary" onClick={handleClickDetail}>
          View Details
        </Button>
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            classes={{ paper: classes.paper }}
        >
            <Grid container className={classes.padding} justify="space-between">
                <Grid item ><p className={classes.modalTitle}><b>{name}</b></p></Grid>
                <Grid item style={{display: 'flex'}}><CloseIcon onClick={handleClose} className={classes.close} /></Grid>
            </Grid>
            <Scrollbars style={{ height: '50vh' }}>
                <img src={image} width="100%"/>
            </Scrollbars>
        </Dialog>
      </CardActions>
    </Card>
  );
}