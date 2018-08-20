const Lottery = artifacts.require("../contracts/Lottery.sol");

contract("Lottery", accounts => {
    let lottery;
    const owner = accounts[0];

    before("initialize a lottery object to be used by the test cases", async () => {
        lottery = await Lottery.new(5, web3.toWei("1"), { from: owner, value: web3.toWei("1") });
    });

    it("first ticket should be purchased by the owner", () => {
        return lottery.soldTickets.call(0).then(account => {
            assert.equal(account, owner, "first ticket not sold to owner");
        })
    })
})