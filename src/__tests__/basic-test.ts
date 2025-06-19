import 'reflect-metadata';
import { Task } from '../domain/entities/Task.js';
import { setupDependencyContainer } from '../common/di.container.js';
import { container } from 'tsyringe';
import { ITaskService } from '../application/services/ITaskService.js';

async function testBasicFunctionality() {
  try {
    console.log('🧪 Testing basic functionality...');

    // Setup DI container
    setupDependencyContainer();

    // Test Task entity
    const task = new Task(
      '1',
      'Test Assignment',
      new Date('2025-12-25'),
      'Mathematics',
      'user123',
      'This is a test assignment'
    );

    console.log('✅ Task entity created successfully');
    console.log(`   - Name: ${task.name}`);
    console.log(`   - Subject: ${task.subject}`);
    console.log(`   - Due date: ${task.dueDate.toLocaleDateString()}`);
    console.log(`   - Days until due: ${task.getDaysUntilDue()}`);
    console.log(`   - Is overdue: ${task.isOverdue()}`);

    // Test service instantiation
    const taskService = container.resolve<ITaskService>('ITaskService');
    console.log('✅ TaskService instantiated successfully');

    console.log('🎉 All basic tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testBasicFunctionality();
