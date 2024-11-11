import Web3 from 'web3';
import dotenv from 'dotenv';

import ABI from '../abi/Erc20.json';

// Load environment variables from .env file
dotenv.config();


// Setup Web3 with WebSocket provider (ensure the provider supports websockets)
const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.WEB3_WS_URL));

const contractAddress = `0xABaea640BD17c526ab2C9F234ccC1Fa30AaFfe2D`;


async function init() {
    console.time('event');
    const contract = new web3.eth.Contract(ABI, contractAddress);

    const pastEvents = await contract.getPastEvents('BuyTokens', {
        fromBlock: 'earliest', // '62709749'//'62699428'
        toBlock: 'latest'
    });
    
    console.log(pastEvents);
    console.timeEnd('event');
}

init();


