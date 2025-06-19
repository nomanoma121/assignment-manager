# Discord Assignment Manager Bot - Setup Guide

## Quick Start

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Then edit `.env` with your Discord bot credentials:

   - `DISCORD_TOKEN`: Your Discord bot token
   - `CLIENT_ID`: Your Discord application client ID
   - `GUILD_ID`: Your Discord server (guild) ID
   - `TASK_REMINDER_CHANNEL_ID`: Channel ID for automatic reminders
   - `CLASS_UPDATES_CHANNEL_ID`: Channel ID for class updates

3. **Initialize database**

   ```bash
   npm run db:push
   ```

4. **Deploy Discord commands**

   ```bash
   npm run deploy-commands
   ```

5. **Start the bot**
   ```bash
   npm run dev
   ```

## Production Deployment

1. **Build the project**

   ```bash
   npm run build
   ```

2. **Start in production mode**
   ```bash
   npm start
   ```

## Available Commands

### Discord Slash Commands

- `/add_task` - Add a new assignment
- `/list_tasks` - List all assignments with filtering options
- `/delete_task` - Delete an assignment (your own only)
- `/class_ended` - Send class ended notification (admin only)

### NPM Scripts

- `npm run dev` - Start in development mode
- `npm run build` - Build the project
- `npm start` - Start in production mode
- `npm run deploy-commands` - Deploy Discord slash commands
- `npm run db:push` - Update database schema
- `npm run db:generate` - Generate Prisma client
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Features

✅ **Implemented:**

- Clean Architecture with proper separation of concerns
- TypeScript with strict type checking
- Discord.js v14 integration
- SQLite database with Prisma ORM
- Dependency injection with tsyringe
- Automatic reminder system with node-cron
- Comprehensive error handling
- Permission-based task deletion
- Rich Discord embeds for responses
- Filtering and search capabilities

## Architecture Overview

```
src/
├── domain/              # Core business logic
│   ├── entities/        # Domain entities (Task)
│   └── repositories/    # Repository interfaces
├── application/         # Use cases and application services
│   ├── services/        # Service interfaces
│   └── usecases/        # Service implementations
├── infrastructure/      # External concerns
│   ├── persistence/     # Database implementations
│   ├── services/        # External service implementations
│   └── jobs/           # Scheduled jobs
├── presentation/        # User interface layer
│   ├── commands/        # Discord slash commands
│   └── handlers/        # Event handlers
├── common/             # Shared utilities
│   ├── errors/         # Custom error classes
│   └── di.container.ts # Dependency injection setup
├── config.ts           # Configuration management
└── main.ts            # Application entry point
```

This architecture ensures:

- **Testability**: Each layer can be tested in isolation
- **Maintainability**: Clear separation of concerns
- **Extensibility**: Easy to add new features
- **Robustness**: Proper error handling and validation
