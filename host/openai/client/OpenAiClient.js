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
   * @param {String} uid
   * @param {AbortSignal} abortSignal
   * @returns {Promise<void>}
   */
  async* updateChatAsync(chats, uid, abortSignal) {
    const {OpenAIApi} = require("openai");
    const {encode} = require('gpt-3-encoder')

    const openai = new OpenAIApi(this.configuration);

    let fullTextResponse = ''

    let numInputTokens = 0
    for (const chat of chats) {
      const chatTokens = encode(chat.content)
      numInputTokens += chatTokens.length
    }

    try {
      const response = await openai.createChatCompletion(
        {
          model: 'gpt-3.5-turbo',
          messages: chats,
          stream: true,
          user: uid
        },
        {
          responseType: 'stream',
          signal: abortSignal
        },
      )

      for await (const chunk of response.data) {
        const lines = chunk.toString().split('\n').filter((line) => line.trim().startsWith('data: '))

        const contentBatch = []

        for (const line of lines) {
          const message = line.replace(/^data: /, '')
          if (message === '[DONE]') {
            break
          }

          const json = JSON.parse(message)
          const content = json.choices[0].delta.content
          if (content) {
            contentBatch.push(content)
          }
        }

        const text = contentBatch.join('')

        fullTextResponse += text

        yield text
      }
    } catch (e) {
      if (e.response && e.response.statusText) {
        const error = new Error(e.response.statusText)
        error.code = e.response.status
        throw error
      } else {
        throw e
      }
    } finally {
      const responseTokens = encode(fullTextResponse)
      const numResponseTokens = responseTokens.length
      const numTokens = numInputTokens + numResponseTokens

      const incrementUsage = require('../../usage/incrementUsage')
      await incrementUsage(uid, numTokens)
    }
  }
}

module.exports = new OpenAiClient(process.env.OPEN_AI_KEY)
