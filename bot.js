const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const mineflayer = require('mineflayer');
const express = require('express');

// --- 1. LIGHTWEIGHT WEB SERVER (FOR KEEP-ALIVE) ---
const app = express();
app.get('/', (req, res) => res.status(200).send('OK'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Web server running on port ${PORT}`));

// --- 2. BOT CONFIGURATION LIST ---
const botConfigs = [
  { username: 'bot1', password: 'ilovegay' },
  { username: 'bot3', password: 'ilovegay' }
];

const SERVER_HOST = '148.113.30.96';
const SERVER_PORT = 7037;

// --- 3. BOT CREATOR FUNCTION ---
function createBotAccount(config, delay) {
  setTimeout(() => {
    console.log(`Connecting ${config.username}...`);

    const bot = mineflayer.createBot({
      host: SERVER_HOST,
      port: SERVER_PORT,
      username: config.username,
      version: false
    });

    let isLogged = false;

    // Auto-Login / EasyAuth Listener
    bot.on('messagestr', (message) => {
      console.log(`[${config.username} Chat]:`, message);
      if (message.includes('/login') || message.includes('register') || message.includes('authenticate')) {
        if (!isLogged) {
          console.log(`Sending login command for ${config.username}...`);
          bot.chat(`/login ${config.password}`);
          isLogged = true;
        }
      }
    });

    bot.on('spawn', () => {
      console.log(`${config.username} successfully spawned!`);
      isLogged = false;
      setTimeout(() => {
        if (!isLogged) {
          bot.chat(`/login ${config.password}`);
        }
      }, 3000);
    });

    bot.on('error', (err) => console.log(`${config.username} Error:`, err));
    
    // Smooth Reconnect (30s delay to prevent loop fights)
    bot.on('end', (reason) => {
      console.log(`${config.username} disconnected (${reason}). Reconnecting in 30 seconds...`);
      setTimeout(() => createBotAccount(config, 0), 30000);
    });

  }, delay);
}

// --- 4. START ALL BOTS (10-second gap) ---
botConfigs.forEach((config, index) => {
  createBotAccount(config, index * 10000);
});
