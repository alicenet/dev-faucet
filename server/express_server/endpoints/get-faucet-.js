const { invalidReqResponse } = require("../api-util");

module.exports = async function (req, res) {
    invalidReqResponse(res);
};