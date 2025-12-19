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
export declare class NodesService {
    private readonly logger;
    private readonly nodes;
    private readonly unhealthyThresholdMs;
    private readonly offlineThresholdMs;
    constructor();
    register(dto: RegisterNodeDto): NodeInfo;
    heartbeat(dto: HeartbeatDto): NodeInfo | undefined;
    list(): NodeInfo[];
    get(id: string): NodeInfo | undefined;
    assignTask(nodeId: string, taskId: string, cpu: number, mem: number): boolean;
    sweepHealth(): void;
}
export type { RegisterNodeDto, HeartbeatDto };
