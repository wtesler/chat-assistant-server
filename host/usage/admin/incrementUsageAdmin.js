
(async () => {
  require("../../environmentSetup")(true);
  const incrementUsage = require('../incrementUsage');

  await incrementUsage('a4U52JTGzLTqUbAQyG93HcpfNDw2', 50);

  console.log('Success');
})();
