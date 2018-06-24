const admin = require('firebase-admin');

function searchUsers(req, res) {
  //  Get the search query.
  const search = req.query.q || '';

  //  Try and find the user.
  admin.auth().getUserByEmail(search)
    .then(function(userRecord) {
      //  Return the fields we allow the user to search for.
      const provider = userRecord.providerData[0];
      const photoURL = provider.photoURL
        ? provider.photoURL
        : userRecord.photoURL; // firebase caches photos for too long, prefer the provider.
      const record = {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        photoURL,
      };
      return res.status(200).send(record);
    })
    .catch(function(error) {
      if (error.code === 'auth/user-not-found') {
        return res.status(404).send('User not found');
      }

      return res.status(500).send(`Error searching for user: ${error}`);
    });
}

module.exports = searchUsers;
