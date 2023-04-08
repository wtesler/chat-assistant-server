module.exports = async function (chats, abortSignal, res) {
  const openAiClient = require("../../openai/client/OpenAiClient");

  for await (const tokens of openAiClient.updateChatAsync(chats, abortSignal)) {
    res.write(tokens)
  }
}
