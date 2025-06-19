import { REST, Routes } from 'discord.js';
import { readdir } from 'fs/promises';
import { pathToFileURL } from 'url';
import path from 'path';
import { config } from '../config.js';

interface CommandData {
  name: string;
  description: string;
  options?: any[];
  default_member_permissions?: string;
}

async function deployCommands(): Promise<void> {
  try {
    const commands: CommandData[] = [];
    const commandsPath = path.join(
      process.cwd(),
      'src',
      'presentation',
      'commands'
    );
    const commandFiles = (await readdir(commandsPath)).filter(file =>
      file.endsWith('.ts')
    );

    // Load all command data
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const fileUrl = pathToFileURL(filePath).href;
      const command = await import(fileUrl);

      if ('data' in command) {
        commands.push(command.data.toJSON());
        console.log(`Loaded command data: ${command.data.name}`);
      } else {
        console.warn(`Command ${file} is missing required 'data' property`);
      }
    }

    // Construct and prepare an instance of the REST module
    const rest = new REST().setToken(config.DISCORD_TOKEN);

    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = (await rest.put(
      Routes.applicationGuildCommands(config.CLIENT_ID, config.GUILD_ID),
      { body: commands }
    )) as any[];

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error('Error deploying commands:', error);
    process.exit(1);
  }
}

deployCommands();
