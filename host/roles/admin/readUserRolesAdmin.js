(async () => {
  process.env.NODE_ENV = 'development'
  require("../../environmentSetup")();
  require('../../firebase/firebaseInit')();

  const {readUserRoles} = require('firebase-roles');

  const {users, pageToken} = await readUserRoles(undefined, null, null, 50);
  for (const user of users) {
    console.log(user);
  }
  console.log(`page token: ${pageToken}`);
})();
