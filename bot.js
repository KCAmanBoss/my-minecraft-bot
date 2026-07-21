const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const mineflayer = require('mineflayer');
const express = require('express');

// Light web server for cron-job pinging
const app = express();
app.get('/', (req, res) => res.status(200).send('OK'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Web server running on port ${PORT}`));

// Minecraft bot setup
const bot = mineflayer.createBot({
  host: '148.113.30.96', // Updated Direct IP
  port: 7037,            // Updated Port
  username: 'bot3',
  version: false
});

let isLogged = false;

bot.on('messagestr', (message) => {
  console.log('[MC Chat]:', message);
  if (message.includes('/login') || message.includes('register') || message.includes('authenticate')) {
    if (!isLogged) {
      console.log('Sending login command...');
      bot.chat('/login ilovegay');
      isLogged = true;
    }
  }
});

bot.on('spawn', () => {
  console.log('Bot successfully spawned into Minecraft!');
  isLogged = false;
  setTimeout(() => {
    if (!isLogged) {
      bot.chat('/login ilovegay');
    }
  }, 3000);
});

bot.on('error', (err) => console.log('Bot Error:', err));
bot.on('end', () => console.log('Bot disconnected. Restarting...'));
