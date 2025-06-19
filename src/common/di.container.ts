import { container } from 'tsyringe';
import { ITaskRepository } from '../domain/repositories/ITaskRepository.js';
import { PrismaTaskRepository } from '../infrastructure/persistence/PrismaTaskRepository.js';
import { ITaskService } from '../application/services/ITaskService.js';
import { TaskService } from '../application/usecases/TaskService.js';

export function setupDependencyContainer(): void {
  // Repository bindings
  container.registerSingleton<ITaskRepository>(
    'ITaskRepository',
    PrismaTaskRepository
  );

  // Service bindings
  container.registerSingleton<ITaskService>('ITaskService', TaskService);

  console.log('Dependency container configured successfully');
}
