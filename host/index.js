(async function () {
  const express = require('express');
  const cors = require("cors");
  const {discoverEndpoints} = require("cranny");

  const environmentSetup = require("./environmentSetup");
  environmentSetup();

  const app = express();

  app.use(express.urlencoded({limit: '20mb', extended: true}));
  app.use(express.json({limit: '5mb'}));

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
  }

  hostEndpoints(endpoints);

  const port = process.env.PORT || 8080;

  if (process.env.NODE_ENV === 'development') {
    await hostDevelopment(app, port)
  } else {
    hostProduction(app, port)
  }

  app.get('/', (req, res) => {
    res.send('Server Running...');
  });
})();

async function hostDevelopment(app, port) {
  const os = require('os');
  const https = require('https');
  const readDevHttpsKey = require("./secrets/specific/readDevHttpsKey");
  const readDevHttpsCert = require("./secrets/specific/readDevHttpsCert");


  let host = 'localhost'
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

  const [devHttpsKey, devHttpsCert] = await Promise.all([readDevHttpsKey(), readDevHttpsCert()]) // ['', '']

  const server = https.createServer({key: devHttpsKey, cert: devHttpsCert}, app);

  server.listen(port, host, () => {
    console.log(`Development server listening on https://${host}:${port}`);
  });
}

function hostProduction(app, port) {
  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}
