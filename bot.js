const express = require('express');
const app = express();
const port = process.env.PORT || 3000; 
const mineflayer = require('mineflayer');

const BOT_PASSWORD = 'ilovegay'; // Your registered password

const bot = mineflayer.createBot({
  host: '148.113.30.96',   // Your server IP
  port: 7037,              // Your server port
  username: 'bot1',        // Your bot's registered username
  version: '1.20.1'        // ViaVersion will translate this older version automatically!
});

// Triggered when the bot successfully connects
bot.on('spawn', () => {
  console.log(`${bot.username} has spawned in the server.`);
  
  // Wait 2 seconds for the server to prompt, then log in
  setTimeout(() => {
    bot.chat(`/login ${BOT_PASSWORD}`);
    console.log('Sent login chat packet.');
  }, 2000);
});

// Simple keep-alive confirmation
bot.on('chat', (username, message) => {
  if (username === bot.username) return;
  if (message === '!ping') {
    bot.chat('Pong! The AFK bot is online.');
  }
});

// Error tracking so it doesn't crash silently
bot.on('kicked', (reason) => console.log('Bot was kicked:', reason));
bot.on('error', (err) => console.error('Bot error:', err));
app.get('/', (req, res) => res.send('Bot is active!'));
app.listen(port, () => console.log(`Web server listening on port ${port}`));