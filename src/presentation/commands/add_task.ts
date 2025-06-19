import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from 'discord.js';
import { container } from 'tsyringe';
import { ITaskService } from '../../application/services/ITaskService.js';
import { CustomError } from '../../common/errors/CustomError.js';

export const data = new SlashCommandBuilder()
  .setName('add_task')
  .setDescription('新しい課題を追加します')
  .addStringOption(option =>
    option.setName('name').setDescription('課題名').setRequired(true)
  )
  .addStringOption(option =>
    option.setName('subject').setDescription('科目名').setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName('due_date')
      .setDescription('締切日 (YYYY-MM-DD形式)')
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName('description')
      .setDescription('課題の詳細説明（任意）')
      .setRequired(false)
  );

export async function execute(
  interaction: ChatInputCommandInteraction
): Promise<void> {
  try {
    const name = interaction.options.getString('name', true);
    const subject = interaction.options.getString('subject', true);
    const dueDateString = interaction.options.getString('due_date', true);
    const description = interaction.options.getString('description');

    // 日付の検証とパース
    const dueDate = new Date(dueDateString);
    if (isNaN(dueDate.getTime())) {
      await interaction.reply({
        content:
          '❌ 無効な日付形式です。YYYY-MM-DD形式で入力してください。（例: 2025-06-25）',
        ephemeral: true,
      });
      return;
    }

    const taskService = container.resolve<ITaskService>('ITaskService');

    const task = await taskService.addTask({
      name,
      subject,
      dueDate,
      description: description || undefined,
      registeredBy: interaction.user.id,
    });

    const embed = new EmbedBuilder()
      .setColor('#4CAF50')
      .setTitle('✅ 課題が追加されました')
      .addFields(
        { name: '📚 科目', value: task.subject, inline: true },
        { name: '📝 課題名', value: task.name, inline: true },
        {
          name: '📅 締切日',
          value: task.dueDate.toLocaleDateString('ja-JP'),
          inline: true,
        }
      )
      .setTimestamp();

    if (task.description) {
      embed.addFields({
        name: '📄 詳細',
        value: task.description,
        inline: false,
      });
    }

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error('Error in add_task command:', error);

    if (error instanceof CustomError) {
      await interaction.reply({
        content: `❌ ${error.message}`,
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: '❌ 課題の追加中にエラーが発生しました。',
        ephemeral: true,
      });
    }
  }
}
