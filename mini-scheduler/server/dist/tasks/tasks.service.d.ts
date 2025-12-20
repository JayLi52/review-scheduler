import { TaskRecord, TaskSpec, TaskStatus } from '../common/types';
import { EventsGateway } from '../events/events.gateway';
export declare class TasksService {
    private readonly eventsGateway;
    constructor(eventsGateway: EventsGateway);
    private tasks;
    private emitUpdate;
    create(spec: TaskSpec): TaskRecord;
    list(): TaskRecord[];
    pending(): TaskRecord[];
    getAssignedTasks(nodeId: string): TaskRecord[];
    updateStatus(id: string, status: TaskStatus, assignedNodeId?: string): TaskRecord | undefined;
    resetTasksForNode(nodeId: string): void;
    remove(id: string): TaskRecord | null;
}
