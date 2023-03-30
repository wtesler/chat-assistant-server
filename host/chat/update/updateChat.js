module.exports = async function (message) {
  const openAiClient = await require("../../openai/client/OpenAiClient");

  try {
    const responseMessage = openAiClient.updateChat(message);
    return responseMessage
  } catch (e) {
    console.error(e.message)
    console.error(e.code)
    console.error(e.statusCode)
    throw e
  }
}
