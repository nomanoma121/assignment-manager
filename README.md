# Assignment Manager Bot

A Discord bot for managing assignments and tasks with automatic reminders, built with TypeScript and Clean Architecture principles.

## Features

- 📝 **Task Management**: Add, list, and delete assignments
- 📅 **Deadline Tracking**: Automatic reminders for upcoming deadlines
- 🎓 **Class Integration**: Post-class task registration prompts
- 🔍 **Search & Filter**: Find tasks by name, subject, or due date
- 👥 **Permission System**: Users can only delete their own tasks
- 🗄️ **Persistent Storage**: SQLite database with Prisma ORM

## Architecture

This project follows **Clean Architecture** principles:

- **Domain Layer**: Core business logic and entities
- **Application Layer**: Use cases and application services
- **Infrastructure Layer**: Database, Discord API, and external services
- **Presentation Layer**: Discord command handlers and user interaction

## Tech Stack

- **Language**: TypeScript
- **Framework**: Discord.js v14
- **Database**: SQLite with Prisma ORM
- **Dependency Injection**: tsyringe
- **Scheduler**: node-cron
- **Testing**: Vitest
- **Linting**: ESLint + Prettier

## Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/nomanoma121/assignment-manager.git
   cd assignment-manager
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Fill in your Discord bot token and other required variables.

4. **Set up the database**

   ```bash
   npm run db:push
   ```

5. **Deploy Discord commands**

   ```bash
   npm run deploy-commands
   ```

6. **Start the bot**
   ```bash
   npm run dev
   ```

## Commands

### `/add_task`

Add a new assignment to the database.

**Options:**

- `name` (required): Assignment name
- `subject` (required): Subject/course name
- `due_date` (required): Due date in YYYY-MM-DD format
- `description` (optional): Additional details

### `/list_tasks`

Display all registered assignments.

**Options:**

- `filter` (optional): Filter by due date (all, today, tomorrow, this_week, overdue)
- `subject` (optional): Filter by specific subject

### `/delete_task`

Delete an assignment (only your own tasks).

**Options:**

- `task_id` (required): The ID of the task to delete

### `/class_ended`

Send a class-ended notification (admin only).

## Development

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
npm start
```

### Linting and Formatting

```bash
npm run lint
npm run format
```

## Project Structure

```
src/
├── application/          # Application layer
│   ├── services/        # Service interfaces
│   └── usecases/        # Use case implementations
├── common/              # Shared utilities
│   ├── di.container.ts  # Dependency injection setup
│   └── errors/          # Custom error classes
├── domain/              # Domain layer
│   ├── entities/        # Domain entities
│   └── repositories/    # Repository interfaces
├── infrastructure/      # Infrastructure layer
│   ├── jobs/           # Scheduled jobs
│   ├── persistence/    # Database implementations
│   └── services/       # External service implementations
├── presentation/        # Presentation layer
│   ├── commands/       # Discord slash commands
│   └── handlers/       # Event handlers
├── config.ts           # Configuration
└── main.ts            # Application entry point
```

## Environment Variables

Create a `.env` file with the following variables:

```env
DISCORD_TOKEN=your_discord_bot_token_here
CLIENT_ID=your_discord_application_client_id_here
GUILD_ID=your_discord_guild_id_here
DATABASE_URL="file:./dev.db"
TASK_REMINDER_CHANNEL_ID=your_reminder_channel_id_here
CLASS_UPDATES_CHANNEL_ID=your_class_updates_channel_id_here
NODE_ENV=development
```

## License

This project is licensed under the ISC License.
