import { Task } from '../../domain/entities/Task.js';

export interface CreateTaskRequest {
  name: string;
  dueDate: Date;
  subject: string;
  description?: string;
  registeredBy: string;
}

export interface ITaskService {
  addTask(request: CreateTaskRequest): Promise<Task>;
  listActiveTasks(): Promise<Task[]>;
  deleteTask(taskId: string, userId: string): Promise<boolean>;
  searchTasksByName(keyword: string): Promise<Task[]>;
  searchTasksBySubject(subject: string): Promise<Task[]>;
  getTaskById(taskId: string): Promise<Task | null>;
  getTasksDueInDays(days: number): Promise<Task[]>;
  getOverdueTasks(): Promise<Task[]>;
}
