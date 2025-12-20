import { TasksService } from './tasks.service';
import { SchedulerService } from '../scheduler/scheduler.service';
interface CreateTaskDto {
    command: string;
    cpu: number;
    mem: number;
}
export declare class TasksController {
    private readonly tasksService;
    private readonly schedulerService;
    constructor(tasksService: TasksService, schedulerService: SchedulerService);
    create(body: CreateTaskDto): Promise<{
        task: import("../common/types").TaskRecord;
        scheduleResults: {
            taskId: string;
            nodeId?: string;
        }[];
    }>;
    list(): import("../common/types").TaskRecord[];
    poll(nodeId: string): import("../common/types").TaskRecord[];
    updateStatus(id: string, body: {
        status: 'RUNNING' | 'SUCCESS' | 'FAILED';
    }): import("../common/types").TaskRecord | undefined;
    remove(id: string): import("../common/types").TaskRecord | null;
}
export {};
