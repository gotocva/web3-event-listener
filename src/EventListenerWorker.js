import Web3 from 'web3';
import dotenv from 'dotenv';
const { parentPort } = require('worker_threads');
// Load environment variables from .env file
dotenv.config();  

// Setup Web3 with WebSocket provider (ensure the provider supports websockets)
// const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.WEB3_WS_URL));

/**
 * worker thread listener
 */
parentPort.on('message', (data) => {
    console.log(data, 'data on parentport on worker on thread');
    
    // Perform heavy computation here
    // const result = heavyComputation(data);
    // console.log(web3);
    
    parentPort.postMessage('result'+data);
});

function heavyComputation(data) {
    // Simulate heavy work
    let sum = 0;
    for (let i = 0; i < data; i++) {
        sum += i;
    }
    return sum;
}
