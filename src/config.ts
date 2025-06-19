import dotenv from 'dotenv';

dotenv.config();

interface Config {
  DISCORD_TOKEN: string;
  CLIENT_ID: string;
  GUILD_ID: string;
  DATABASE_URL: string;
  TASK_REMINDER_CHANNEL_ID: string;
  CLASS_UPDATES_CHANNEL_ID: string;
  NODE_ENV: string;
}

function validateEnvironment(): Config {
  const requiredVars = [
    'DISCORD_TOKEN',
    'CLIENT_ID',
    'GUILD_ID',
    'DATABASE_URL',
    'TASK_REMINDER_CHANNEL_ID',
    'CLASS_UPDATES_CHANNEL_ID',
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }

  return {
    DISCORD_TOKEN: process.env.DISCORD_TOKEN!,
    CLIENT_ID: process.env.CLIENT_ID!,
    GUILD_ID: process.env.GUILD_ID!,
    DATABASE_URL: process.env.DATABASE_URL!,
    TASK_REMINDER_CHANNEL_ID: process.env.TASK_REMINDER_CHANNEL_ID!,
    CLASS_UPDATES_CHANNEL_ID: process.env.CLASS_UPDATES_CHANNEL_ID!,
    NODE_ENV: process.env.NODE_ENV || 'development',
  };
}

export const config: Config = validateEnvironment();
