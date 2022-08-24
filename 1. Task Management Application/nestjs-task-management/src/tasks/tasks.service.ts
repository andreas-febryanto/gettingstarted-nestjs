import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
// import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(
    // @InjectRepository(TaskRepository)
    // private taskRepository: TaskRepository,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}
  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.taskRepository.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'task.title LIKE :search OR task.description LIKE :search',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }

  async getTaskBydId(id: number): Promise<Task> {
    const found = await this.taskRepository.findOneBy({ id });
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return found;
  }
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    await task.save();

    return task;
  }

  async updateTask(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskBydId(id);
    task.status = status;
    await task.save();
    return task;
  }

  async deleteTask(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Task with ID "${id}" not found`);

    // const found = this.getTaskBydId(id);
    // this.tasks = this.tasks.filter((task) => task.id != found.id);
  }
}
