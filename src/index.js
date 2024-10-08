import Web3 from 'web3';
import dotenv from 'dotenv';
const { cwd } = require('process');
const { Worker } = require('worker_threads');
const cron = require('node-cron');
import contractABI from './abi.json';
import factoryAbi from '../abi/factory_abi.json';
import collections from '../collections.json';
import { create, read } from './leveldb';

// Load environment variables from .env file
dotenv.config();

// Setup Web3 with WebSocket provider (ensure the provider supports websockets)
const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.WEB3_WS_URL));

const runService = (workerData) => {
    return new Promise((resolve, reject) => {
        const worker = new Worker(cwd()+'/lib/EventListenerWorker.js');
        // Send data to the worker
        worker.postMessage(workerData);
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            reject(new Error(`Worker stopped with exit code ${code}`));
        });
    });
}

const initTasks = async () => {
    try {
        // TODO: get data from database and pass to worker thread
        const contracts = ['0x4d8ab5861206Edf1180067106d7E74F5931Cfbe8']; 

        for (let i = 0; i < collections.length; i++) {
            const collection = collections[i];
            const contractAddress = collection.collection_address;
            if (collection.is_deleted == false && contractAddress) {
                // Create contract instance
                const contract = new web3.eth.Contract(factoryAbi, contractAddress);

                // const pastEvents = await contract.getPastEvents('EnableOrDisableBlacklist', {
                //     fromBlock: '62699428' // '62709749'//'62699428'
                // });
            
                // console.log({pastEvents});
                const lastBlockNumber = await read(contractAddress);


                const pastEvents = await contract.getPastEvents('Transfer', {
                    fromBlock: lastBlockNumber || 'earliest' // '62709749'//'62699428'
                });
            
                handleEvents(contractAddress,pastEvents);
                console.log(pastEvents);
                
                // console.log({eventData: pastEvents[0].returnValues});

                // console.log(`Contract address : ${contractAddress}`);
                // console.log(`Last block number : ${await read(contractAddress)}`);
            }
        }
        // const results = await Promise.all(contracts.map(contract => runService(contract)));
        // console.log('Results:', results);
    } catch (error) {
        console.error('❌ Error in initTasks:', error);
    }
}

// Call the function to start the listener
initTasks();

/**
 * Cron job which runs on every minute
 */
cron.schedule('* * * * *', async () => {
    console.log('running a task every minute');
    initTasks();
});


const handleEvents = async (contractAddress,pastEvents) => {
    if (pastEvents.length > 0) {
        const lastBlockNumber = pastEvents[pastEvents.length-1].blockNumber.toString();
        console.log(lastBlockNumber);
        
        await create(contractAddress, lastBlockNumber);
    }
}