const {rest} = require("cranny");

module.exports = [
  'post',
  rest(async (req, res, signal) => {
    const updateChatHost = require("../updateChatHost");
    return await updateChatHost(req, res, signal);
  })
];
