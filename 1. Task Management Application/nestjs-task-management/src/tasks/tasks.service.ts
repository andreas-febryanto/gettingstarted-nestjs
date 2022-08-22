import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }
    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.title.includes(search) || task.description.includes(search),
      );
    }
    return tasks;
  }

  getTaskBydId(id: string): Task {
    const found = this.tasks.find((task) => task.id == id);

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return found;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuidv4(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
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

  updateTask(id: string, status: TaskStatus): Task {
    const task = this.getTaskBydId(id);
    task.status = status;
    return task;
  }

  // deleteTask(id: string): Task {
  //   const deletedData = this.tasks.find((task) => task.id == id);
  //   const taskIndex = this.tasks.map((task) => task.id).indexOf(id);
  //   this.tasks.splice(taskIndex, 1);
  //   return deletedData;
  // }

  deleteTask(id: string): void {
    this.tasks = this.tasks.filter((task) => task.id != id);
  }
}
