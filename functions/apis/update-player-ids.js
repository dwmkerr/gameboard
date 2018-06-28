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

        //  Copy the players over. If there are players with a id, replace
        //  it with a ud.
        const players = playedGame.players.map(p => {
          const newPlayer = Object.assign({ }, p, {
            uid: p.uid || p.id,
          });
          delete newPlayer.id;
          return newPlayer;
        });
        playerIds[playedGame.scorerUid] = true;
        promises.push(admin.firestore().collection('played-games').doc(doc.id)
          .set({
            players,
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
