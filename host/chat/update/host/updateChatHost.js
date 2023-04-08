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

  const abortController = new AbortController();

  req.connection.on('close', function() {
    abortController.abort()
  });

  await updateChat(chats, abortController.signal, res);

  return ""
};
