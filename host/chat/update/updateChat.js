/**
 *
 * @param {any[]} chats
 * @param {AbortSignal} abortSignal
 * @param {ServerResponse} res
 * @returns {Promise<void>}
 */
module.exports = async function (chats, abortSignal, res) {
  const openAiClient = require("../../openai/client/OpenAiClient");

  if (chats.length > 20) {
    chats = chats.slice(chats.length - 20, chats.length)
  }

  for await (const tokens of openAiClient.updateChatAsync(chats, abortSignal)) {
    res.write(tokens)
  }
}
