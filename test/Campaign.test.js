const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;      
let factory;
let campaignAddress;
let campaign;

beforeEach(async ()=>{
    accounts = await web3.eth.getAccounts();                                        // Get address ( deployer's address)
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))    // Construct a instance of factory
    .deploy({ data: compiledFactory.bytecode})
    .send({ from: accounts[0], gas:'1000000'});
                                                                                    // After the factory is created. It provided a 
                                                                                    // function that allows other user to create 
                                                                                    // Project by himself.

    await factory.methods.createCampaign('100').send({                              // Other user "Acounts[0]" creates a project 
        from: accounts[0],                                                      
        gas: '1000000'
    });
 
    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();      // [campaignAddress] = get the first asset of campaignAddress
    campaign = await new web3.eth.Contract(                     
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    );
});

describe('Campaigns',()=>{
    it('deploys a factory and a campaign', ()=>{
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks caller as the campaign manager', async()=>{
        const manager = await campaign.methods.manager().call();   // call "manager" variable has it own menthod that is aytomatically created 
        assert.equal(manager, accounts[0]);
    });

    it('allows people to contribute money and marks them as approvers', async()=>{
        await campaign.methods.contribute().send({
            value:'200',
            from: accounts[1]
        });

        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        assert(isContributor);
    });

    it('requires a minimum contribution', async()=>{
        try{
            await campaign.methods.contribute().send({
                value: '5',
                from: accounts[1]
            });
            assert(false)
        }catch(err){
            assert(err);
        }
    });

    it('allows a manager to create request', async()=>{
        await campaign.methods.createRequest(
            'Buy Battery',
            '100',
            accounts[1],).send({
                from:accounts[0],
                gas:'1000000'
            });
        const request = await campaign.methods.requests(0).call();
        assert.equal('Buy Battery',request.description);     // if request.description set correctly, than so do the rest
    });

    it('processes requests', async ()=>{

        let initialbalance = await web3.eth.getBalance(accounts[1]);       // get the balance of the ether receiver
        initialbalance = web3.utils.fromWei(initialbalance,'ether'); 
        initialbalance = parseFloat(initialbalance); 
        console.log(initialbalance)

        await campaign.methods.contribute().send({                          // After the project is created. You make a donation to becoem an approver
            from: accounts[0],
            value:web3.utils.toWei('10','ether')
        });

        await campaign.methods                  
        .createRequest('buy things', web3.utils.toWei('5','ether'),accounts[1])    // since you are also the manager. You can make a request
        .send({ from: accounts[0], gas: '1000000'});

        await campaign.methods.approveRequest(0).send({                            // approvel the request   
            from: accounts[0],
            gas:'1000000'
        })

        await campaign.methods.finalizeRequest(0).send({                            // finalise  the request, let the transaction pass.
            from: accounts[0],
            gas:'1000000'
        })

        let balance = await web3.eth.getBalance(accounts[1]);     // return in string
        balance = web3.utils.fromWei(balance,'ether');              
        balance = parseFloat(balance);                           // change to float for comparasion 
        console.log(balance)
        assert(balance > initialbalance)
    })
});





