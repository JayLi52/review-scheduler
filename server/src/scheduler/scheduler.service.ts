import { Injectable, Logger } from '@nestjs/common';
import { NodesService } from '../nodes/nodes.service';
import { TasksService } from '../tasks/tasks.service';
import { NodeInfo, TaskRecord } from '../common/types';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly nodesService: NodesService,
    private readonly tasksService: TasksService,
  ) {}

  schedulePending() {
    const pending = this.tasksService.pending();
    const nodes = this.nodesService.list().filter((n) => n.status === 'ONLINE');
    const results: Array<{ taskId: string; nodeId?: string }> = [];

    pending.forEach((task) => {
      const selected = this.pickBestFit(nodes, task);
      if (selected && this.nodesService.assignTask(selected.id, task.id, task.cpu, task.mem)) {
        this.tasksService.updateStatus(task.id, 'ASSIGNED', selected.id);
        results.push({ taskId: task.id, nodeId: selected.id });
        this.logger.log(`Assigned ${task.id} -> ${selected.id}`);
      } else {
        results.push({ taskId: task.id });
      }
    });

    return results;
  }

  private pickBestFit(nodes: NodeInfo[], task: TaskRecord): NodeInfo | undefined {
    const candidates = nodes.filter(
      (n) => n.freeCpu >= task.cpu && n.freeMem >= task.mem && n.status === 'ONLINE',
    );
    if (!candidates.length) return undefined;
    candidates.sort((a, b) => {
      const scoreA = a.freeCpu - task.cpu + (a.freeMem - task.mem);
      const scoreB = b.freeCpu - task.cpu + (b.freeMem - task.mem);
      return scoreA - scoreB;
    });
    return candidates[0];
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { NodesService } from '../nodes/nodes.service';
import { TasksService } from '../tasks/tasks.service';
import { NodeInfo, TaskRecord } from '../common/types';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly nodesService: NodesService,
    private readonly tasksService: TasksService,
  ) {}

  schedulePending() {
    const pending = this.tasksService.pending();
    const nodes = this.nodesService.list().filter((n) => n.status === 'ONLINE');
    const results: Array<{ taskId: string; nodeId?: string }> = [];

    pending.forEach((task) => {
      const selected = this.pickBestFit(nodes, task);
      if (selected && this.nodesService.assignTask(selected.id, task.id, task.cpu, task.mem)) {
        this.tasksService.updateStatus(task.id, 'ASSIGNED', selected.id);
        results.push({ taskId: task.id, nodeId: selected.id });
        this.logger.log(`Assigned ${task.id} -> ${selected.id}`);
      } else {
        results.push({ taskId: task.id });
      }
    });

    return results;
  }

  private pickBestFit(nodes: NodeInfo[], task: TaskRecord): NodeInfo | undefined {
    const candidates = nodes.filter(
      (n) => n.freeCpu >= task.cpu && n.freeMem >= task.mem && n.status === 'ONLINE',
    );
    if (!candidates.length) return undefined;
    candidates.sort((a, b) => {
      const scoreA = a.freeCpu - task.cpu + (a.freeMem - task.mem);
      const scoreB = b.freeCpu - task.cpu + (b.freeMem - task.mem);
      return scoreA - scoreB;
    });
    return candidates[0];
  }
}


