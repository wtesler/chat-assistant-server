module.exports = async function (chats) {
  const openAiClient = await require("../../openai/client/OpenAiClient");

  const responseMessage = openAiClient.updateChat(chats);
  return responseMessage
}
