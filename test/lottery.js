const Lottery = artifacts.require("../contracts/Lottery.sol");

contract("Lottery", accounts => {
    let lottery;
    before("initialize a lottery object to be used by the test cases", () => {
        lottery = Lottery.new(5, web3.toWei("1"), { from: accounst[0], value: web3.toWei("1") });
    })
})