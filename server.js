import express from 'express';
import { middleware, Client } from '@line/bot-sdk';

const PORT = process.env.PORT || 3000;
const { CHANNEL_SECRET, CHANNEL_ACCESS_TOKEN } = process.env;

const config = {
  channelSecret: CHANNEL_SECRET,
  channelAccessToken: CHANNEL_ACCESS_TOKEN,
};

const app = express();

app.get('/', (req, res) => res.send('Hello LINE BOT!(GET)'));

app.post('/webhook', middleware(config), (req, res) => {
  console.log(req.body.events);

  // ここのif分はdeveloper consoleの"接続確認"用なので削除して問題ないです。
  if (req.body.events[0].replyToken === '00000000000000000000000000000000' && req.body.events[1].replyToken === 'ffffffffffffffffffffffffffffffff') {
    res.send('Hello LINE BOT!(POST)');
    console.log('疎通確認用');
    return;
  }

  Promise
    .all(req.body.events.map(handleEvent))
    .then(result => res.json(result));
});

const client = new Client(config);

const handleEvent = (event) => {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text, // 実際に返信の言葉を入れる箇所
  });
};

app.listen(PORT);
console.log(`Server running at ${PORT}`);
