import { NodesService } from '../nodes/nodes.service';
import { TasksService } from '../tasks/tasks.service';
export declare class SchedulerService {
    private readonly nodesService;
    private readonly tasksService;
    private readonly logger;
    constructor(nodesService: NodesService, tasksService: TasksService);
    schedulePending(): {
        taskId: string;
        nodeId?: string;
    }[];
    private pickBestFit;
}
