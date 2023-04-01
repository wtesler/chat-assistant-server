module.exports = async function (chats, res) {
  const openAiClient = await require("../../openai/client/OpenAiClient");

  for await (const tokens of openAiClient.updateChatAsync(chats)) {
    res.write(tokens)
  }
}
