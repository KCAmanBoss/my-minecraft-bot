const mineflayer = require('mineflayer');
const { Client, GatewayIntentBits } = require('discord.js');

// --- CONFIGURATION ---
const BOT_PASSWORD = 'ilovegay'; 
const DISCORD_TOKEN = process.env.DISCORD_TOKEN; 
const CHANNEL_ID = process.env.CHANNEL_ID; 

// Initialize Discord Client with MessageContent Intent
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent 
  ]
});

// Initialize Mineflayer Bot
const bot = mineflayer.createBot({
  host: '148.113.30.96', 
  port: 7037,            
  username: process.env.MC_USERNAME || 'bot3',
  version: '1.20.1',
  physicsEnabled: false 
});

// --- DISCORD EVENTS ---
client.once('clientReady', () => {
  console.log(`Discord bot logged in as ${client.user.tag}`);
});

// Relay Discord messages to Minecraft
client.on('messageCreate', (message) => {
  if (message.author.bot || message.channel.id !== CHANNEL_ID) return;
  bot.chat(`[Discord] ${message.author.username}: ${message.content}`);
});

// --- MINECRAFT EVENTS ---
let hasLoggedIn = false;

bot.on('spawn', () => {
  console.log(`${bot.username} spawned into Minecraft world.`);
  
  // Send /login command 2 seconds after joining using template literals (backticks)
  setTimeout(() => {
    if (!hasLoggedIn) {
      console.log('Sending auto-login command...');
      bot.chat(`/login ${BOT_PASSWORD}`);
      hasLoggedIn = true;
    }

    // Enable physics safely 3 seconds after login completes
    setTimeout(() => {
      bot.physics.enabled = true;
      bot.clearControlStates();
      console.log('Physics enabled. Bot ready!');
      
      const channel = client.channels.cache.get(CHANNEL_ID);
      if (channel) channel.send('✅ **Bot successfully connected and logged into Minecraft!**');
    }, 3000);
  }, 2000);
});

// Relay Minecraft chat to Discord
bot.on('chat', (username, message) => {
  if (username === bot.username) return;

  const channel = client.channels.cache.get(CHANNEL_ID);
  if (channel) {
    channel.send(`**[MC] ${username}**: ${message}`);
  }
});

bot.on('kicked', (reason) => {
  console.log(`Bot was kicked: ${reason}`);
  hasLoggedIn = false;
  const channel = client.channels.cache.get(CHANNEL_ID);
  if (channel) channel.send(`❌ **Bot kicked from server:** ${reason}`);
});

bot.on('end', () => {
  console.log('Bot disconnected from Minecraft.');
  hasLoggedIn = false;
});

bot.on('error', (err) => console.log(`Mineflayer Error: ${err}`));

client.login(DISCORD_TOKEN);
