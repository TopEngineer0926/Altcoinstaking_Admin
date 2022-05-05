import React, { useEffect } from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Chart } from 'react-chartjs-2';
import { ThemeProvider } from '@material-ui/styles';
import validate from 'validate.js';
import { DAppProvider } from "@usedapp/core";

import { chartjs } from './helpers';
import theme from './theme';
import 'react-perfect-scrollbar/dist/css/styles.css';
import './assets/scss/index.css';
import validators from './common/validators';
import Routes from './Routes';
import Web3 from "web3";
import { Constants } from 'config/constants';

const browserHistory = createBrowserHistory();

Chart.helpers.extend(Chart.elements.Rectangle.prototype, {
  draw: chartjs.draw
});

validate.validators = {
  ...validate.validators,
  ...validators
};

const App = () => {
  
  const chainId = process.env.REACT_APP_CHAIN_ID;
  const config = {
    readOnlyChainId: chainId,
    readOnlyUrls: {
      [chainId]: Constants.rpcURL.chainId,
    },
    multicallVersion: 2,
  };

    return (
        <ThemeProvider theme={theme}>
          <DAppProvider config={config}>
          <Router history={browserHistory}>
            <Routes />
          </Router>
          </DAppProvider>
        </ThemeProvider>
    );
}

export default App;