const { Client, GatewayIntentBits } = require('discord.js');
const discordClient = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });const express = require('express');
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
// Triggered when the bot successfully connects
// Scan all incoming chat messages for the login prompt
bot.on('messagestr', (message) => {
  if (message.includes('/login')) {
    console.log('EasyAuth login prompt detected. Sending password...');
    bot.chat('/login ilovegay');
  }
});

// Clear states to prevent physics anti-cheat conflicts on spawn
bot.on('spawn', () => {
  console.log(`${bot.username} has spawned/moved.`);
  
  // Temporarily disable physics for 1 second to let the server teleport the bot safely
  bot.physics.enabled = false;

  bot.clearControlStates();
  if (bot.entity) {
    bot.entity.velocity.set(0, 0, 0);
  }

  setTimeout(() => {
    bot.physics.enabled = true;
    console.log('Bot physics re-enabled and stabilized safely.');
  }, 1000);
});

// Simple disconnect log
bot.on('end', () => {
  console.log('Bot disconnected from the server.');
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
// Replace the numbers below with your actual Discord channel ID where you will type commands
const DISCORD_CHANNEL_ID = '780447656723087373'; 

discordClient.on('messageCreate', async (message) => {
  if (message.author.bot || message.channel.id !== DISCORD_CHANNEL_ID) return;

  // This forwards your Discord message directly to Minecraft chat
  bot.chat(message.content);
});

discordClient.login(process.env.DISCORD_TOKEN);
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
// This forwards Minecraft chat directly back to your Discord channel
bot.on('chat', (username, message) => {
  // Prevent the bot from forwarding its own messages or loops
  if (username === bot.username) return;

  // Find your Discord channel using the ID you already set up
  const channel = discordClient.channels.cache.get('780447656723087373');
  
  if (channel) {
    // Sends the text to Discord formatted cleanly like: [Minecraft] Player: Hello!
    channel.send(`**[Minecraft] ${username}**: ${message}`)
      .catch(err => console.error('Failed to send message to Discord:', err));
  }
});
