import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
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

  @Get('poll')
  poll(@Query('nodeId') nodeId: string) {
    if (!nodeId) return [];
    return this.tasksService.getAssignedTasks(nodeId);
  }

  @Post(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: 'RUNNING' | 'SUCCESS' | 'FAILED' },
  ) {
    return this.tasksService.updateStatus(id, body.status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}


