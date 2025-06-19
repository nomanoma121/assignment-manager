import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from 'discord.js';
import { container } from 'tsyringe';
import { ITaskService } from '../../application/services/ITaskService.js';
import { Task } from '../../domain/entities/Task.js';

export const data = new SlashCommandBuilder()
  .setName('list_tasks')
  .setDescription('登録されている課題一覧を表示します')
  .addStringOption(option =>
    option
      .setName('filter')
      .setDescription('フィルター条件')
      .setRequired(false)
      .addChoices(
        { name: '全ての課題', value: 'all' },
        { name: '今日締切', value: 'today' },
        { name: '明日締切', value: 'tomorrow' },
        { name: '今週締切', value: 'this_week' },
        { name: '期限切れ', value: 'overdue' }
      )
  )
  .addStringOption(option =>
    option
      .setName('subject')
      .setDescription('特定の科目で絞り込み')
      .setRequired(false)
  );

export async function execute(
  interaction: ChatInputCommandInteraction
): Promise<void> {
  try {
    const filter = interaction.options.getString('filter') || 'all';
    const subject = interaction.options.getString('subject');

    const taskService = container.resolve<ITaskService>('ITaskService');
    let tasks: Task[] = [];

    // フィルター条件に応じて課題を取得
    switch (filter) {
      case 'today':
        tasks = await taskService.getTasksDueInDays(0);
        break;
      case 'tomorrow':
        tasks = await taskService.getTasksDueInDays(1);
        break;
      case 'this_week':
        tasks = await taskService.getTasksDueInDays(7);
        break;
      case 'overdue':
        tasks = await taskService.getOverdueTasks();
        break;
      default:
        tasks = await taskService.listActiveTasks();
    }

    // 科目による絞り込み
    if (subject) {
      tasks = tasks.filter(task =>
        task.subject.toLowerCase().includes(subject.toLowerCase())
      );
    }

    if (tasks.length === 0) {
      const embed = new EmbedBuilder()
        .setColor('#FFC107')
        .setTitle('📋 課題一覧')
        .setDescription('該当する課題はありません。');

      await interaction.reply({ embeds: [embed] });
      return;
    }

    // 課題を締切日順にソート
    tasks.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

    const embed = new EmbedBuilder()
      .setColor('#2196F3')
      .setTitle('📋 課題一覧')
      .setTimestamp();

    // フィルター情報を追加
    let filterDescription = '';
    switch (filter) {
      case 'today':
        filterDescription = '今日締切の課題';
        break;
      case 'tomorrow':
        filterDescription = '明日締切の課題';
        break;
      case 'this_week':
        filterDescription = '今週締切の課題';
        break;
      case 'overdue':
        filterDescription = '期限切れの課題';
        break;
      default:
        filterDescription = '全ての課題';
    }

    if (subject) {
      filterDescription += ` (科目: ${subject})`;
    }

    embed.setDescription(`${filterDescription} - 合計 ${tasks.length}件`);

    // 課題を最大10件まで表示
    const displayTasks = tasks.slice(0, 10);

    displayTasks.forEach((task, index) => {
      const daysUntilDue = task.getDaysUntilDue();
      let dueStatus = '';

      if (task.isOverdue()) {
        dueStatus = `🔴 ${Math.abs(daysUntilDue)}日過ぎています`;
      } else if (task.isDueToday()) {
        dueStatus = '🟡 今日締切!';
      } else if (task.isDueTomorrow()) {
        dueStatus = '🟠 明日締切!';
      } else {
        dueStatus = `🟢 あと${daysUntilDue}日`;
      }

      const fieldValue = [
        `📅 ${task.dueDate.toLocaleDateString('ja-JP')} (${dueStatus})`,
        task.description ? `📝 ${task.description}` : '',
        `👤 登録者: <@${task.registeredBy}>`,
        `🆔 ID: \`${task.id}\``,
      ]
        .filter(Boolean)
        .join('\n');

      embed.addFields({
        name: `${index + 1}. ${task.subject} - ${task.name}`,
        value: fieldValue,
        inline: false,
      });
    });

    if (tasks.length > 10) {
      embed.setFooter({
        text: `他に${tasks.length - 10}件の課題があります。フィルターを使用して絞り込んでください。`,
      });
    }

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error('Error in list_tasks command:', error);

    await interaction.reply({
      content: '❌ 課題一覧の取得中にエラーが発生しました。',
      ephemeral: true,
    });
  }
}
