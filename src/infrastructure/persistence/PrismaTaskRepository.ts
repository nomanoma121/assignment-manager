import { PrismaClient } from '@prisma/client';
import { injectable } from 'tsyringe';
import { Task } from '../../domain/entities/Task.js';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository.js';

@injectable()
export class PrismaTaskRepository implements ITaskRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(taskData: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
    const createdTask = await this.prisma.task.create({
      data: {
        name: taskData.name,
        dueDate: taskData.dueDate,
        subject: taskData.subject,
        description: taskData.description,
        registeredBy: taskData.registeredBy,
      },
    });

    return new Task(
      createdTask.id,
      createdTask.name,
      createdTask.dueDate,
      createdTask.subject,
      createdTask.registeredBy,
      createdTask.description,
      createdTask.createdAt
    );
  }

  async findById(id: string): Promise<Task | null> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) return null;

    return new Task(
      task.id,
      task.name,
      task.dueDate,
      task.subject,
      task.registeredBy,
      task.description,
      task.createdAt
    );
  }

  async findAllActive(): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      orderBy: { dueDate: 'asc' },
    });

    return tasks.map(
      task =>
        new Task(
          task.id,
          task.name,
          task.dueDate,
          task.subject,
          task.registeredBy,
          task.description,
          task.createdAt
        )
    );
  }

  async delete(id: string, userId: string): Promise<boolean> {
    try {
      const task = await this.prisma.task.findUnique({
        where: { id },
      });

      if (!task) return false;

      // Check if user has permission to delete
      if (task.registeredBy !== userId) return false;

      await this.prisma.task.delete({
        where: { id },
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  async findByNameKeyword(keyword: string): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: {
        name: {
          contains: keyword,
          mode: 'insensitive',
        },
      },
      orderBy: { dueDate: 'asc' },
    });

    return tasks.map(
      task =>
        new Task(
          task.id,
          task.name,
          task.dueDate,
          task.subject,
          task.registeredBy,
          task.description,
          task.createdAt
        )
    );
  }

  async findBySubject(subject: string): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: {
        subject: {
          contains: subject,
          mode: 'insensitive',
        },
      },
      orderBy: { dueDate: 'asc' },
    });

    return tasks.map(
      task =>
        new Task(
          task.id,
          task.name,
          task.dueDate,
          task.subject,
          task.registeredBy,
          task.description,
          task.createdAt
        )
    );
  }

  async findDueTasks(days: number): Promise<Task[]> {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);
    targetDate.setHours(23, 59, 59, 999);

    const tasks = await this.prisma.task.findMany({
      where: {
        dueDate: {
          lte: targetDate,
          gte: new Date(),
        },
      },
      orderBy: { dueDate: 'asc' },
    });

    return tasks.map(
      task =>
        new Task(
          task.id,
          task.name,
          task.dueDate,
          task.subject,
          task.registeredBy,
          task.description,
          task.createdAt
        )
    );
  }

  async findOverdueTasks(): Promise<Task[]> {
    const now = new Date();
    const tasks = await this.prisma.task.findMany({
      where: {
        dueDate: {
          lt: now,
        },
      },
      orderBy: { dueDate: 'asc' },
    });

    return tasks.map(
      task =>
        new Task(
          task.id,
          task.name,
          task.dueDate,
          task.subject,
          task.registeredBy,
          task.description,
          task.createdAt
        )
    );
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}
