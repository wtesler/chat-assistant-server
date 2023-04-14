class OpenAiClient {
  constructor(apiKey) {
    const {Configuration} = require("openai");
    this.configuration = new Configuration({
      apiKey: apiKey,
    });
  }

  /**
   *
   * @param {any[]} chats
   * @param {AbortSignal} abortSignal
   * @returns {Promise<void>}
   */
  async* updateChatAsync(chats, abortSignal) {
    const {OpenAIApi} = require("openai");
    const openai = new OpenAIApi(this.configuration);


    try {
      const response = await openai.createChatCompletion(
        {
          model: 'gpt-3.5-turbo',
          messages: chats,
          stream: true
        },
        {
          responseType: 'stream',
          signal: abortSignal
        },
      )

      for await (const chunk of response.data) {
        const lines = chunk.toString().split('\n').filter((line) => line.trim().startsWith('data: '))

        const tokens = []

        for (const line of lines) {
          const message = line.replace(/^data: /, '')
          if (message === '[DONE]') {
            break
          }

          const json = JSON.parse(message)
          const token = json.choices[0].delta.content
          if (token) {
            tokens.push(token)
          }
        }

        yield tokens.join('')
      }
    } catch (e) {
      if (e.response && e.response.statusText) {
        const error = new Error(e.response.statusText)
        error.code = e.response.status
        throw error
      } else {
        throw e
      }
    }
  }
}

module.exports = new OpenAiClient(process.env.OPEN_AI_KEY)
