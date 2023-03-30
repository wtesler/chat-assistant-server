const updateChat = require("../updateChat");

(async () => {
  const response = await updateChat('Hello!');
  console.log(response);
})();
