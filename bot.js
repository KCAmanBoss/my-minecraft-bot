const mineflayer = require('mineflayer');

const BOT_PASSWORD = 'ilovegay'; 

const bot = mineflayer.createBot({
  host: '148.113.30.96', 
  port: 7037,            
  username: 'bot1',
  version: '1.20.1'      
});

// Intercept incoming position/teleport packets from the server to prevent mismatches
bot.on('packet', (data, metadata) => {
  if (metadata.name === 'position' && bot.entity) {
    // Drop current velocity to ensure no drifting packets are generated
    bot.entity.velocity.set(0, 0, 0);
    bot.clearControlStates();
  }
});

// Scan all incoming chat messages for the login prompt
bot.on('messagestr', (message) => {
  if (message.includes('/login')) {
    console.log('EasyAuth login prompt detected. Sending password...');
    bot.chat(`/login ${BOT_PASSWORD}`);
  }
});

bot.on('spawn', () => {
  console.log(`${bot.username} has spawned successfully.`);
});

bot.on('kicked', (reason) => console.log(`Bot was kicked: ${reason}`));
bot.on('error', (err) => console.log(`Error: ${err}`));
