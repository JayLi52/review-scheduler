import { NodesService } from './nodes.service';
import type { HeartbeatDto, RegisterNodeDto } from './nodes.service';
export declare class NodesController {
    private readonly nodesService;
    constructor(nodesService: NodesService);
    register(body: RegisterNodeDto): import("../common/types").NodeInfo;
    heartbeat(body: HeartbeatDto): import("../common/types").NodeInfo | {
        error: string;
    };
    list(): import("../common/types").NodeInfo[];
    remove(id: string): boolean;
}
