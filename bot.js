const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const mineflayer = require('mineflayer');
const express = require('express');

// --- 1. LIGHTWEIGHT WEB SERVER (FOR KEEP-ALIVE) ---
const app = express();
app.get('/', (req, res) => res.status(200).send('OK'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Web server running on port ${PORT}`));

// --- 2. READ BOTS FROM ENVIRONMENT VARIABLE ---
// Example env value: "bot3" or "bot1,bot3" or "bot1,bot2,bot3"
const activeBotsEnv = process.env.ACTIVE_BOTS || 'bot3'; 
const botList = activeBotsEnv.split(',').map(name => name.trim()).filter(Boolean);

const SERVER_HOST = '148.113.30.96';
const SERVER_PORT = 7037;
const BOT_PASSWORD = 'ilovegay';

// --- 3. BOT CREATOR FUNCTION ---
function createBotAccount(username, delay) {
  setTimeout(() => {
    console.log(`Connecting ${username}...`);

    const bot = mineflayer.createBot({
      host: SERVER_HOST,
      port: SERVER_PORT,
      username: username,
      version: false
    });

    let isLogged = false;

    // Auto-Login / EasyAuth Listener
    bot.on('messagestr', (message) => {
      console.log(`[${username} Chat]:`, message);
      if (message.includes('/login') || message.includes('register') || message.includes('authenticate')) {
        if (!isLogged) {
          console.log(`Sending login command for ${username}...`);
          bot.chat(`/login ${BOT_PASSWORD}`);
          isLogged = true;
        }
      }
    });

    bot.on('spawn', () => {
      console.log(`${username} successfully spawned!`);
      isLogged = false;
      setTimeout(() => {
        if (!isLogged) {
          bot.chat(`/login ${BOT_PASSWORD}`);
        }
      }, 3000);
    });

    bot.on('error', (err) => console.log(`${username} Error:`, err));
    
    bot.on('end', (reason) => {
      console.log(`${username} disconnected (${reason}). Reconnecting in 30 seconds...`);
      setTimeout(() => createBotAccount(username, 0), 30000);
    });

  }, delay);
}

// --- 4. START BOTS LISTED IN ENVIRONMENT VARIABLE ---
console.log(`Starting active bots: ${botList.join(', ')}`);
botList.forEach((username, index) => {
  createBotAccount(username, index * 10000);
});
