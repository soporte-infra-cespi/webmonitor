var logger = require('../../../../logger.js');
var config = require('../../../../config/config.js');
var db = null;

function initialize() {  
  const admin = require('firebase-admin');
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: config.get('FIREBASE_PROJECTID'),
      clientEmail: config.get('FIREBASE_CLIENTEMAIL'),
      privateKey: config.get('FIREBASE_PRIVATEKEY').replace(/\\n/g, '\n')
    }),
    databaseURL: config.get('FIREBASE_DATABASEURL')
  });
  db = admin.firestore();
  db.settings({timestampsInSnapshots:true});
}

function listAll(onComplete){
  logger.debug('Getting instances using firebase...');
  
  const collectionsString = config.get('FIREBASE_COLLECTION');
  const collectionNames = collectionsString.split(',').map(name => name.trim());
  
  const promises = collectionNames.map(collectionName => {
    return db.collection(collectionName).get();
  });
  
  Promise.all(promises)
    .then((snapshots) => {
      const municipalities = [];
      snapshots.forEach((snapshot) => {
        snapshot.forEach((doc) => {
          municipalities.push(doc.data());
        });
      });
      onComplete(municipalities);
    })
    .catch((err) => {
      logger.error('Error getting documents', err);
    });
}

initialize();

module.exports = {
  listAll:listAll
}
