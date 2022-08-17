const { errorResponse } = require("../api-util");
const { ethers } = require("ethers");
const FaucetHandler = require('../../faucet_handler/FaucetHandler');

module.exports = async function (req, res) {

    let address = req.body["address"];
    let curve = req.body["curve"];

    if (!address) { return invalidReqResponse(res); }
    let checkedAddress;
    try {
        checkedAddress = ethers.utils.getAddress(address);
        if (checkedAddress.length !== 42) {
            throw new Error("invalid address length expecting 40 or 42 hexadecimal characters");
        }
        if (curve != 1 && curve != 2) {
            throw new Error("invalid curve expecting 1 or 2");
        }
        // If address is okay, submit request for virtualMintDeposit
        console.log(`Attempting virtualMintDeposit for ${address} ...`);
        let deposit = await FaucetHandler.runVirtualMintDepositForAddress(address, curve == 2);
        if (deposit.error === "A current faucet request is already running for this address!") {
            console.log(`virtualMintDeposit for ${address} denied due to an already running request`);
            throw new Error(deposit.error);
        }
        if (deposit.error) {
            console.error("Internal error during deposit:=", deposit.error);
            throw new Error(`could not complete deposit to ${address}`);
        } else {
            console.log(`Deposit to ${address} for 100,000 tokens successful w/ ethereum txHash: ${deposit}`)
            return res.send({ depositedTo: address, ethereumTxHash: deposit, error: false })
        }
    } catch (ex) {
        if (ex.reason) {
            return res.send(errorResponse(ex.reason));
        }
        if (ex.message) {
            return res.send(errorResponse(ex.message));
        }
        res.send(errorResponse("an unknown error ocurred"));
    }

    res.send("OK")
};