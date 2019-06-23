import * as functions from 'firebase-functions';
import * as express from 'express';

const app = express();
// const http = require('http').createServer(app);

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.get('/test', (req, res) => {
  res.send("hi");
});

app.post('/startPlayer', (req, res) => {
  let data = req.body;
  res.json(data);
});

app.post('/pausePlayer', (req, res) => {
  let data = req.body;
  res.json(data);
});


exports.app = functions.https.onRequest(app);