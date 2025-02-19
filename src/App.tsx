import React, { Suspense, useMemo } from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import { lightBlue, deepOrange, red } from '@mui/material/colors';
import { CssBaseline, ThemeProvider, StyledEngineProvider } from '@mui/material';
import createTheme from '@mui/material/styles/createTheme';
import { LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import Header from './components/header/Header';
import Loading from './components/loading/Loading';
import NetworkService from './network-service';
import Error from './pages/error/Error';
import Filter from './pages/filter/Filter';
import List from './pages/list/List';
import CacheContextProvider from './utils/CacheContextProvider';

NetworkService.setupInterceptors();

function App() {
  const theme = useMemo(
    () =>
      createTheme({
        components: {
          MuiPaper: {
            styleOverrides: { root: { backgroundColor: '#424242', backgroundImage: 'unset' } },
          },
        },
        palette: {
          mode: 'dark',
          primary: {
            main: lightBlue[500],
          },
          secondary: {
            main: deepOrange[100],
            contrastText: 'rgba(0, 0, 0, 0.87)',
          },
          error: {
            main: red[300],
          },
          background: {
            default: '#303030',
          },
        },
      }),
    [],
  );

  return (
    <ThemeProvider theme={theme}>
      <CacheContextProvider>
        <StyledEngineProvider injectFirst>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <CssBaseline />
            <Header />
            <BrowserRouter>
              <Suspense fallback={<Loading />}>
                <Switch>
                  <Route path="/audio/server-error" exact component={Error} />
                  <Route path="/audio/list/:source" component={List} />
                  <Route path="/audio" component={Filter} />
                </Switch>
              </Suspense>
            </BrowserRouter>
          </LocalizationProvider>
        </StyledEngineProvider>
      </CacheContextProvider>
    </ThemeProvider>
  );
}

export default App;
