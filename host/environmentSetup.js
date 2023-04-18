module.exports = function (isDevelopment = false) {
  if (isDevelopment) {
    process.env.NODE_ENV = 'development'
  }
  const {reportError} = require('google-cloud-report-error');
  process.env.GCLOUD_PROJECT = 'will-chat-assistant';
  global.crannyReportError = e => reportError(e, 'default');

  require("./firebase/firebaseInit")();
};
