pragma solidity 0.4.24;

contract Lottery {

    uint public totalTickets;
    uint public costPerTicket;

    address[] public soldTickets;

    modifier checkForExactValue(uint cost) {
        require(msg.value == cost, "Exact amount should be send to buy a ticket");
        _;
    }

    constructor(uint noOfTickets, uint costOfTicket) public payable checkForExactValue(costOfTicket) {
        totalTickets = noOfTickets;
        costPerTicket = costOfTicket;


        soldTickets.push(msg.sender);
    }

    function buy() public payable checkForExactValue(costPerTicket) {
        soldTickets.push(msg.sender);
    }
}