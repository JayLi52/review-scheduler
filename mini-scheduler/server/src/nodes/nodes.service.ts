import { Injectable, Logger } from '@nestjs/common';
import { NodeInfo } from '../common/types';

interface RegisterNodeDto {
  id: string;
  name?: string;
  totalCpu: number;
  totalMem: number;
  freeCpu?: number;
  freeMem?: number;
}

interface HeartbeatDto {
  id: string;
  freeCpu: number;
  freeMem: number;
}

@Injectable()
export class NodesService {
  private readonly logger = new Logger(NodesService.name);
  private readonly nodes = new Map<string, NodeInfo>();
  private readonly unhealthyThresholdMs = 10_000;
  private readonly offlineThresholdMs = 30_000;

  constructor() {
    setInterval(() => this.sweepHealth(), 5_000);
  }

  register(dto: RegisterNodeDto): NodeInfo {
    const now = Date.now();
    const existing = this.nodes.get(dto.id);
    const node: NodeInfo = {
      id: dto.id,
      name: dto.name ?? dto.id,
      totalCpu: dto.totalCpu,
      totalMem: dto.totalMem,
      freeCpu: dto.freeCpu ?? dto.totalCpu,
      freeMem: dto.freeMem ?? dto.totalMem,
      lastHeartbeat: now,
      status: 'ONLINE',
      runningTaskIds: existing?.runningTaskIds ?? [],
    };
    this.nodes.set(dto.id, node);
    this.logger.log(`Node registered/updated: ${dto.id}`);
    return node;
  }

  heartbeat(dto: HeartbeatDto): NodeInfo | undefined {
    const node = this.nodes.get(dto.id);
    if (!node) {
      return undefined;
    }
    node.freeCpu = dto.freeCpu;
    node.freeMem = dto.freeMem;
    node.lastHeartbeat = Date.now();
    node.status = 'ONLINE';
    return node;
  }

  list(): NodeInfo[] {
    return Array.from(this.nodes.values());
  }

  get(id: string): NodeInfo | undefined {
    return this.nodes.get(id);
  }

  remove(id: string): boolean {
    const node = this.nodes.get(id);
    if (!node) return false;
    this.nodes.delete(id);
    this.logger.log(`Node removed: ${id}`);
    return true;
  }

  assignTask(nodeId: string, taskId: string, cpu: number, mem: number): boolean {
    const node = this.nodes.get(nodeId);
    if (!node) return false;
    if (node.freeCpu < cpu || node.freeMem < mem || node.status !== 'ONLINE') return false;
    node.freeCpu -= cpu;
    node.freeMem -= mem;
    node.runningTaskIds.push(taskId);
    return true;
  }

  sweepHealth() {
    const now = Date.now();
    this.nodes.forEach((node) => {
      const delta = now - node.lastHeartbeat;
      const prev = node.status;
      if (delta > this.offlineThresholdMs) {
        node.status = 'OFFLINE';
      } else if (delta > this.unhealthyThresholdMs) {
        node.status = 'UNHEALTHY';
      } else {
        node.status = 'ONLINE';
      }
      if (prev !== node.status) {
        this.logger.warn(`Node ${node.id} status -> ${node.status}`);
      }
    });
  }
}

export type { RegisterNodeDto, HeartbeatDto };


