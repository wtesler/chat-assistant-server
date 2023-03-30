class OpenAiClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async updateChat(message) {
    const request = require('https-client');

    const body = {
      model: 'gpt-3.5-turbo',
      messages: [{role: 'user', content: `${message}`}]
    };
    const headers = {
      Authorization: `Bearer ${this.apiKey}`
    };
    const options = {response: 30000, deadline: 60000};

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
