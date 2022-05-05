import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
// import { useEthers, useEtherBalance } from "@usedapp/core";

export default function Wallet(props) {
  const [balMatic, setBalMatic] = useState("0");

    // const {activateBrowserWallet, account} = useEthers();
    // const etherBalance = useEtherBalance(account);
  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    provider.getBalance(props.address).then((balance) => {
      // convert a currency unit from wei to ether
      const _balMatic = ethers.utils.formatEther(balance);
      const _balance = parseFloat(parseInt(_balMatic * 100) / 100);
      setBalMatic(_balance.toString());
      console.log(`balance: ${_balMatic} MATIC`);
    });

  });

  // Display the minting gallery
  return (
    <span style={{color: 'white', fontSize: 25}}>
      [
      {` ${balMatic} MATIC` +
        " | " +
        props.address.slice(0, 5) +
        "..." +
        props.address.slice(38, 42) +
        " "}
      ]
    </span>
  );
}
