"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
let TasksService = class TasksService {
    tasks = [];
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
        return task;
    }
    resetTasksForNode(nodeId) {
        this.tasks.forEach((t) => {
            if (t.assignedNodeId === nodeId && t.status === 'RUNNING') {
                t.status = 'PENDING';
                t.assignedNodeId = undefined;
                t.updatedAt = Date.now();
            }
        });
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)()
], TasksService);
//# sourceMappingURL=tasks.service.js.map