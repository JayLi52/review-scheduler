import { TaskRecord, TaskSpec, TaskStatus } from '../common/types';
export declare class TasksService {
    private tasks;
    create(spec: TaskSpec): TaskRecord;
    list(): TaskRecord[];
    pending(): TaskRecord[];
    getAssignedTasks(nodeId: string): TaskRecord[];
    updateStatus(id: string, status: TaskStatus, assignedNodeId?: string): TaskRecord | undefined;
    resetTasksForNode(nodeId: string): void;
}
