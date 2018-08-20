const Lottery = artifacts.require("../contracts/Lottery.sol");
const isError = require("./helpers/delay");

contract("Lottery", accounts => {
    let lottery;
    const owner = accounts[0];

    before("initialize a lottery object to be used by the test cases", async () => {
        lottery = await Lottery.new(5, web3.toWei("1"), { from: owner, value: web3.toWei("1") });
    });

    it("should make sure first ticket is purchased by the owner", () => {
        return lottery.soldTickets.call(0).then(account => {
            assert.equal(account, owner, "first ticket not sold to owner");
        })
    })

    it("should allow other people to buy tickets", () => {
        return lottery.buy({ from: accounts[1], value: web3.toWei("1") }).then(() => {
            return lottery.soldTickets.call(1);
        }).then(account => {
            assert.equal(account, accounts[1], "ticket not sold to the correct user");
        })
    })

    it("should declare a winner after the lottery ends", () => {
        const winnerEvent = lottery.WinnerDeclared();
        return winnerEvent.get().then(events => {
            console.log("Event called");
            const winner = events[0].args.winner;
            for (let i = 0; i < 5; i++) {
                if (winner == accounts[i]) {
                    return;
                }
            }
            assert(false, "lottery is not won by one of the participants");
        })
    })

    it("should end lottery once all the tickets are sold", () => {
        return Promise.all([
            lottery.buy({ from: accounts[2], value: web3.toWei("1") }),
            lottery.buy({ from: accounts[3], value: web3.toWei("1") }),
            lottery.buy({ from: accounts[4], value: web3.toWei("1") })
        ]).then(() => {
            return lottery.ended.call();
        }).then(hasEnded => {
            assert.isTrue(hasEnded, "lottery has not ended after all tickets are sold");
        })
    })
})