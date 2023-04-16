(async () => {
  process.env.NODE_ENV = 'development'
  require("../../environmentSetup")();
  require('../../firebase/firebaseInit')();

  const UID = 'UN92M297SDbuXGBNmcseF5tjwk23';
  const ROLES = ['admin', 'editor'];

  const {updateUserRoles} = require('firebase-roles');

  const firebaseInit = require('../../firebase/firebaseInit');
  await firebaseInit();

  await updateUserRoles(UID, ROLES);
})();
