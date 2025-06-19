import { Task } from '../entities/Task.js';

export interface ITaskRepository {
  create(task: Omit<Task, 'id' | 'createdAt'>): Promise<Task>;
  findById(id: string): Promise<Task | null>;
  findAllActive(): Promise<Task[]>;
  delete(id: string, userId: string): Promise<boolean>;
  findByNameKeyword(keyword: string): Promise<Task[]>;
  findBySubject(subject: string): Promise<Task[]>;
  findDueTasks(days: number): Promise<Task[]>;
  findOverdueTasks(): Promise<Task[]>;
}
