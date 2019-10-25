const admin = require('firebase-admin');

function convertPlayerIds(req, res) {
  var log = '';

  //  Try and find the user.
  admin.firestore().collection('played-games')
    .get()
    .then(function(querySnapshot) {
      const promises = [];
      querySnapshot.forEach(function(doc) {
        const playedGame = doc.data();

        //  If we have a map, turn it into an array.
        const originalIds = playedGame.playerIds;
        const playerIds = originalIds ? Object.keys(originalIds) : [];
        log += `Old ids: ${JSON.stringify(originalIds)}, New ids: ${playerIds}<br />`;

        promises.push(admin.firestore().collection('played-games').doc(doc.id)
          .set({
            playerIds
          }, { merge: true }));
      });

      return Promise.all(promises)
        .then(() => {
          res.status(200).send(`Updated ${promises.count} games<br />${log}`);
        });
    })
    .catch(function(error) {
      res.status(500).send(`Error getting documents: ${error}`);
    });

}

module.exports = convertPlayerIds;
