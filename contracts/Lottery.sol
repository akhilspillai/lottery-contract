pragma solidity 0.4.24;

contract Lottery {

    uint public totalTickets;
    uint public costPerTicket;

    address[] public soldTickets;

    constructor(uint noOfTickets, uint costOfTicket) public payable {
        totalTickets = noOfTickets;
        costPerTicket = costOfTicket;

        require(msg.value == costPerTicket, "Exact amount should be send to buy a ticket");

        soldTickets.push(msg.sender);
    }
}