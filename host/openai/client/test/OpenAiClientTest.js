(async () => {
  require("../../../environmentSetup")(true);

  const openAiClient = await require('../OpenAiClient');

  let overallContent = ""

  const onContent = content => {
    console.log(content);
    console.log('----------------------');
    overallContent += content;
  }

  const response = await openAiClient.updateChat(
    [
      {role: 'user', content: 'Show me properly formatted json code'}
    ],
    onContent
  );

  console.log(overallContent)

  console.log(response);
})();
