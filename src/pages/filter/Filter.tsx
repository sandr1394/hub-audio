import React, { Suspense } from 'react';
import { Route, Switch, Redirect, useLocation, Link, useHistory } from 'react-router-dom';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import CardContent from '@mui/material/CardContent';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { makeStyles } from '@mui/styles';
import InteractionsFilter from '../../components/interactions/InteractionsFilter';
import Five9Filter from '../../components/five9/Five9Filter';
import Loading from '../../components/loading/Loading';
import { Five9FilterParams, InteractionsFilterParams } from '../../types';
import getInteractionsListUrl from '../../utils/getInteractionsListUrl';
import getFive9ListUrl from '../../utils/getFIve9List';

const useStyles = makeStyles({
  card: {
    marginTop: 150,
  },
  content: {
    padding: 24,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

interface LinkTabProps {
  label: string;
  to: string;
}

function LinkTab(props: LinkTabProps) {
  return <Tab component={Link} {...props} />;
}

function Filter() {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();

  const submitInteractions = (params: InteractionsFilterParams) => {
    history.push(getInteractionsListUrl(params));
  };

  const submitFive9 = (params: Five9FilterParams) => {
    history.push(getFive9ListUrl(params));
  };

  return (
    <Container maxWidth="md">
      <Card className={classes.card}>
        <Tabs
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
          value={location.pathname.includes('five9') ? 1 : 0}
        >
          <LinkTab label="Interactions" to="/audio/interactions" />
          <LinkTab label="Five9" to="/audio/five9" />
        </Tabs>
        <CardContent className={classes.content}>
          <Suspense fallback={<Loading />}>
            <Switch>
              <Route path="/audio/interactions">
                <InteractionsFilter onSubmit={submitInteractions} />
              </Route>
              <Route path="/audio/five9">
                <Five9Filter onSubmit={submitFive9} />
              </Route>
              <Redirect from="/audio" exact to="/audio/interactions" />
              <Redirect from="/audio/**" to="/audio/interactions" />
            </Switch>
          </Suspense>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Filter;
