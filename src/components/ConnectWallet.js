import React from 'react';
import Web3 from 'web3';

import StakeInPool from '../config/StakeInPool.json';
import Wallet from './wallet';
import MyButton from './MyButton';

export default function ConnectWallet(props) {
  const contractAddress = process.env.REACT_APP_NFT_ADDRESS;

  const DoConnect = async () => {
    console.log('Connecting....');
    try {
      // Get network provider and web3 instance.
      const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
      // Request account access if needed
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: web3.utils.toHex(process.env.REACT_APP_CHAIN_ID) }]
      });
      // Get an instance of the contract sop we can call our contract functions
      const instance = new web3.eth.Contract(StakeInPool, contractAddress);
      props.callback({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      console.error('Could not connect to wallet.', error);
    }
  };

  // If not connected, display the connect button.
  if (!props.connected)
    return <MyButton name={'Connect Wallet'} color={'1'} onClick={DoConnect} />;

  // Display the wallet address. Truncate it to save space.
  return <Wallet address={props.address} />;
}
