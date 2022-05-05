import React, { useEffect } from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Chart } from 'react-chartjs-2';
import { ThemeProvider } from '@material-ui/styles';
import validate from 'validate.js';
// import { DAppProvider } from "@usedapp/core";

import { chartjs } from './helpers';
import theme from './theme';
import 'react-perfect-scrollbar/dist/css/styles.css';
import './assets/scss/index.css';
import validators from './common/validators';
import Routes from './Routes';
import Web3 from "web3";

const browserHistory = createBrowserHistory();

Chart.helpers.extend(Chart.elements.Rectangle.prototype, {
  draw: chartjs.draw
});

validate.validators = {
  ...validate.validators,
  ...validators
};

const App = () => {
  
  useEffect(() => {
    const DoConnect = async () => {
      console.log("Connecting....");
      try {
        // Get network provider and web3 instance.
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        // Request account access if needed
        await window.ethereum.request({ method: "eth_requestAccounts" });
      }catch(error) {
        // Catch any errors for any of the above operations.
        console.error("Could not connect to wallet.", error);
      }
    }
    DoConnect();
  }, []);

    return (
        <ThemeProvider theme={theme}>
          {/* <DAppProvider config={{}}> */}
          <Router history={browserHistory}>
            <Routes />
          </Router>
          {/* </DAppProvider> */}
        </ThemeProvider>
    );
}

export default App;