import {
  Client,
  Collection,
  Events,
  Interaction,
  ChatInputCommandInteraction,
} from 'discord.js';
import { container } from 'tsyringe';
import { readdir } from 'fs/promises';
import { pathToFileURL } from 'url';
import path from 'path';

interface Command {
  data: {
    name: string;
    description: string;
  };
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export class CommandHandler {
  private commands: Collection<string, Command>;
  private client: Client;

  constructor(client: Client) {
    this.client = client;
    this.commands = new Collection();
  }

  public async loadCommands(): Promise<void> {
    try {
      const commandsPath = path.join(
        process.cwd(),
        'src',
        'presentation',
        'commands'
      );
      const commandFiles = (await readdir(commandsPath)).filter(file =>
        file.endsWith('.ts')
      );

      for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const fileUrl = pathToFileURL(filePath).href;
        const command = await import(fileUrl);

        if ('data' in command && 'execute' in command) {
          this.commands.set(command.data.name, command);
          console.log(`Loaded command: ${command.data.name}`);
        } else {
          console.warn(
            `Command ${file} is missing required 'data' or 'execute' property`
          );
        }
      }

      console.log(`Successfully loaded ${this.commands.size} commands`);
    } catch (error) {
      console.error('Error loading commands:', error);
    }
  }

  public setupEventListeners(): void {
    this.client.on(
      Events.InteractionCreate,
      async (interaction: Interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const command = this.commands.get(interaction.commandName);
        if (!command) {
          console.error(
            `No command matching ${interaction.commandName} was found.`
          );
          return;
        }

        try {
          await command.execute(interaction);
        } catch (error) {
          console.error(
            `Error executing command ${interaction.commandName}:`,
            error
          );

          const errorMessage = '❌ コマンドの実行中にエラーが発生しました。';

          try {
            if (interaction.replied || interaction.deferred) {
              await interaction.followUp({
                content: errorMessage,
                ephemeral: true,
              });
            } else {
              await interaction.reply({
                content: errorMessage,
                ephemeral: true,
              });
            }
          } catch (replyError) {
            console.error('Error sending error message:', replyError);
          }
        }
      }
    );

    // Client ready event
    this.client.once(Events.ClientReady, readyClient => {
      console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    });

    console.log('Event listeners set up successfully');
  }

  public getCommands(): Collection<string, Command> {
    return this.commands;
  }
}
