import * as functions from 'firebase-functions';
import * as express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send(`
  <!doctype html>
    <head>
      <title>Party-stream</title>
    </head>
    <body>
      <h1> Does this work? </h1>
    </body>
  </html>`);
});

app.get('/test', (req, res) => {
  res.send("hi");
});

exports.app = functions.https.onRequest(app);