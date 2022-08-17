import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskBydId(id: string): Task {
    return this.tasks.find((task) => task.id == id);
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

  deleteTaskBydId(id: string): Task {
    const deletedData = this.tasks.find((task) => task.id == id);
    const taskIndex = this.tasks.map((task) => task.id).indexOf(id);
    this.tasks.splice(taskIndex, 1);
    return deletedData;
  }

  deleteTask(id: string): void {
    this.tasks = this.tasks.filter((task) => task.id != id);
  }
}
