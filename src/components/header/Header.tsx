import React from 'react';
import { AccountCircleOutlined } from '@mui/icons-material';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { makeStyles } from '@mui/styles';
import { ReactComponent as HubLogoSVG } from '../../assets/icons/hub-logo.svg';
import { HUB_JWT_KEY } from '../../network-service';

const useStyles = makeStyles({
  appBar: {
    color: '#fff',
  },
  toolbar: {
    backgroundColor: '#212121',
    minHeight: '40px',
  },
  iconBox: {
    alignItems: 'center',
  },
  title: {
    flexGrow: 1,
    textAlign: 'center',
  },
  logo: {
    width: 54,
    height: 18,
    cursor: 'pointer',
    fill: '#f5f5f5',
    '&:hover': {
      fill: '#bbb',
    },
  },
});

function Header() {
  const classes = useStyles();

  const logout = () => {
    localStorage.removeItem(HUB_JWT_KEY);
    window.location.href = '/';
  };

  const redirectToDashboard = () => {
    window.location.href = '/';
  };

  return (
    <AppBar position="sticky" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <Grid container alignItems="center">
          <Grid item xs>
            <HubLogoSVG className={classes.logo} onClick={redirectToDashboard} />
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.title} variant="h6">
              Audio Logs
            </Typography>
          </Grid>
          <Grid container item xs justifyContent="flex-end">
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
            <Box className={classes.iconBox} display={{ xs: 'none', sm: 'flex' }}>
              <AccountCircleOutlined fontSize="large" />
            </Box>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
