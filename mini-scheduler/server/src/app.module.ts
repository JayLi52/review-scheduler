import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NodesModule } from './nodes/nodes.module';
import { TasksModule } from './tasks/tasks.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [NodesModule, TasksModule, SchedulerModule, EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

// @Module({
//   imports: [],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}
