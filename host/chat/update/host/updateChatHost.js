/**
 *
 * @param {Request} req
 * @param {ServerResponse} res
 * @param {DecodedIdToken} user
 * @param {AbortSignal} abortSignal
 * @returns {Promise<String>}
 */
module.exports = async function (req, res, user, abortSignal) {
  const updateChat = require("../updateChat");
  const {parameterError} = require("cranny");

  const chats = req.body.chats;
  if (!chats) {
    parameterError(req, true);
  }

  if (!Array.isArray(chats) || chats.length === 0) {
    parameterError(req, false);
  }

  for (const chat of chats) {
    if (!chat.role || !chat.content) {
      parameterError(req, false);
    }
  }

  await updateChat(chats, user.uid, abortSignal, res);

  return ""
};
