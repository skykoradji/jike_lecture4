require('dotenv').config();
const express = require('express');

const bodyParser = require('body-parser');
const port = parseInt(process.env.PORT, 10) || 3000
const { sendMessage, sendEvent } = require('./lib/dialogflow');

const server = express();
// parse the body
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.post('/dialogflow/query', async (req, res) => {
  try {
    const payload = await sendMessage(req.body.message);
    res.json(payload);
  } catch(err) {
    res.json({ stack: err.stack });
  }
});

server.post('/dialogflow/event', async (req, res) => {
  //res.json({ event: true });
  const payload = await sendEvent(req.body.event);
  res.json(payload);
});

server.all('*', (req, res) => {
  res.json();
});

server.listen(port, err => {
  if (err) throw err
  console.log(`> Ready on http://localhost:${port}`)
});
