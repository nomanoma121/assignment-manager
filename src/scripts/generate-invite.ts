import 'reflect-metadata';
import { config } from '../config.js';

function generateInviteLink(): void {
  try {
    // Validate configuration
    if (!config.CLIENT_ID) {
      throw new Error('CLIENT_ID is not set in environment variables');
    }

    // Required permissions for the bot
    const permissions = [
      'ViewChannel',           // 1024
      'SendMessages',          // 2048  
      'UseSlashCommands',      // 2147483648
      'EmbedLinks',           // 16384
      'ReadMessageHistory',    // 65536
      'AddReactions',          // 64
    ];

    // Calculate permission integer (sum of all required permissions)
    const permissionValue = 1024 + 2048 + 2147483648 + 16384 + 65536 + 64;

    // Generate invite link
    const inviteLink = `https://discord.com/api/oauth2/authorize?client_id=${config.CLIENT_ID}&permissions=${permissionValue}&scope=bot%20applications.commands`;

    console.log('🔗 Discord Bot Invite Link:');
    console.log('=====================================');
    console.log(inviteLink);
    console.log('=====================================');
    console.log('');
    console.log('📝 Required Permissions:');
    permissions.forEach(perm => console.log(`  ✅ ${perm}`));
    console.log('');
    console.log('🚀 Steps to invite the bot:');
    console.log('1. Click the link above');
    console.log('2. Select your Discord server');
    console.log('3. Make sure all permissions are checked');
    console.log('4. Click "Authorize"');
    console.log('5. Run "npm run deploy-commands" again');
    console.log('');
    console.log('ℹ️  Note: You need Administrator permissions in the server to invite bots.');
    
  } catch (error) {
    console.error('❌ Error generating invite link:', error);
    process.exit(1);
  }
}

generateInviteLink();
