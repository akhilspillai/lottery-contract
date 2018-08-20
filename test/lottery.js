const Lottery = artifacts.require("../contracts/Lottery.sol");
const isError = require("./helpers/is-error");

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

    it("should not allow users to buy tickets with a higher amount than specified", () => {
        return lottery.buy({ from: accounts[2], value: web3.toWei("2") }).then(() => {
            return Promise.reject("lottery was bought with a higher amount");
        }).catch(isError)
        .then(e => {
            assert.isDefined(e)
        })
    })

    it("should not allow users to buy tickets with a lower amount than specified", () => {
        return lottery.buy({ from: accounts[2], value: web3.toWei("0.5") }).then(() => {
            return Promise.reject("lottery was bought with a lower amount");
        }).catch(isError)
        .then(e => {
            assert.isDefined(e)
        })
    })

    it("should end lottery and declare winner once all the tickets are sold", () => {
        const winnerEvent = lottery.WinnerDeclared();
        return Promise.all([
            lottery.buy({ from: accounts[2], value: web3.toWei("1") }),
            lottery.buy({ from: accounts[3], value: web3.toWei("1") }),
            lottery.buy({ from: accounts[4], value: web3.toWei("1") })
        ]).then(() => {
            return lottery.ended.call();
        }).then(hasEnded => {
            assert.isTrue(hasEnded, "lottery has not ended after all tickets are sold");
            return winnerEvent.get();
        }).then(events => {
            const winner = events[0].args.winner;
            for (let i = 0; i < 5; i++) {
                if (winner == accounts[i]) {
                    console.log("lottery winner is accounts["+i+"]");
                    return;
                }
            }
            assert(false, "lottery is not won by one of the participants");
        })
    })

    it("should not allow user to buy a ticket after the lottery has ended", () => {
        return lottery.buy({ from: accounts[5], value: web3.toWei("1") }).then(() => {
            return Promise.reject("lottery was bought after it has ended");
        }).catch(isError)
        .then(e => {
            assert.isDefined(e)
        })
    })
})