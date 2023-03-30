module.exports = function () {
  const {reportError} = require('google-cloud-report-error');
  process.env.GCLOUD_PROJECT = 'will-chat-assistant';
  global.crannyReportError = e => reportError(e, 'default');
};
