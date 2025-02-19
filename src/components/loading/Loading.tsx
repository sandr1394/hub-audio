import React from 'react';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  container: {
    height: 'calc(100vh - 40px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

function Loading() {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <CircularProgress data-testid="loading-spinner" />
    </Container>
  );
}

export default Loading;
