import { NodeInfo } from '../common/types';
import { EventsGateway } from '../events/events.gateway';
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
export declare class NodesService {
    private readonly eventsGateway;
    private readonly logger;
    private readonly nodes;
    private readonly unhealthyThresholdMs;
    private readonly offlineThresholdMs;
    constructor(eventsGateway: EventsGateway);
    private emitUpdate;
    register(dto: RegisterNodeDto): NodeInfo;
    heartbeat(dto: HeartbeatDto): NodeInfo | undefined;
    list(): NodeInfo[];
    get(id: string): NodeInfo | undefined;
    remove(id: string): boolean;
    assignTask(nodeId: string, taskId: string, cpu: number, mem: number): boolean;
    sweepHealth(): void;
}
export type { RegisterNodeDto, HeartbeatDto };
