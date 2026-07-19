const mineflayer = require('mineflayer');
const { Client, GatewayIntentBits } = require('discord.js');

// --- CONFIGURATION ---
// --- CONFIGURATION ---
const BOT_PASSWORD = 'ilovegay'; 
const DISCORD_TOKEN = process.env.DISCORD_TOKEN; 
const CHANNEL_ID = process.env.CHANNEL_ID;

// Initialize Discord Client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Initialize Minecraft Bot
const bot = mineflayer.createBot({
  host: '148.113.30.96', 
  port: 7037,            
  username: 'bot1',
  version: '1.20.1',
  physicsEnabled: false // Keeps your login movement fix intact
});

// --- DISCORD EVENTS ---
client.once('ready', () => {
  console.log(`Discord bot logged in as ${client.user.tag}`);
});

// Send messages from Discord into Minecraft chat
client.on('messageCreate', (message) => {
  if (message.author.bot || message.channel.id !== CHANNEL_ID) return;
  bot.chat(`[Discord] ${message.author.username}: ${message.content}`);
});

// --- MINECRAFT EVENTS ---
// Scan all incoming chat messages for the login prompt
bot.on('messagestr', (message) => {
  if (message.includes('/login')) {
    console.log('EasyAuth login prompt detected. Sending password...');
    bot.chat(`/login ${BOT_PASSWORD}`);
    
    setTimeout(() => {
      bot.physics.enabled = true;
      bot.clearControlStates();
      console.log('Bot successfully authenticated and stable. Physics enabled.');
      
      const channel = client.channels.cache.get(CHANNEL_ID);
      if (channel) channel.send('✅ **Bot successfully connected and logged into Minecraft!**');
    }, 4000);
  }
});

// Forward Minecraft server chat over to Discord
bot.on('chat', (username, message) => {
  if (username === bot.username) return;

  const channel = client.channels.cache.get(CHANNEL_ID);
  if (channel) {
    channel.send(`**[MC] ${username}**: ${message}`);
  }
});

bot.on('spawn', () => {
  console.log(`${bot.username} joined the match/world.`);
});

bot.on('kicked', (reason) => {
  console.log(`Bot was kicked: ${reason}`);
  const channel = client.channels.cache.get(CHANNEL_ID);
  if (channel) channel.send(`❌ **Bot was kicked from the server:** ${reason}`);
});

bot.on('error', (err) => console.log(`Error: ${err}`));

// Log in to Discord
client.login(DISCORD_TOKEN);
