const ethers = require("ethers");
const aliceNetFactoryAbi = require("./AliceNetFactoryABI.json");

/**
 * Handles all interactions with child processes to npx hardhat and running virtualMintDeposits
 */
class FaucetHandler {

    constructor() {
        this.runningRequests = [];
    }



    async runVirtualMintDepositForAddress(address, isBN = false) {
        // If address is in request list deny the funding request
        if (this.runningRequests.indexOf(this.prefixCurve(address, isBN)) !== -1) {
            return ({ error: "A current faucet request is already running for this address!" })
        }

        try {
            // Add address to request list
            this.addAddressToRequests(address, isBN);
            // establish funder private key and factory abi
            let pk = process.env.FUNDER_PRIVATE_KEY;
            let factoryABI = aliceNetFactoryAbi;
            // setup funding wallet
            let provider = new ethers.providers.JsonRpcProvider(process.env.ETH_RPC)
            let fundingWallet = new ethers.Wallet(pk, provider)
            // init factory contract and get be token address
            let factoryContract = new ethers.Contract(process.env.FACTORY_CONTRACT_ADDRESS, factoryABI, provider)
            let bTokenAddress = await factoryContract.lookup(ethers.utils.formatBytes32String("ALCB"));
            // provide contract interface
            let iface = new ethers.utils.Interface([
                "function virtualMintDeposit(uint8 accountType_,address to_,uint256 amount_)",
            ]);
            // encode interface method call
            let input = iface.encodeFunctionData("virtualMintDeposit", [
                isBN ? 2 : 1,
                address,
                100000,
            ]);
            console.log("Waiting for virtualMintDeposit for address", address, "with a curve of", isBN ? "2" : "1");
            // call and wait for virtualMintDeposit
            let tx = await factoryContract
                .connect(fundingWallet)
                .callAny(bTokenAddress, 0, input);
            await tx.wait();

            /** Receipt and event if needed for debugging 
             
             let receipt = await provider.getTransactionReceipt(tx.hash);
             let intrface = new ethers.utils.Interface([
                 "event DepositReceived(uint256 indexed depositID, uint8 indexed accountType, address indexed depositor, uint256 amount)",
                ]);
                let data = receipt.logs[0].data;
                let topics = receipt.logs[0].topics;
                let event = intrface.decodeEventLog("DepositReceived", data, topics);
                console.log(event)
            */

            // Clear request from list and return hash
            this.clearAddressFromRequests(address, isBN);
            return tx.hash
        }
        catch (ex) {
            let errMsg = ex.message + `with address ${address} and isBN ${isBN}`; 
            console.log(errMsg)
            // Clear request from list and return error
            this.clearAddressFromRequests(address, isBN);
            return { error: errMsg};
        }
    }

    prefixCurve(address, isBN) {
        return isBN ? "2" : "1" + address;
    }

    addAddressToRequests(address, isBN) {
        this.runningRequests.push(this.prefixCurve(address, isBN)); // prefix the address with curve type for tracking running requests
    }

    clearAddressFromRequests(address, isBN) {
        let clearIdx = this.runningRequests.indexOf(this.prefixCurve(address, isBN))
        if (clearIdx !== -1) {
            this.runningRequests.splice(clearIdx, 1);
        }
    }

}


module.exports = new FaucetHandler();

