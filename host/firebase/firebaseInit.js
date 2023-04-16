module.exports = function () {
  const {initializeApp, cert} = require('firebase-admin/app');

  if (process.env.NODE_ENV === 'development') {
    const path = `${__dirname}\\..\\.env`
    require('dotenv').config({path: path});
  }
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

  initializeApp({
    credential: cert(serviceAccount),
    databaseURL: 'https://will-chat-assistant.firebaseio.com'
  });
}
