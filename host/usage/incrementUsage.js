/**
 * @param {String} uid
 * @param {Number} numTokens
 * @returns {Promise<void>}
 */
module.exports = async function (uid, numTokens) {
  const { getFirestore, FieldValue } = require('firebase-admin/firestore');

  const db = getFirestore();

  const usageRef = db.collection('usage').doc(uid);

  await usageRef.set({
    numTokens: FieldValue.increment(numTokens)
  }, {merge: true});
}
