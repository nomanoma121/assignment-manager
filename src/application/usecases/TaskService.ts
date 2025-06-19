import { inject, injectable } from 'tsyringe';
import { Task } from '../../domain/entities/Task.js';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository.js';
import { CreateTaskRequest, ITaskService } from '../services/ITaskService.js';
import { CustomError } from '../../common/errors/CustomError.js';

@injectable()
export class TaskService implements ITaskService {
  constructor(
    @inject('ITaskRepository') private taskRepository: ITaskRepository
  ) {}

  async addTask(request: CreateTaskRequest): Promise<Task> {
    // Business logic validation
    if (!request.name?.trim()) {
      throw new CustomError('課題名は必須です', 'INVALID_INPUT');
    }

    if (!request.subject?.trim()) {
      throw new CustomError('科目名は必須です', 'INVALID_INPUT');
    }

    if (request.dueDate <= new Date()) {
      throw new CustomError(
        '締切日は未来の日付である必要があります',
        'INVALID_INPUT'
      );
    }

    const taskData = {
      name: request.name.trim(),
      dueDate: request.dueDate,
      subject: request.subject.trim(),
      description: request.description?.trim() || null,
      registeredBy: request.registeredBy,
    };

    return await this.taskRepository.create(taskData);
  }

  async listActiveTasks(): Promise<Task[]> {
    return await this.taskRepository.findAllActive();
  }

  async deleteTask(taskId: string, userId: string): Promise<boolean> {
    const task = await this.taskRepository.findById(taskId);

    if (!task) {
      throw new CustomError('指定された課題が見つかりません', 'TASK_NOT_FOUND');
    }

    if (!task.canBeDeletedBy(userId)) {
      throw new CustomError(
        'この課題を削除する権限がありません',
        'PERMISSION_DENIED'
      );
    }

    return await this.taskRepository.delete(taskId, userId);
  }

  async searchTasksByName(keyword: string): Promise<Task[]> {
    if (!keyword?.trim()) {
      throw new CustomError('検索キーワードは必須です', 'INVALID_INPUT');
    }

    return await this.taskRepository.findByNameKeyword(keyword.trim());
  }

  async searchTasksBySubject(subject: string): Promise<Task[]> {
    if (!subject?.trim()) {
      throw new CustomError('科目名は必須です', 'INVALID_INPUT');
    }

    return await this.taskRepository.findBySubject(subject.trim());
  }

  async getTaskById(taskId: string): Promise<Task | null> {
    if (!taskId?.trim()) {
      throw new CustomError('課題IDは必須です', 'INVALID_INPUT');
    }

    return await this.taskRepository.findById(taskId.trim());
  }

  async getTasksDueInDays(days: number): Promise<Task[]> {
    if (days < 0) {
      throw new CustomError('日数は0以上である必要があります', 'INVALID_INPUT');
    }

    return await this.taskRepository.findDueTasks(days);
  }

  async getOverdueTasks(): Promise<Task[]> {
    return await this.taskRepository.findOverdueTasks();
  }
}
