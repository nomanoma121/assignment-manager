import { Client, TextChannel, EmbedBuilder } from 'discord.js';
import { injectable } from 'tsyringe';
import { Task } from '../../domain/entities/Task.js';

@injectable()
export class DiscordNotifier {
  constructor(private client: Client) {}

  async sendReminderNotification(
    channelId: string,
    tasks: Task[]
  ): Promise<void> {
    try {
      const channel = await this.client.channels.fetch(channelId);
      if (!channel || !channel.isTextBased()) {
        console.error(`Channel ${channelId} not found or not text-based`);
        return;
      }

      if (tasks.length === 0) return;

      const embed = new EmbedBuilder()
        .setColor('#FF6B35')
        .setTitle('📚 課題リマインダー')
        .setDescription('近日締切の課題があります！')
        .setTimestamp();

      tasks.forEach((task, index) => {
        const daysUntilDue = task.getDaysUntilDue();
        const dueStatus =
          daysUntilDue === 0
            ? '今日締切!'
            : daysUntilDue === 1
              ? '明日締切!'
              : daysUntilDue < 0
                ? `${Math.abs(daysUntilDue)}日過ぎています`
                : `あと${daysUntilDue}日`;

        embed.addFields({
          name: `${task.subject} - ${task.name}`,
          value: `📅 ${task.dueDate.toLocaleDateString('ja-JP')} (${dueStatus})${
            task.description ? `\n📝 ${task.description}` : ''
          }`,
          inline: false,
        });
      });

      await (channel as TextChannel).send({ embeds: [embed] });
    } catch (error) {
      console.error('Error sending reminder notification:', error);
    }
  }

  async sendClassEndedPrompt(channelId: string): Promise<void> {
    try {
      const channel = await this.client.channels.fetch(channelId);
      if (!channel || !channel.isTextBased()) {
        console.error(`Channel ${channelId} not found or not text-based`);
        return;
      }

      const embed = new EmbedBuilder()
        .setColor('#4CAF50')
        .setTitle('🎓 授業終了')
        .setDescription(
          '授業お疲れ様でした！\n新しい課題がある場合は `/add_task` コマンドで登録しましょう。'
        )
        .setTimestamp();

      await (channel as TextChannel).send({ embeds: [embed] });
    } catch (error) {
      console.error('Error sending class ended prompt:', error);
    }
  }
}
