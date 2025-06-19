import * as cron from 'node-cron';
import { container } from 'tsyringe';
import { ITaskService } from '../../application/services/ITaskService.js';
import { DiscordNotifier } from '../services/DiscordNotifier.js';
import { config } from '../../config.js';

export class ReminderJob {
  private taskService: ITaskService;
  private discordNotifier: DiscordNotifier;

  constructor() {
    this.taskService = container.resolve<ITaskService>('ITaskService');
    this.discordNotifier = container.resolve(DiscordNotifier);
  }

  public start(): void {
    // 毎日午前9時にリマインダーを送信
    cron.schedule('0 9 * * *', async () => {
      console.log('Running daily reminder job...');
      await this.sendDailyReminder();
    });

    // 毎週月曜日の午前9時に週次リマインダーを送信
    cron.schedule('0 9 * * 1', async () => {
      console.log('Running weekly reminder job...');
      await this.sendWeeklyReminder();
    });

    console.log('Reminder jobs scheduled successfully');
  }

  private async sendDailyReminder(): Promise<void> {
    try {
      // 今日と明日が締切の課題を取得
      const todayTasks = await this.taskService.getTasksDueInDays(0);
      const tomorrowTasks = await this.taskService.getTasksDueInDays(1);
      const overdueTasks = await this.taskService.getOverdueTasks();

      const urgentTasks = [...overdueTasks, ...todayTasks, ...tomorrowTasks];

      if (urgentTasks.length > 0) {
        await this.discordNotifier.sendReminderNotification(
          config.TASK_REMINDER_CHANNEL_ID,
          urgentTasks
        );
      }
    } catch (error) {
      console.error('Error in daily reminder job:', error);
    }
  }

  private async sendWeeklyReminder(): Promise<void> {
    try {
      // 今週締切の課題を取得（7日以内）
      const weeklyTasks = await this.taskService.getTasksDueInDays(7);

      if (weeklyTasks.length > 0) {
        await this.discordNotifier.sendReminderNotification(
          config.TASK_REMINDER_CHANNEL_ID,
          weeklyTasks
        );
      }
    } catch (error) {
      console.error('Error in weekly reminder job:', error);
    }
  }
}
