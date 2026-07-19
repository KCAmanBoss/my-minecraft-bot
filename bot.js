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
bot.on('spawn', () => {
  console.log(`${bot.username} has spawned in the server.`);

  // Reset any automatic movement or falling velocity instantly on spawn
  bot.clearControlStates();
  if (bot.entity) {
    bot.entity.velocity.set(0, 0, 0);
  }

  console.log('Bot position stabilized.');
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
