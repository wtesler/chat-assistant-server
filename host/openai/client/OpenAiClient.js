class OpenAiClient {

  /**
   * @param {any[]} chats
   * @param {function(string)} onContent
   * @param {String} uid
   * @param {AbortSignal} abortSignal
   * @returns {Promise<void>}
   */
  async updateChat(chats, onContent, uid, abortSignal) {
    const request = require('https-client');
    const {encode} = require('gpt-3-encoder');

    let numInputTokens = 0;
    for (const chat of chats) {
      const chatTokens = encode(chat.content);
      numInputTokens += chatTokens.length;
    }

    const body = {
      model: 'gpt-3.5-turbo',
      messages: chats,
      stream: true,
      user: uid
    };

    const headers = {
      Authorization: `Bearer ${process.env.OPEN_AI_KEY}`
    };

    const options = {response: 20000, deadline: 120000, verbose: false};

    let fullTextResponse = "";
    const onInternalContent = content => {
      fullTextResponse += content;
    };

    const onChunk = this._createChunkListener(onContent, onInternalContent);

    let response = {};

    try {
      response = await request('POST', '/v1/chat/completions', 'api.openai.com', body, headers, options, abortSignal, onChunk);
    } catch (e) {
      throw e
    } finally {
      const responseTokens = encode(fullTextResponse);
      const numResponseTokens = responseTokens.length;
      const numTokens = numInputTokens + numResponseTokens;

      const incrementUsage = require('../../usage/incrementUsage');
      await incrementUsage(uid, numTokens);
    }

    return response;
  }

  _createChunkListener(onContent, onInternalContent) {
    return chunk => {
      const objects = this._decodeChunk(chunk)
      let overallContent = '';
      for (const obj of objects) {
        if (!obj.choices) {
          if (obj.error) {
            const error = new Error(obj.error.message);
            const type = obj.error.type;
            if (type === 'invalid_api_key') {
              error.statusCode = 401;
            } else {
              error.statusCode = obj.error.code ?? 500;
            }
            throw error;
          } else {
            throw new Error('Unexpected error with OpenAI client.')
          }
        }
        const content = obj.choices[0].delta.content;
        if (content) {
          overallContent += content;
        }
      }
      onContent(overallContent);
      onInternalContent(overallContent);
    }
  }

  _decodeChunk(chunk) {
    const chunkStr = chunk.toString();
    const objects = [];
    let depth = 0;
    let startIndex = -1;
    let inQuotes = false;
    for (let i = 0; i < chunkStr.length; i++) {
      const char = chunkStr[i];
      if (char === '{' && !inQuotes) {
        if (depth === 0) {
          startIndex = i;
        }
        depth++;
      }
      if (char === '}' && !inQuotes) {
        depth--;
        if (depth === 0) {
          const str = chunkStr.substring(startIndex, i + 1);
          const obj = JSON.parse(str);
          objects.push(obj);
        }
      }
      const isRealQuote = char === '"' && chunkStr[i - 1] !== '\\';
      if (isRealQuote) {
        inQuotes = !inQuotes;
      }
    }
    return objects;
  }
}

module.exports = new OpenAiClient()
