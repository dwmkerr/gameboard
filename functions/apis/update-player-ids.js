const admin = require('firebase-admin');

function updatePlayerIds(req, res) {
  //  Try and find the user.
  admin.firestore().collection('played-games')
    .get()
    .then(function(querySnapshot) {
      const promises = [];
      querySnapshot.forEach(function(doc) {
        //  Set the playerIds to have the scorerUid.
        const playedGame = doc.data();
        const playerIds = playedGame.playerIds || {};
        playerIds[playedGame.scorerUid] = true;
        promises.push(admin.firestore().collection('played-games').doc(doc.id)
          .set({
            playerIds
          }, { merge: true }));
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

module.exports = updatePlayerIds;
