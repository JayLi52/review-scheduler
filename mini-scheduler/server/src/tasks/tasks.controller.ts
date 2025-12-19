import { Body, Controller, Get, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { SchedulerService } from '../scheduler/scheduler.service';

interface CreateTaskDto {
  command: string;
  cpu: number;
  mem: number;
}

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly schedulerService: SchedulerService,
  ) {}

  @Post()
  async create(@Body() body: CreateTaskDto) {
    const task = this.tasksService.create({
      command: body.command,
      cpu: body.cpu,
      mem: body.mem,
    });
    const scheduleResults = this.schedulerService.schedulePending();
    return { task, scheduleResults };
  }

  @Get()
  list() {
    return this.tasksService.list();
  }
}


