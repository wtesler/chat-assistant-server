const {authorizedRest} = require("firebase-roles");

module.exports = [
  'post',
  authorizedRest(async (req, res, user, signal) => {
    const updateChatHost = require("../updateChatHost");
    return await updateChatHost(req, res, user, signal);
  })
];
