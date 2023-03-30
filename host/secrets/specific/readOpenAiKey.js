module.exports = async function() {
  const {readSecret} = require("google-cloud-secrets");
  return await readSecret('projects/262423959530/secrets/open_ai_key/versions/latest');
};
