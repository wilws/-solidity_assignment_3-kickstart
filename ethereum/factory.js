import web3 from './web3';
import CampaignFactory from './build/CampaignFactory 2.json';
// import dynamic from "next/dynamic";



const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x0C49DB7fdBD4513eA27f14407EBfF77307D16247'  // since you are not deploying the new contract. You can put the contract's address to interact with the deployed contract
);


export default instance;