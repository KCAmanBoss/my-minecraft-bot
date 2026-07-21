// Variable to ensure we only attempt login once per session
let isLogged = false;

bot.on('spawn', () => {
  console.log(`${bot.username} spawned into Minecraft world.`);
  isLogged = false;

  // Backup login attempt after 3 seconds
  setTimeout(() => {
    if (!isLogged) {
      console.log('Sending backup login command...');
      bot.chat('/login ilovegay');
    }
  }, 3000);
});

// Detect EasyAuth prompts directly from server chat
bot.on('messagestr', (message) => {
  console.log('[Server Chat]:', message);
  
  // If EasyAuth asks to login or register, respond immediately
  if (message.includes('/login') || message.includes('register') || message.includes('authenticate')) {
    if (!isLogged) {
      console.log('EasyAuth prompt detected! Sending login...');
      bot.chat('/login ilovegay');
      isLogged = true;
    }
  }
});
 
