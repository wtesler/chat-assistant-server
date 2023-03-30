module.exports = async function() {
  const {readSecret} = require("google-cloud-secrets");
  return await readSecret('projects/262423959530/secrets/dev_https_cert/versions/latest');
};
