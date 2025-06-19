import { describe, it, expect, beforeEach } from 'vitest';
import { Task } from '../domain/entities/Task.js';

describe('Task Entity', () => {
  let task: Task;

  beforeEach(() => {
    task = new Task(
      '1',
      'Test Assignment',
      new Date('2025-06-25'),
      'Mathematics',
      'user123',
      'This is a test assignment',
      new Date('2025-06-20')
    );
  });

  it('should create a task with correct properties', () => {
    expect(task.id).toBe('1');
    expect(task.name).toBe('Test Assignment');
    expect(task.subject).toBe('Mathematics');
    expect(task.registeredBy).toBe('user123');
    expect(task.description).toBe('This is a test assignment');
  });

  it('should check if task is overdue', () => {
    const overdueTasks = new Task(
      '2',
      'Overdue Assignment',
      new Date('2025-06-19'), // Yesterday
      'Science',
      'user123'
    );

    expect(overdueTasks.isOverdue()).toBe(true);
    expect(task.isOverdue()).toBe(false);
  });

  it('should check if task is due today', () => {
    const todayTask = new Task(
      '3',
      'Today Assignment',
      new Date(), // Today
      'English',
      'user123'
    );

    expect(todayTask.isDueToday()).toBe(true);
    expect(task.isDueToday()).toBe(false);
  });

  it('should calculate days until due', () => {
    const daysUntilDue = task.getDaysUntilDue();
    expect(daysUntilDue).toBeGreaterThan(0);
  });

  it('should check deletion permissions', () => {
    expect(task.canBeDeletedBy('user123')).toBe(true);
    expect(task.canBeDeletedBy('user456')).toBe(false);
  });
});
