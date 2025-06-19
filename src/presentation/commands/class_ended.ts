import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
} from 'discord.js';
import { container } from 'tsyringe';
import { DiscordNotifier } from '../../infrastructure/services/DiscordNotifier.js';
import { config } from '../../config.js';

export const data = new SlashCommandBuilder()
  .setName('class_ended')
  .setDescription('授業終了の通知を送信します（管理者のみ）')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);

export async function execute(
  interaction: ChatInputCommandInteraction
): Promise<void> {
  try {
    // 権限チェック
    if (
      !interaction.memberPermissions?.has(PermissionFlagsBits.ManageMessages)
    ) {
      await interaction.reply({
        content: '❌ このコマンドを実行する権限がありません。',
        ephemeral: true,
      });
      return;
    }

    const discordNotifier = container.resolve(DiscordNotifier);

    // 授業終了通知を送信
    await discordNotifier.sendClassEndedPrompt(config.CLASS_UPDATES_CHANNEL_ID);

    await interaction.reply({
      content: '✅ 授業終了の通知を送信しました。',
      ephemeral: true,
    });
  } catch (error) {
    console.error('Error in class_ended command:', error);

    await interaction.reply({
      content: '❌ 通知の送信中にエラーが発生しました。',
      ephemeral: true,
    });
  }
}
