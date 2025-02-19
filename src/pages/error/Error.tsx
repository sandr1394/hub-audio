import React from 'react';
import { Button, Container, Stack, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles({
  container: {
    marginTop: 50,
    height: 'calc(100vh - 90px)',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    marginTop: -150,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    marginTop: 30,
    marginBottom: 30,
  },
});

function Error() {
  const classes = useStyles();
  const history = useHistory();

  const back = () => {
    history.push(`/audio`);
  };

  return (
    <Container className={classes.container}>
      <Stack className={classes.content}>
        <Typography variant="h2">Server Error</Typography>
        <Typography className={classes.info}>
          It seems like something wrong with HUB.
          <br />
          Please contact engineering team to solve this issue.
        </Typography>
        <Button onClick={back}>Return to Main Screen</Button>
      </Stack>
    </Container>
  );
}

export default Error;
