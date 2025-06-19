import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from 'discord.js';
import { container } from 'tsyringe';
import { ITaskService } from '../../application/services/ITaskService.js';
import { CustomError } from '../../common/errors/CustomError.js';

export const data = new SlashCommandBuilder()
  .setName('delete_task')
  .setDescription('課題を削除します')
  .addStringOption(option =>
    option
      .setName('task_id')
      .setDescription('削除する課題のID')
      .setRequired(true)
  );

export async function execute(
  interaction: ChatInputCommandInteraction
): Promise<void> {
  try {
    const taskId = interaction.options.getString('task_id', true);
    const userId = interaction.user.id;

    const taskService = container.resolve<ITaskService>('ITaskService');

    // まず課題の存在確認と詳細取得
    const task = await taskService.getTaskById(taskId);
    if (!task) {
      await interaction.reply({
        content: '❌ 指定されたIDの課題が見つかりません。',
        ephemeral: true,
      });
      return;
    }

    // 課題を削除
    const deleted = await taskService.deleteTask(taskId, userId);

    if (deleted) {
      const embed = new EmbedBuilder()
        .setColor('#F44336')
        .setTitle('🗑️ 課題が削除されました')
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

      await interaction.reply({ embeds: [embed] });
    } else {
      await interaction.reply({
        content: '❌ 課題の削除に失敗しました。',
        ephemeral: true,
      });
    }
  } catch (error) {
    console.error('Error in delete_task command:', error);

    if (error instanceof CustomError) {
      let errorMessage = '';
      switch (error.code) {
        case 'TASK_NOT_FOUND':
          errorMessage = '❌ 指定された課題が見つかりません。';
          break;
        case 'PERMISSION_DENIED':
          errorMessage =
            '❌ この課題を削除する権限がありません。自分が登録した課題のみ削除できます。';
          break;
        default:
          errorMessage = `❌ ${error.message}`;
      }

      await interaction.reply({
        content: errorMessage,
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: '❌ 課題の削除中にエラーが発生しました。',
        ephemeral: true,
      });
    }
  }
}
