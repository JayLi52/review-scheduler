import { forwardRef, Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { SchedulerModule } from '../scheduler/scheduler.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [forwardRef(() => SchedulerModule), EventsModule],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}


