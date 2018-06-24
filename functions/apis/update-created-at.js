const moment = require('moment');
const admin = require('firebase-admin');

function updateCreatedAt(req, res) {
  //  Try and find the user.
  admin.firestore().collection('played-games')
    .get()
    .then(function(querySnapshot) {
      const promises = [];
      querySnapshot.forEach(function(doc) {
        const createdAt = doc.data().createdAt;
        if (typeof createdAt === 'number') {
          promises.push(admin.firestore().collection('played-games').doc(doc.id)
            .set({
              createdAt: moment.unix(createdAt / 1000).toDate()
            }, { merge: true }));
        }
        //  Set the playerIds to have the scorerUid.
        const playedGame = doc.data();
        const playerIds = playedGame.playerIds || {};
        playerIds[playedGame.scorerUid] = true;
      });

      return Promise.all(promises)
        .then(() => {
          res.status(200).send(`Updated ${promises.count} games`);
        });
    })
    .catch(function(error) {
      res.status(500).send(`Error getting documents: ${error}`);
    });

}

module.exports = updateCreatedAt;
