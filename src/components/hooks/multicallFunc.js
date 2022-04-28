import { createWatcher } from '@makerdao/multicall';
import ContractAbi from '../../config/StakeInPool.json';
import { ethers } from 'ethers';
import { config } from 'config/multicall';

const WalletMintedTokenIds = async _setDataList => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const ACSContract = new ethers.Contract(
    process.env.REACT_APP_NFT_ADDRESS,
    ContractAbi,
    provider.getSigner()
  );

  const _holderList = await ACSContract.getHolderList();
  const createMintedTokenWatcher = list => {
    console.log('watcher!!!');
    const watcherJson = [];
    for (let i = 0; i < list.length; i++) {
      watcherJson.push({
        target: process.env.REACT_APP_NFT_ADDRESS,
        call: ['walletOfOwner(address)(uint256[])', list[i]],
        returns: [['tokenId[' + i + ']', val => val]]
      });
    }
    return watcherJson;
  };

  const createGetRewardDataWatcher = list => {
    console.log('watcher!!!');
    const watcherJson = [];
    for (let i = 0; i < list.length; i++) {
      watcherJson.push({
        target: process.env.REACT_APP_NFT_ADDRESS,
        call: ['getRewards(address)(uint256)', list[i]],
        returns: [['reward[' + i + ']', val => val]]
      });
    }
    return watcherJson;
  };

  const watcherWOO = createWatcher(
    createMintedTokenWatcher(_holderList),
    config
  );

  const watcherRewardData = createWatcher(
    createGetRewardDataWatcher(_holderList),
    config
  );

  watcherWOO.batch().subscribe(async updates => {
    watcherWOO.stop();
    // Handle batched updates here
    let tokenIds = [];
    // console.log('updates:', updates);
    for (let i = 0; i < updates.length; i++) {
      tokenIds.push(updates[i].value);
      // console.log('===multicall111:', updates[i].type, tokenIds[i]);
    }
    watcherRewardData.batch().subscribe(async updates1 => {
      watcherRewardData.stop();
      // Handle batched updates here
      let reward = [];
      // console.log('updates1:', updates1);
      for (let i = 0; i < updates1.length; i++) {
        reward.push(updates1[i].value);
        // console.log('===multicall222:', updates1[i].type, reward[i]);
      }
      _setDataList(_holderList, tokenIds, reward);
    });
    watcherRewardData.start();
  });
  watcherWOO.start();
};

export default WalletMintedTokenIds;
