import { forwardRef, Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { NodesModule } from '../nodes/nodes.module';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [NodesModule, forwardRef(() => TasksModule)],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}

import { forwardRef, Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { NodesModule } from '../nodes/nodes.module';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [NodesModule, forwardRef(() => TasksModule)],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}


