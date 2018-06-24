const functions = require('firebase-functions');
const request = require('request-promise-native');
const { parseString } = require('xml2js');
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const apis = require('./apis');

admin.initializeApp();

const parseXml = xml => new Promise((resolve, reject) => {
  parseString(xml, (err, result) => {
    if (err) return reject(err);
    return resolve(result);
  });
});

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

function search(req, res) {
  if (req.method !== 'GET') {
    return res.status(403).send('Forbidden!');
  }

  //  TODO simplify search to alphanumeric, lowercase, single spaces
  //  this can then also be used for the key for cached searches.
  const search = req.query.q || '';
  const safeSearch = search.replace(' ', '+');
  const uri = `https://www.boardgamegeek.com/xmlapi2/search?query=${safeSearch}&type=boardgame`;
  request({
    method: 'GET',
    uri
  }).then((response) => {
    return parseXml(response);
  }).then((data) => {
    const games = data.items.item.map(i => ({
      id: i.$.id,
      name: i.name[0].$.value,
    }));

    return res.status(200).send(games);
  }).catch((err) => {
    return res.status(500).send(`An error occured: ${err}`);
  });
}

function getGame(req, res) {
  const id = req.params.id;
  const uri = `https://www.boardgamegeek.com/xmlapi2/thing?id=${id}&type=boardgame`;
  request({
    method: 'GET',
    uri
  }).then((response) => {
    return parseXml(response);
  }).then((data) => {
    const game = data.items.item[0];
    return res.status(200).send(game);
  }).catch((err) => {
    return res.status(500).send(`An error occured: ${err}`);
  });
}

function getGameThumbnail(req, res) {
  const id = req.params.id;
  const uri = `https://www.boardgamegeek.com/xmlapi2/thing?id=${id}&type=boardgame`;
  request({
    method: 'GET',
    uri
  }).then((response) => {
    return parseXml(response);
  }).then((data) => {
    const thumbnail = data.items.item[0].thumbnail[0];
    //  Browser cache: 5m, CDN: 10m
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    return request(thumbnail).pipe(res);
  }).catch((err) => {
    return res.status(500).send(`An error occured: ${err}`);
  });
}

// build multiple CRUD interfaces:
app.get('/search', search);
app.get('/games/:id', getGame);
app.get('/games/:id/thumbnail', getGameThumbnail);
app.get('/search-users', apis.searchUsers);
app.get('/admin/backup', apis.backup);
app.get('/admin/update-created-at', apis.updateCreatedAt);
app.get('/admin/update-player-ids', apis.updatePlayerIds);
// app.get('/:id', (req, res) => res.send(Widgets.getById(req.params.id)));
// app.post('/', (req, res) => res.send(Widgets.create()));
// app.put('/:id', (req, res) => res.send(Widgets.update(req.params.id, req.body)));
// app.delete('/:id', (req, res) => res.send(Widgets.delete(req.params.id)));
// app.get('/', (req, res) => res.send(Widgets.list()));

// Expose Express API as a single Cloud Function:
exports.api = functions.https.onRequest(app);
