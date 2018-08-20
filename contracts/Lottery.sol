pragma solidity 0.4.24;

contract Lottery {

    uint public totalTickets;
    uint public costPerTicket;
    address[] public soldTickets;
    bool public ended;

    event WinnerDeclared(address winner);

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
        require(!ended, "Lottery has already ended");
        soldTickets.push(msg.sender);
        if (soldTickets.length == totalTickets) {
            ended = true;
            address winner = soldTickets[getWinnerIndex()];
            emit WinnerDeclared(winner);
            winner.transfer(costPerTicket * totalTickets);
        }
    }

    function getWinnerIndex() private view returns (uint index) {
        index = uint(blockhash(block.number - 1)) % totalTickets;
    }
}