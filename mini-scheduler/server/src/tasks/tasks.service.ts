import { Injectable } from '@nestjs/common';
import { TaskRecord, TaskSpec, TaskStatus } from '../common/types';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class TasksService {
  constructor(private readonly eventsGateway: EventsGateway) {}

  private tasks: TaskRecord[] = [];

  private emitUpdate() {
    this.eventsGateway.server.emit('task-update', this.tasks);
  }

  create(spec: TaskSpec): TaskRecord {
    const now = Date.now();
    const task: TaskRecord = {
      id: `task-${now}-${Math.random().toString(16).slice(2, 8)}`,
      ...spec,
      status: 'PENDING',
      createdAt: now,
      updatedAt: now,
    };
    this.tasks.push(task);
    this.emitUpdate();
    return task;
  }

  list(): TaskRecord[] {
    return this.tasks;
  }

  pending(): TaskRecord[] {
    return this.tasks.filter((t) => t.status === 'PENDING');
  }

  getAssignedTasks(nodeId: string): TaskRecord[] {
    return this.tasks.filter((t) => t.assignedNodeId === nodeId && t.status === 'ASSIGNED');
  }

  updateStatus(id: string, status: TaskStatus, assignedNodeId?: string) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return undefined;
    task.status = status;
    task.assignedNodeId = assignedNodeId ?? task.assignedNodeId;
    task.updatedAt = Date.now();
    this.emitUpdate();
    return task;
  }

  resetTasksForNode(nodeId: string) {
    let changed = false;
    this.tasks.forEach((t) => {
      if (t.assignedNodeId === nodeId && t.status === 'RUNNING') {
        t.status = 'PENDING';
        t.assignedNodeId = undefined;
        t.updatedAt = Date.now();
        changed = true;
      }
    });
    if (changed) this.emitUpdate();
  }

  remove(id: string) {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index !== -1) {
      const deletedTask = this.tasks[index];
      this.tasks.splice(index, 1);
      this.emitUpdate();
      return deletedTask;
    }
    return null;
  }
}


