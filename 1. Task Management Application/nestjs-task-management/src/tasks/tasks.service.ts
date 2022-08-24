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
  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }
  // getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
  //   const { status, search } = filterDto;
  //   let tasks = this.getAllTasks();
  //   if (status) {
  //     tasks = tasks.filter((task) => task.status === status);
  //   }
  //   if (search) {
  //     tasks = tasks.filter(
  //       (task) =>
  //         task.title.includes(search) || task.description.includes(search),
  //     );
  //   }
  //   return tasks;
  // }
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
  // updateTask(id: string, status: TaskStatus): Task {
  //   const task = this.getTaskBydId(id);
  //   task.status = status;
  //   return task;
  // }
  async deleteTask(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Task with ID "${id}" not found`);

    // const found = this.getTaskBydId(id);
    // this.tasks = this.tasks.filter((task) => task.id != found.id);
  }
}
// updateTask(id: string, status: TaskStatus): Task {
//   this.tasks.map((task) => {
//     if (task.id == id) {
//       switch (status) {
//         case TaskStatus.OPEN:
//           task.status = TaskStatus.OPEN;
//           break;
//         case TaskStatus.IN_PROGRESS:
//           task.status = TaskStatus.IN_PROGRESS;
//           break;
//         case TaskStatus.DONE:
//           task.status = TaskStatus.DONE;
//           break;
//         default:
//           break;
//       }
//     }
//     return task;
//   });
//   return this.tasks.find((task) => task.id == id);
// }
