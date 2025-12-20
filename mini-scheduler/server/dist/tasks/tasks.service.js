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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const events_gateway_1 = require("../events/events.gateway");
let TasksService = class TasksService {
    eventsGateway;
    constructor(eventsGateway) {
        this.eventsGateway = eventsGateway;
    }
    tasks = [];
    emitUpdate() {
        this.eventsGateway.server.emit('task-update', this.tasks);
    }
    create(spec) {
        const now = Date.now();
        const task = {
            id: `task-${now}-${Math.random().toString(16).slice(2, 8)}`,
            ...spec,
            status: 'PENDING',
            createdAt: now,
            updatedAt: now,
        };
        this.tasks.push(task);
        this.emitUpdate();
        return task;
    }
    list() {
        return this.tasks;
    }
    pending() {
        return this.tasks.filter((t) => t.status === 'PENDING');
    }
    getAssignedTasks(nodeId) {
        return this.tasks.filter((t) => t.assignedNodeId === nodeId && t.status === 'ASSIGNED');
    }
    updateStatus(id, status, assignedNodeId) {
        const task = this.tasks.find((t) => t.id === id);
        if (!task)
            return undefined;
        task.status = status;
        task.assignedNodeId = assignedNodeId ?? task.assignedNodeId;
        task.updatedAt = Date.now();
        this.emitUpdate();
        return task;
    }
    resetTasksForNode(nodeId) {
        let changed = false;
        this.tasks.forEach((t) => {
            if (t.assignedNodeId === nodeId && t.status === 'RUNNING') {
                t.status = 'PENDING';
                t.assignedNodeId = undefined;
                t.updatedAt = Date.now();
                changed = true;
            }
        });
        if (changed)
            this.emitUpdate();
    }
    remove(id) {
        const index = this.tasks.findIndex((t) => t.id === id);
        if (index !== -1) {
            const deletedTask = this.tasks[index];
            this.tasks.splice(index, 1);
            this.emitUpdate();
            return deletedTask;
        }
        return null;
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [events_gateway_1.EventsGateway])
], TasksService);
//# sourceMappingURL=tasks.service.js.map