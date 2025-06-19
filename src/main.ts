import 'reflect-metadata';
import { Client, GatewayIntentBits } from 'discord.js';
import { container } from 'tsyringe';
import { setupDependencyContainer } from './common/di.container.js';
import { CommandHandler } from './presentation/handlers/CommandHandler.js';
import { DiscordNotifier } from './infrastructure/services/DiscordNotifier.js';
import { ReminderJob } from './infrastructure/jobs/ReminderJob.js';
import { config } from './config.js';

async function main(): Promise<void> {
  try {
    console.log('Starting Assignment Manager Bot...');

    // Setup dependency injection container
    setupDependencyContainer();

    // Create Discord client
    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    // Register Discord client in DI container
    container.registerInstance(Client, client);
    container.registerInstance(DiscordNotifier, new DiscordNotifier(client));

    // Setup command handler
    const commandHandler = new CommandHandler(client);
    await commandHandler.loadCommands();
    commandHandler.setupEventListeners();

    // Login to Discord
    await client.login(config.DISCORD_TOKEN);

    // Setup reminder jobs after client is ready
    client.once('ready', () => {
      console.log('Setting up reminder jobs...');
      const reminderJob = new ReminderJob();
      reminderJob.start();
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('Received SIGINT. Graceful shutdown...');
      client.destroy();

      // Disconnect from database
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();
      await prisma.$disconnect();

      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('Received SIGTERM. Graceful shutdown...');
      client.destroy();

      // Disconnect from database
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();
      await prisma.$disconnect();

      process.exit(0);
    });
  } catch (error) {
    console.error('Error starting the bot:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', error => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

main();
