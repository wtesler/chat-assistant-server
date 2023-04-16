(async function () {
  require("./environmentSetup")();
  require("./firebase/firebaseInit")();

  const express = require('express');
  const cors = require("cors");
  const {discoverEndpoints} = require("cranny");

  const app = express();

  // app.use(express.urlencoded({limit: '20mb', extended: true}));
  app.use(express.json({limit: '1mb'}));

  app.use(cors());

  const endpoints = discoverEndpoints(__dirname);

  const hostEndpoints = (endpoints) => {
    for (const endpoint of endpoints) {
      const type = endpoint.type;
      const name = endpoint.name;
      const func = endpoint.obj;
      app[type](`/${name}`, func);
      console.log(`${name} | ${type.toUpperCase()}`);
    }
  };

  hostEndpoints(endpoints);

  const port = process.env.PORT || 8080;

  if (process.env.NODE_ENV === 'development') {
    await hostDevelopment(app, port);
  } else {
    hostProduction(app, port);
  }

  app.get('/', (req, res) => {
    res.send('Server Running...');
  });
})();

async function hostDevelopment(app, port) {
  const os = require('os');
  const https = require('https');


  let host = 'localhost';
  const networkInterfaces = os.networkInterfaces();
  let foundHost = false;
  for (const devName in networkInterfaces) {
    const iface = networkInterfaces[devName];
    for (const alias of iface) {
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        host = alias.address;
        foundHost = true;
        break;
      }
    }
    if (foundHost) {
      break;
    }
  }

  const server = https.createServer({key: process.env.DEV_HTTPS_KEY, cert: process.env.DEV_HTTPS_CERT}, app);

  server.listen(port, host, () => {
    console.log(`Development server listening on https://${host}:${port}`);
  });
}

function hostProduction(app, port) {
  app.listen(port, () => {
    console.log(`Production server listening on http://localhost:${port}`);
  });
}
