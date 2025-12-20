"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SchedulerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerService = void 0;
const common_1 = require("@nestjs/common");
const nodes_service_1 = require("../nodes/nodes.service");
const tasks_service_1 = require("../tasks/tasks.service");
let SchedulerService = SchedulerService_1 = class SchedulerService {
    nodesService;
    tasksService;
    logger = new common_1.Logger(SchedulerService_1.name);
    constructor(nodesService, tasksService) {
        this.nodesService = nodesService;
        this.tasksService = tasksService;
    }
    schedulePending() {
        const pending = this.tasksService.pending();
        const nodes = this.nodesService.list().filter((n) => n.status === 'ONLINE');
        const results = [];
        pending.forEach((task) => {
            const selected = this.pickBestFit(nodes, task);
            if (selected && this.nodesService.assignTask(selected.id, task.id, task.cpu, task.mem)) {
                this.tasksService.updateStatus(task.id, 'ASSIGNED', selected.id);
                results.push({ taskId: task.id, nodeId: selected.id });
                this.logger.log(`Assigned ${task.id} -> ${selected.id}`);
            }
            else {
                results.push({ taskId: task.id });
            }
        });
        return results;
    }
    pickBestFit(nodes, task) {
        const candidates = nodes.filter((n) => n.freeCpu >= task.cpu && n.freeMem >= task.mem && n.status === 'ONLINE');
        if (!candidates.length)
            return undefined;
        candidates.sort((a, b) => {
            const aCpuRatio = (a.freeCpu - task.cpu) / a.totalCpu;
            const aMemRatio = (a.freeMem - task.mem) / a.totalMem;
            const scoreA = (aCpuRatio + aMemRatio) / 2;
            const bCpuRatio = (b.freeCpu - task.cpu) / b.totalCpu;
            const bMemRatio = (b.freeMem - task.mem) / b.totalMem;
            const scoreB = (bCpuRatio + bMemRatio) / 2;
            return scoreA - scoreB;
        });
        return candidates[0];
    }
};
exports.SchedulerService = SchedulerService;
exports.SchedulerService = SchedulerService = SchedulerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nodes_service_1.NodesService,
        tasks_service_1.TasksService])
], SchedulerService);
//# sourceMappingURL=scheduler.service.js.map