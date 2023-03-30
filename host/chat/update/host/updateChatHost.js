const {parameterError} = require("cranny");
const updateChat = require("../updateChat");
module.exports = async function (req, res) {
  const updateChat = require("../updateChat");

  const message = req.body.message;
  if (!message) {
    parameterError(message);
  }

  const responseMessage = await updateChat(message);

  return {
    message: responseMessage
  }
};
