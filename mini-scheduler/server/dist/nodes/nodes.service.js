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
var NodesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodesService = void 0;
const common_1 = require("@nestjs/common");
const events_gateway_1 = require("../events/events.gateway");
let NodesService = NodesService_1 = class NodesService {
    eventsGateway;
    logger = new common_1.Logger(NodesService_1.name);
    nodes = new Map();
    unhealthyThresholdMs = 10_000;
    offlineThresholdMs = 30_000;
    constructor(eventsGateway) {
        this.eventsGateway = eventsGateway;
        setInterval(() => this.sweepHealth(), 5_000);
    }
    emitUpdate() {
        this.eventsGateway.server.emit('node-update', Array.from(this.nodes.values()));
    }
    register(dto) {
        const now = Date.now();
        const existing = this.nodes.get(dto.id);
        const node = {
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
        this.emitUpdate();
        return node;
    }
    heartbeat(dto) {
        const node = this.nodes.get(dto.id);
        if (!node) {
            return undefined;
        }
        node.freeCpu = dto.freeCpu;
        node.freeMem = dto.freeMem;
        node.lastHeartbeat = Date.now();
        node.status = 'ONLINE';
        this.emitUpdate();
        return node;
    }
    list() {
        return Array.from(this.nodes.values());
    }
    get(id) {
        return this.nodes.get(id);
    }
    remove(id) {
        const node = this.nodes.get(id);
        if (!node)
            return false;
        this.nodes.delete(id);
        this.logger.log(`Node removed: ${id}`);
        this.emitUpdate();
        return true;
    }
    assignTask(nodeId, taskId, cpu, mem) {
        const node = this.nodes.get(nodeId);
        if (!node)
            return false;
        if (node.freeCpu < cpu || node.freeMem < mem || node.status !== 'ONLINE')
            return false;
        node.freeCpu -= cpu;
        node.freeMem -= mem;
        node.runningTaskIds.push(taskId);
        this.emitUpdate();
        return true;
    }
    sweepHealth() {
        const now = Date.now();
        let changed = false;
        this.nodes.forEach((node) => {
            const delta = now - node.lastHeartbeat;
            const prev = node.status;
            if (delta > this.offlineThresholdMs) {
                node.status = 'OFFLINE';
            }
            else if (delta > this.unhealthyThresholdMs) {
                node.status = 'UNHEALTHY';
            }
            else {
                node.status = 'ONLINE';
            }
            if (prev !== node.status) {
                this.logger.warn(`Node ${node.id} status -> ${node.status}`);
                changed = true;
            }
        });
        if (changed)
            this.emitUpdate();
    }
};
exports.NodesService = NodesService;
exports.NodesService = NodesService = NodesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [events_gateway_1.EventsGateway])
], NodesService);
//# sourceMappingURL=nodes.service.js.map