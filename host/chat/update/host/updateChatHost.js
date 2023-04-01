module.exports = async function (req, res) {
  const updateChat = require("../updateChat");
  const {parameterError} = require("cranny");

  const chats = req.body.chats;
  if (!chats) {
    parameterError(req, true);
  }

  if (!Array.isArray(chats) || chats.length === 0) {
    parameterError(req, false);
  }

  await updateChat(chats, res);

  return ""
};
