const admin = require('firebase-admin');

const collections = [
  'played-games',
  'users'
];

function backup(req, res) {
  var db = admin.firestore();
  var data = {};

  Promise.all(collections.map((c) => {
    data[c] = {};

    //  Read each item, return a promise to wait for the results.
    return db.collection(c)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          data[c][doc.id] = doc.data();
        });
      })
      .catch(error => {
        res.status(500).send(`Error getting document data: ${error}`);
      });
  }))
    .then(() => {
      res.status(200).send(data);
    })
    .catch(error => {
      res.status(500).send(`Error backing up data: ${error}`);
    });
}

module.exports = backup;
