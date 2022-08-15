pragma solidity ^0.4.17;  // specific the verison of the solidity.

contract CampaignFactory {
    address[] public deployedCampaigns;               // store user deployed campaign

    function createCampaign(uint minimum) public{
        address newCampaign = new Campaign(minimum, msg.sender);     // when use click create project button
        deployedCampaigns.push(newCampaign);             // store the campaign address into array
    }

    function getDeployedCampaigns() public view returns (address[]){
        return deployedCampaigns;
    }
}


contract Campaign {

    struct Request {                                    // this is the request that raise from manager
        string description;                             // to seek for money transfer approval
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    address public manager;                             // One who deploys the contract
    uint public minimumContribution;                    // set the min amount to enter to this contract
    Request[] public requests;                          // List of request from manager
    uint public approversCount;                         // No of people who enter to this contract

    mapping(address => bool) public approvers;          // address: true/false mapping to denote the validity of the participants 


    modifier restricted(){
        require(msg.sender == manager);
        _;
    }
    
    function Campaign(uint minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;     // the min amount to let a person to be approver
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;

    }

    function createRequest(string description, uint value, address recipient ) public restricted {
        Request memory newRequest = Request({ // create in memory
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount:0
            // no need to mentione mapping approvals
        });
        requests.push(newRequest);
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];    // use "storage" because we are going to modify it.
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvalCount++;
        request.approvals[msg.sender] = true;
    }    

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        require(request.approvalCount > approversCount /2);
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;

    }

    function getSummary() public view returns (
        uint,uint,uint,uint, address
        ) {
            return (
                minimumContribution,
                this.balance,
                requests.length,
                approversCount,
                manager
            );
        }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
}


