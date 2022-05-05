import React, { useState } from 'react';
import Web3 from 'web3';

import StakeInPool from '../config/StakeInPool.json';
import Wallet from './wallet';
import MyButton from './MyButton';
import { useEthers } from "@usedapp/core";

export default function ConnectWallet(props) {
  const contractAddress = process.env.REACT_APP_NFT_ADDRESS;
  const { activateBrowserWallet, deactivate, account, chainId } = useEthers();
  const [chainning, setChainning] = useState(true);
  const [current, setCurrent] = useState(0);
  const getCurrentStatus = () => {
    const _chained = chainId != process.env.REACT_APP_CHAIN_ID;
    const _cur = _chained ? 0 : 1;
    setCurrent(_cur);
    setChainning(_chained);
  };
  const next = () => {
    setCurrent(current + 1);
  };
  async function switchNetwork(chain) {
    console.log("window.ethereum", window.ethereum);
    if (window.ethereum) {
      await window.ethereum
        .request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: Web3.utils.toHex(chain) }],
        })
        .then((res) => {
          console.log("switch network success!");
          setChainning(false);
        })
        .catch((err) => {
          console.log("switch network error: ", err.message);
          setChainning(true);
        });
    }
  }

  const DoConnect = async () => {
    activateBrowserWallet();
    // setIsModalVisible(false);
    // message.success("Success Connection!");
    setCurrent(0);
  };

  // If not connected, display the connect button.
  if (!account || chainId != process.env.REACT_APP_CHAIN_ID)
    return <MyButton name={'Connect Wallet'} color={'1'} onClick={DoConnect} />;

  // Display the wallet address. Truncate it to save space.
  return <Wallet address={account} />;
}
