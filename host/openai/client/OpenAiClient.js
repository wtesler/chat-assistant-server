class OpenAiClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async updateChat(chats) {
    const request = require('https-client');

    const body = {
      model: 'gpt-3.5-turbo',
      messages: chats
    };
    const headers = {
      Authorization: `Bearer ${this.apiKey}`
    };
    const options = {response: 60000, deadline: 120000};

    const response = await request('POST', '/v1/chat/completions', 'api.openai.com', body, headers, options);

    const responseMessage = response.choices[0].message.content

    return responseMessage;
  }
}

module.exports = (async function () {
  const readOpenAiKey = require("../../secrets/specific/readOpenAiKey");
  const key = await readOpenAiKey();
  return new OpenAiClient(key);
})();
