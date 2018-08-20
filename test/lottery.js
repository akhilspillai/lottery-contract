const Lottery = artifacts.require("../contracts/Lottery.sol");

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
        }).then(() => {
            assert.equal(account, accounts[1], "ticket not sold to the correct user");
        })
    })
})