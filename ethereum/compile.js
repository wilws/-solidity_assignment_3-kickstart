// Below is not a good way for compiling because every time we run the project, 
// it re-compile the whole contract again and agian 

// const path = require('path');
// const solc = require('solc');

// const lotteryPath = path.resolve(__dirname, "contracts", "Compaign.sol");
// const source = fs.readFileSync(lotteryPath, "utf8");

// console.log(source)

// module.exports = solc.compile(source, 1).contracts[":Lottery"];



// We use the new method:



const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');   // Get the path of folder "build"
fs.removeSync(buildPath);                               // remove it

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath,'utf8');

const output = solc.compile(source, 1).contracts;



fs.ensureDirSync(buildPath);                            //check if directory exist, if not, create one

for(let contract in output){                        // this will give the "key" only
    fs.outputJsonSync(
        path.resolve(buildPath,contract.replace(':','') + '.json'),
        output[contract]
    );
}
