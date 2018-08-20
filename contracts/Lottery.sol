pragma solidity 0.4.24;

contract Lottery {

    uint public totalTickets;
    uint public costPerTicket;
    address[] public soldTickets;
    bool public ended;

    event WinnerDeclared(address winner);

    constructor(uint noOfTickets, uint costOfTicket) public payable {
        totalTickets = noOfTickets;
        costPerTicket = costOfTicket;

        soldTickets.push(msg.sender);
    }

    function buy() public payable {
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