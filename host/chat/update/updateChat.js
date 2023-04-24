/**
 *
 * @param {any[]} chats
 * @param {String} uid
 * @param {AbortSignal} abortSignal
 * @param {ServerResponse} res
 * @returns {Promise<void>}
 */
module.exports = async function (chats, uid, abortSignal, res) {
  const openAiClient = require("../../openai/client/OpenAiClient");

  const MAX_CHAT_LENGTH = 6;
  if (chats.length > MAX_CHAT_LENGTH) {
    chats = chats.slice(chats.length - MAX_CHAT_LENGTH, chats.length);
  }

  const onContent = content => {
    res.write(content)
  }

  await openAiClient.updateChat(chats, onContent, uid, abortSignal)
}
