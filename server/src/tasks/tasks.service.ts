import { Injectable } from '@nestjs/common';
import { TaskRecord, TaskSpec, TaskStatus } from '../common/types';

@Injectable()
export class TasksService {
  private tasks: TaskRecord[] = [];

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
    return task;
  }

  list(): TaskRecord[] {
    return this.tasks;
  }

  pending(): TaskRecord[] {
    return this.tasks.filter((t) => t.status === 'PENDING');
  }

  updateStatus(id: string, status: TaskStatus, assignedNodeId?: string) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return undefined;
    task.status = status;
    task.assignedNodeId = assignedNodeId ?? task.assignedNodeId;
    task.updatedAt = Date.now();
    return task;
  }

  resetTasksForNode(nodeId: string) {
    this.tasks.forEach((t) => {
      if (t.assignedNodeId === nodeId && t.status === 'RUNNING') {
        t.status = 'PENDING';
        t.assignedNodeId = undefined;
        t.updatedAt = Date.now();
      }
    });
  }
}

import { Injectable } from '@nestjs/common';
import { TaskRecord, TaskSpec, TaskStatus } from '../common/types';

@Injectable()
export class TasksService {
  private tasks: TaskRecord[] = [];

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
    return task;
  }

  list(): TaskRecord[] {
    return this.tasks;
  }

  pending(): TaskRecord[] {
    return this.tasks.filter((t) => t.status === 'PENDING');
  }

  updateStatus(id: string, status: TaskStatus, assignedNodeId?: string) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return undefined;
    task.status = status;
    task.assignedNodeId = assignedNodeId ?? task.assignedNodeId;
    task.updatedAt = Date.now();
    return task;
  }

  resetTasksForNode(nodeId: string) {
    this.tasks.forEach((t) => {
      if (t.assignedNodeId === nodeId && t.status === 'RUNNING') {
        t.status = 'PENDING';
        t.assignedNodeId = undefined;
        t.updatedAt = Date.now();
      }
    });
  }
}


