export type NodeStatus = 'ONLINE' | 'UNHEALTHY' | 'OFFLINE';

export interface NodeInfo {
  id: string;
  name?: string;
  totalCpu: number;
  totalMem: number;
  freeCpu: number;
  freeMem: number;
  lastHeartbeat: number;
  status: NodeStatus;
  runningTaskIds: string[];
}

export type TaskStatus = 'PENDING' | 'ASSIGNED' | 'RUNNING' | 'SUCCESS' | 'FAILED';

export interface TaskSpec {
  command: string;
  cpu: number;
  mem: number;
}

export interface TaskRecord extends TaskSpec {
  id: string;
  status: TaskStatus;
  assignedNodeId?: string;
  createdAt: number;
  updatedAt: number;
}


