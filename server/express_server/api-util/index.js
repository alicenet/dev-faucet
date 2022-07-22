module.exports.errorResponse = function (msg) {
    return {
        error: msg,
    }
}

module.exports.invalidReqResponse = function (res) {
    return res.send(module.exports.errorResponse("Invalid request. Did you mean '/faucet/<address>?'"));
}